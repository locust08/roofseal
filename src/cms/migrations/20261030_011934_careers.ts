import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`careers\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`is_placeholder\` integer DEFAULT true,
  	\`department\` text,
  	\`location\` text,
  	\`employment_type\` text,
  	\`summary\` text,
  	\`description\` text,
  	\`responsibilities\` text,
  	\`requirements\` text,
  	\`display_order\` numeric DEFAULT 100,
  	\`source_key\` text,
  	\`editorial_notes\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`careers_slug_idx\` ON \`careers\` (\`slug\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`careers_source_key_idx\` ON \`careers\` (\`source_key\`);`)
  await db.run(sql`CREATE INDEX \`careers_updated_at_idx\` ON \`careers\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`careers_created_at_idx\` ON \`careers\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`careers__status_idx\` ON \`careers\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_careers_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_is_placeholder\` integer DEFAULT true,
  	\`version_department\` text,
  	\`version_location\` text,
  	\`version_employment_type\` text,
  	\`version_summary\` text,
  	\`version_description\` text,
  	\`version_responsibilities\` text,
  	\`version_requirements\` text,
  	\`version_display_order\` numeric DEFAULT 100,
  	\`version_source_key\` text,
  	\`version_editorial_notes\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`careers\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_careers_v_parent_idx\` ON \`_careers_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_careers_v_version_version_slug_idx\` ON \`_careers_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_careers_v_version_version_source_key_idx\` ON \`_careers_v\` (\`version_source_key\`);`)
  await db.run(sql`CREATE INDEX \`_careers_v_version_version_updated_at_idx\` ON \`_careers_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_careers_v_version_version_created_at_idx\` ON \`_careers_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_careers_v_version_version__status_idx\` ON \`_careers_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_careers_v_created_at_idx\` ON \`_careers_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_careers_v_updated_at_idx\` ON \`_careers_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_careers_v_latest_idx\` ON \`_careers_v\` (\`latest\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`careers_id\` integer REFERENCES careers(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_careers_id_idx\` ON \`payload_locked_documents_rels\` (\`careers_id\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`careers\`;`)
  await db.run(sql`DROP TABLE \`_careers_v\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`categories_id\` integer,
  	\`products_id\` integer,
  	\`resources_id\` integer,
  	\`enquiries_id\` integer,
  	\`enquiry_limits_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`resources_id\`) REFERENCES \`resources\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`enquiries_id\`) REFERENCES \`enquiries\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`enquiry_limits_id\`) REFERENCES \`enquiry_limits\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "categories_id", "products_id", "resources_id", "enquiries_id", "enquiry_limits_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "categories_id", "products_id", "resources_id", "enquiries_id", "enquiry_limits_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_products_id_idx\` ON \`payload_locked_documents_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_resources_id_idx\` ON \`payload_locked_documents_rels\` (\`resources_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_enquiries_id_idx\` ON \`payload_locked_documents_rels\` (\`enquiries_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_enquiry_limits_id_idx\` ON \`payload_locked_documents_rels\` (\`enquiry_limits_id\`);`)
}
