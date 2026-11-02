"""One-time transfer into the empty Roofseal D1/R2 stores.

Requires an authenticated Wrangler installation. Run before first deployment only.
Creates a consistent private SQLite backup and SQL export; refuses a nonempty D1.
Never writes credentials to source control or prints account/admin secrets.
"""
import concurrent.futures
import json
import mimetypes
import re
from pathlib import Path
import sqlite3
import tomllib
import urllib.parse
import urllib.request
import urllib.error
import time

ROOT = Path(__file__).resolve().parents[2]
ACCOUNT = "e7c515dde995479daacd82ad79dfc3e8"
DATABASE = "41c9f80b-f6b0-49c3-a0d4-92f20ea8ef4c"
BUCKET = "roofseal-preview-media"
TOKEN = tomllib.loads((Path.home() / "Library/Preferences/.wrangler/config/default.toml").read_text())["oauth_token"]
BASE = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT}"


def request(path, data=None, content_type="application/json", method=None):
    headers = {"Authorization": f"Bearer {TOKEN}", "Content-Type": content_type}
    req = urllib.request.Request(BASE + path, data=data, headers=headers, method=method)
    with urllib.request.urlopen(req, timeout=120) as response:
        return json.load(response)


def query(sql):
    result = request(f"/d1/database/{DATABASE}/query", json.dumps({"sql": sql}).encode())
    if not result.get("success"):
        raise RuntimeError("D1 query failed")
    return result["result"][0]["results"]


if __name__ == "__main__":
    tables = query("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE '_cf_%' AND name NOT LIKE 'sqlite_%'")
    if tables:
        raise SystemExit("D1 is not empty; refusing to overwrite existing records.")
    directory = ROOT / ".data/cloudflare-transfer"
    directory.mkdir(parents=True, exist_ok=True)
    snapshot = directory / "roofseal-snapshot.db"
    fresh = not snapshot.exists()
    target = sqlite3.connect(snapshot)
    if fresh:
        source = sqlite3.connect(ROOT / ".data/roofseal.db")
        source.backup(target)
        source.close()
        # Sessions and local admin UI state must not be carried to the public host.
        for table in ["users_sessions", "payload_locked_documents_rels", "payload_locked_documents", "payload_preferences_rels", "payload_preferences", "enquiry_limits"]:
            target.execute(f'DELETE FROM "{table}"')
        target.execute('ALTER TABLE media ADD COLUMN _objectkey TEXT')
        target.commit()
    statements = list(target.iterdump())
    tables = [row[0] for row in target.execute("SELECT name FROM sqlite_master WHERE type='table'")]
    ordered = []

    def visit(table):
        if table in ordered:
            return
        for foreign_key in target.execute(f'PRAGMA foreign_key_list("{table}")'):
            if foreign_key[2] != table:
                visit(foreign_key[2])
        ordered.append(table)

    for table in tables:
        visit(table)
    groups = {table: [] for table in tables}
    for statement in statements:
        if statement.startswith("INSERT INTO"):
            table = re.match(r'INSERT INTO "([^"]+)"', statement).group(1)
            groups[table].append(statement)
    # D1 autocommits statements: load parents before children instead of relying
    # on deferred foreign keys. Validate the complete export before any transfer.
    lines = [line for line in statements if line.startswith("CREATE TABLE")]
    lines += [statement for table in ordered for statement in groups[table]]
    lines += [line for line in statements if line.startswith("CREATE INDEX") or line.startswith("CREATE UNIQUE INDEX")]
    export = "\n".join(lines)
    validation = sqlite3.connect(":memory:")
    validation.execute("PRAGMA foreign_keys=ON")
    validation.executescript(export)
    assert not validation.execute("PRAGMA foreign_key_check").fetchall()
    validation.close()
    (directory / "roofseal.sql").write_text(export)
    columns = [r[1] for r in target.execute('PRAGMA table_info(media)') if r[1] == "filename" or r[1].endswith("_filename")]
    filenames = sorted({name for row in target.execute("SELECT " + ",".join(columns) + " FROM media") for name in row if name})
    missing = [name for name in filenames if not (ROOT / ".data/media" / name).is_file()]
    if missing:
        raise SystemExit(f"Missing {len(missing)} source files; aborting.")

    def upload(name):
        file = ROOT / ".data/media" / name
        mime = mimetypes.guess_type(name)[0] or "application/octet-stream"
        for attempt in range(5):
            try:
                result = request(f"/r2/buckets/{BUCKET}/objects/{urllib.parse.quote(name, safe='')}", file.read_bytes(), mime, "PUT")
                if not result.get("success"):
                    raise RuntimeError("R2 upload failed")
                break
            except (urllib.error.URLError, TimeoutError):
                if attempt == 4:
                    raise
                time.sleep(2 ** attempt)
        return name

    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        for index, _ in enumerate(pool.map(upload, filenames), 1):
            if index % 50 == 0 or index == len(filenames):
                print(f"Uploaded {index}/{len(filenames)} files", flush=True)
    report = {"media_files": len(filenames), "counts": {table: target.execute(f'SELECT count(*) FROM "{table}"').fetchone()[0] for table in ["products", "resources", "categories", "media", "users", "enquiries"]}}
    (directory / "manifest.json").write_text(json.dumps(report, indent=2))
    print(json.dumps(report))
    print("Media transferred. Import the private .data/cloudflare-transfer/roofseal.sql with Wrangler D1 before deploying.")
