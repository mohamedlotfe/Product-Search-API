import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateInitialSchema1700000000000 implements MigrationInterface {
  name = "CreateInitialSchema1700000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable required extensions
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pg_trgm"`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "ltree"`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "vector"`);

    // Create enums
    await queryRunner.query(
      `CREATE TYPE "supplier_status_enum" AS ENUM('active', 'inactive', 'suspended')`
    );
    await queryRunner.query(
      `CREATE TYPE "product_status_enum" AS ENUM('active', 'inactive', 'draft')`
    );
    await queryRunner.query(
      `CREATE TYPE "variant_status_enum" AS ENUM('active', 'inactive', 'out_of_stock')`
    );

    // Create suppliers table
    await queryRunner.createTable(
      new Table({
        name: "suppliers",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "gen_random_uuid()",
          },
          {
            name: "name",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "email",
            type: "varchar",
            length: "255",
            isNullable: false,
            isUnique: true,
          },
          {
            name: "status",
            type: "supplier_status_enum",
            default: "'active'",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
            isNullable: false,
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "now()",
            isNullable: false,
          },
        ],
      }),
      true
    );

    // Create categories table
    await queryRunner.createTable(
      new Table({
        name: "categories",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "gen_random_uuid()",
          },
          {
            name: "name",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "parent_id",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "path",
            type: "ltree",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
            isNullable: false,
          },
        ],
      }),
      true
    );

    // Create products table
    await queryRunner.createTable(
      new Table({
        name: "products",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "gen_random_uuid()",
          },
          {
            name: "supplier_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "category_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "name",
            type: "varchar",
            length: "500",
            isNullable: false,
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "brand",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "base_price",
            type: "decimal",
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: "status",
            type: "product_status_enum",
            default: "'active'",
            isNullable: false,
          },
          {
            name: "attributes",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "search_vector",
            type: "tsvector",
            isNullable: true,
          },
          {
            name: "embedding",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
            isNullable: false,
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "now()",
            isNullable: false,
          },
        ],
      }),
      true
    );

    // Create product_variants table
    await queryRunner.createTable(
      new Table({
        name: "product_variants",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "gen_random_uuid()",
          },
          {
            name: "product_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "sku",
            type: "varchar",
            length: "100",
            isNullable: false,
            isUnique: true,
          },
          {
            name: "variant_attributes",
            type: "jsonb",
            isNullable: false,
          },
          {
            name: "price",
            type: "decimal",
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: "inventory_count",
            type: "integer",
            default: "0",
            isNullable: false,
          },
          {
            name: "status",
            type: "variant_status_enum",
            default: "'active'",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
            isNullable: false,
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "now()",
            isNullable: false,
          },
        ],
      }),
      true
    );

    // Create product_metrics table
    await queryRunner.createTable(
      new Table({
        name: "product_metrics",
        columns: [
          {
            name: "product_id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "total_sales",
            type: "integer",
            default: "0",
            isNullable: false,
          },
          {
            name: "total_views",
            type: "integer",
            default: "0",
            isNullable: false,
          },
          {
            name: "total_reviews",
            type: "integer",
            default: "0",
            isNullable: false,
          },
          {
            name: "average_rating",
            type: "decimal",
            precision: 3,
            scale: 2,
            default: "0",
            isNullable: false,
          },
          {
            name: "last_sale_date",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "popularity_score",
            type: "decimal",
            precision: 10,
            scale: 4,
            default: "0",
            isNullable: false,
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "now()",
            isNullable: false,
          },
        ],
      }),
      true
    );

    // Create search_analytics table
    await queryRunner.createTable(
      new Table({
        name: "search_analytics",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "gen_random_uuid()",
          },
          {
            name: "query",
            type: "text",
            isNullable: false,
          },
          {
            name: "user_id",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "results_count",
            type: "integer",
            isNullable: false,
          },
          {
            name: "clicked_product_id",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "search_time_ms",
            type: "integer",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
            isNullable: false,
          },
        ],
      }),
      true
    );

    // Create foreign key constraints
    await queryRunner.createForeignKey(
      "categories",
      new TableForeignKey({
        columnNames: ["parent_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "categories",
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
      })
    );

    await queryRunner.createForeignKey(
      "products",
      new TableForeignKey({
        columnNames: ["supplier_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "suppliers",
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
      })
    );

    await queryRunner.createForeignKey(
      "products",
      new TableForeignKey({
        columnNames: ["category_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "categories",
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
      })
    );

    await queryRunner.createForeignKey(
      "product_variants",
      new TableForeignKey({
        columnNames: ["product_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "products",
        onDelete: "CASCADE",
        onUpdate: "NO ACTION",
      })
    );

    await queryRunner.createForeignKey(
      "product_metrics",
      new TableForeignKey({
        columnNames: ["product_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "products",
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
      })
    );

    // Create indexes
    await queryRunner.createIndex(
      "suppliers",
      new TableIndex({ name: "idx_suppliers_status", columnNames: ["status"] })
    );
    await queryRunner.createIndex(
      "suppliers",
      new TableIndex({ name: "idx_suppliers_email", columnNames: ["email"] })
    );
    await queryRunner.createIndex(
      "categories",
      new TableIndex({ name: "idx_categories_parent_id", columnNames: ["parent_id"] })
    );
    await queryRunner.createIndex(
      "categories",
      new TableIndex({ name: "idx_categories_path", columnNames: ["path"], isSpatial: true })
    );
    await queryRunner.createIndex(
      "products",
      new TableIndex({ name: "idx_products_supplier_id", columnNames: ["supplier_id"] })
    );
    await queryRunner.createIndex(
      "products",
      new TableIndex({ name: "idx_products_category_id", columnNames: ["category_id"] })
    );
    await queryRunner.createIndex(
      "products",
      new TableIndex({ name: "idx_products_status", columnNames: ["status"] })
    );
    await queryRunner.createIndex(
      "products",
      new TableIndex({ name: "idx_products_brand", columnNames: ["brand"] })
    );
    await queryRunner.createIndex(
      "products",
      new TableIndex({
        name: "idx_products_search_vector",
        columnNames: ["search_vector"],
        isFulltext: true,
      })
    );
    // Use GIN for JSONB columns instead of GIST
    await queryRunner.query(
      `CREATE INDEX "idx_products_attributes" ON "products" USING GIN ("attributes")`
    );
    await queryRunner.createIndex(
      "product_variants",
      new TableIndex({ name: "idx_product_variants_product_id", columnNames: ["product_id"] })
    );
    await queryRunner.createIndex(
      "product_variants",
      new TableIndex({ name: "idx_product_variants_sku", columnNames: ["sku"] })
    );
    await queryRunner.createIndex(
      "product_variants",
      new TableIndex({ name: "idx_product_variants_status", columnNames: ["status"] })
    );
    await queryRunner.createIndex(
      "product_variants",
      new TableIndex({ name: "idx_product_variants_price", columnNames: ["price"] })
    );
    // Use GIN for JSONB columns instead of GIST
    await queryRunner.query(
      `CREATE INDEX "idx_product_variants_attributes" ON "product_variants" USING GIN ("variant_attributes")`
    );
    await queryRunner.createIndex(
      "product_metrics",
      new TableIndex({
        name: "idx_product_metrics_popularity_score",
        columnNames: ["popularity_score"],
      })
    );
    await queryRunner.createIndex(
      "product_metrics",
      new TableIndex({ name: "idx_product_metrics_total_sales", columnNames: ["total_sales"] })
    );
    await queryRunner.createIndex(
      "search_analytics",
      new TableIndex({ name: "idx_search_analytics_query", columnNames: ["query"] })
    );
    await queryRunner.createIndex(
      "search_analytics",
      new TableIndex({ name: "idx_search_analytics_created_at", columnNames: ["created_at"] })
    );

    // Create full-text search trigger function
    await queryRunner.query(`
            CREATE OR REPLACE FUNCTION update_search_vector()
            RETURNS TRIGGER AS $$
            BEGIN
              NEW.search_vector :=
                setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
                setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
                setweight(to_tsvector('english', COALESCE(NEW.brand, '')), 'C');
              RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

    // Create trigger for automatic search vector updates
    await queryRunner.query(
      `CREATE TRIGGER "products_search_vector_update" BEFORE INSERT OR UPDATE ON "products" FOR EACH ROW EXECUTE FUNCTION update_search_vector()`
    );

    // Insert sample data
    await queryRunner.query(
      `INSERT INTO "suppliers" ("name", "email") VALUES ('TechCorp', 'contact@techcorp.com'), ('FashionHub', 'info@fashionhub.com'), ('HomeGoods', 'sales@homegoods.com')`
    );

    await queryRunner.query(
      `INSERT INTO "categories" ("name") VALUES ('Electronics'), ('Clothing'), ('Home & Garden')`
    );

    await queryRunner.query(
      `INSERT INTO "categories" ("name", "parent_id") VALUES ('Smartphones', (SELECT "id" FROM "categories" WHERE "name" = 'Electronics')), ('Laptops', (SELECT "id" FROM "categories" WHERE "name" = 'Electronics')), ('T-Shirts', (SELECT "id" FROM "categories" WHERE "name" = 'Clothing')), ('Jeans', (SELECT "id" FROM "categories" WHERE "name" = 'Clothing'))`
    );

    // Update category paths for hierarchical queries
    await queryRunner.query(
      `UPDATE "categories" SET "path" = text2ltree("id"::text) WHERE "parent_id" IS NULL`
    );
    await queryRunner.query(
      `UPDATE "categories" SET "path" = parent."path" || categories."id"::text FROM "categories" parent WHERE "categories"."parent_id" = parent."id"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop triggers and functions
    await queryRunner.query(`DROP TRIGGER IF EXISTS "products_search_vector_update" ON "products"`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_search_vector()`);

    // Drop foreign key constraints
    await queryRunner.dropForeignKey("product_metrics", "FK_product_metrics_product_id");
    await queryRunner.dropForeignKey("product_variants", "FK_product_variants_product_id");
    await queryRunner.dropForeignKey("products", "FK_products_category_id");
    await queryRunner.dropForeignKey("products", "FK_products_supplier_id");
    await queryRunner.dropForeignKey("categories", "FK_categories_parent_id");

    // Drop tables
    await queryRunner.dropTable("search_analytics");
    await queryRunner.dropTable("product_metrics");
    await queryRunner.dropTable("product_variants");
    await queryRunner.dropTable("products");
    await queryRunner.dropTable("categories");
    await queryRunner.dropTable("suppliers");

    // Drop enums
    await queryRunner.query(`DROP TYPE "variant_status_enum"`);
    await queryRunner.query(`DROP TYPE "product_status_enum"`);
    await queryRunner.query(`DROP TYPE "supplier_status_enum"`);

    // Note: Extensions are not dropped as they might be used by other parts of the database
  }
}
