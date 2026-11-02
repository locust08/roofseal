import { type MigrateUpArgs, type MigrateDownArgs, sql } from "@payloadcms/db-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE enquiries ADD COLUMN enquiry_type text`);
  await db.run(sql`ALTER TABLE enquiries ADD COLUMN state text`);
  await db.run(sql`ALTER TABLE enquiries ADD COLUMN project_type text`);
  await db.run(sql`ALTER TABLE enquiries ADD COLUMN project_location text`);
  await db.run(sql`ALTER TABLE enquiries ADD COLUMN estimated_requirements text`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE enquiries DROP COLUMN estimated_requirements`);
  await db.run(sql`ALTER TABLE enquiries DROP COLUMN project_location`);
  await db.run(sql`ALTER TABLE enquiries DROP COLUMN project_type`);
  await db.run(sql`ALTER TABLE enquiries DROP COLUMN state`);
  await db.run(sql`ALTER TABLE enquiries DROP COLUMN enquiry_type`);
}
