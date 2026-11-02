import { type MigrateUpArgs, type MigrateDownArgs, sql } from "@payloadcms/db-sqlite";
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE resources ADD COLUMN post_category text DEFAULT 'article'`);
  await db.run(sql`ALTER TABLE _resources_v ADD COLUMN version_post_category text DEFAULT 'article'`);
}
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE _resources_v DROP COLUMN version_post_category`);
  await db.run(sql`ALTER TABLE resources DROP COLUMN post_category`);
}
