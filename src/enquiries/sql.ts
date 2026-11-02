type Statement = { sql: string; args: (string | number | null)[] };
type Rows = Record<string, unknown>[];
type SqlClient = {
  execute?: (statement: Statement) => Promise<{ rows: Rows; rowsAffected: number }>;
  prepare?: (sql: string) => { bind: (...args: Statement["args"]) => { all: () => Promise<{ results: Rows; meta: { changes: number } }> } };
};

/** Keep atomic rate reservations and delivery claims identical on libSQL and D1. */
export async function executeSql(client: unknown, statement: Statement): Promise<{ rows: Rows; rowsAffected: number }> {
  const database = client as SqlClient;
  if (database.execute) return database.execute(statement);
  if (database.prepare) {
    const result = await database.prepare(statement.sql).bind(...statement.args).all();
    return { rows: result.results, rowsAffected: result.meta.changes };
  }
  throw new Error("Unsupported enquiry SQL client");
}
