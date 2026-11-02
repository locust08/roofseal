import { type MigrateUpArgs, type MigrateDownArgs, sql } from "@payloadcms/db-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE products ADD COLUMN application_information text`);
  await db.run(sql`ALTER TABLE _products_v ADD COLUMN version_application_information text`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE _products_v DROP COLUMN version_application_information`);
  await db.run(sql`ALTER TABLE products DROP COLUMN application_information`);
}
