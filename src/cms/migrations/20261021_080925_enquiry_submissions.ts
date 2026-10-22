import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`enquiries_products\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`product_id\` numeric NOT NULL,
    \`title\` text NOT NULL,
    \`slug\` text NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`enquiries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`enquiries_products_order_idx\` ON \`enquiries_products\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`enquiries_products_parent_id_idx\` ON \`enquiries_products\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`enquiries\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`reference\` text NOT NULL,
    \`request_hash\` text NOT NULL,
    \`kind\` text NOT NULL,
    \`name\` text NOT NULL,
    \`email\` text NOT NULL,
    \`phone\` text NOT NULL,
    \`company\` text,
    \`message\` text NOT NULL,
    \`consent_at\` text NOT NULL,
    \`consent_text\` text NOT NULL,
    \`status\` text DEFAULT 'new' NOT NULL,
    \`internal_notes\` text,
    \`email_delivery_status\` text DEFAULT 'pending' NOT NULL,
    \`email_delivery_attempts\` numeric DEFAULT 0 NOT NULL,
    \`email_delivery_last_attempt_at\` text,
    \`email_delivery_next_attempt_at\` text,
    \`email_delivery_last_error\` text,
    \`email_delivery_provider_id\` text,
    \`sheet_delivery_status\` text DEFAULT 'pending' NOT NULL,
    \`sheet_delivery_attempts\` numeric DEFAULT 0 NOT NULL,
    \`sheet_delivery_last_attempt_at\` text,
    \`sheet_delivery_next_attempt_at\` text,
    \`sheet_delivery_last_error\` text,
    \`sheet_delivery_provider_id\` text,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`enquiries_reference_idx\` ON \`enquiries\` (\`reference\`);`)
  await db.run(sql`CREATE INDEX \`enquiries_updated_at_idx\` ON \`enquiries\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`enquiries_created_at_idx\` ON \`enquiries\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`enquiry_limits\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`key\` text NOT NULL,
    \`count\` numeric NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`enquiry_limits_key_idx\` ON \`enquiry_limits\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`enquiry_limits_updated_at_idx\` ON \`enquiry_limits\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`enquiry_limits_created_at_idx\` ON \`enquiry_limits\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`enquiries_id\` integer REFERENCES enquiries(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`enquiry_limits_id\` integer REFERENCES enquiry_limits(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_enquiries_id_idx\` ON \`payload_locked_documents_rels\` (\`enquiries_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_enquiry_limits_id_idx\` ON \`payload_locked_documents_rels\` (\`enquiry_limits_id\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`enquiries_products\`;`)
  await db.run(sql`DROP TABLE \`enquiries\`;`)
  await db.run(sql`DROP TABLE \`enquiry_limits\`;`)
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
    FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`resources_id\`) REFERENCES \`resources\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "categories_id", "products_id", "resources_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "categories_id", "products_id", "resources_id" FROM \`payload_locked_documents_rels\`;`)
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
}
