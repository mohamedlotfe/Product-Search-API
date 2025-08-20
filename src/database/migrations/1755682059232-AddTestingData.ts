import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTestingData1755682059232 implements MigrationInterface {
  name = "AddTestingData1755682059232";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert test products with search vectors
    await queryRunner.query(`
            INSERT INTO "products" (
                "name", 
                "description", 
                "brand", 
                "base_price", 
                "supplier_id", 
                "category_id",
                "attributes"
            ) VALUES 
            (
                'iPhone 15 Pro Max',
                'Latest Apple smartphone with A17 Pro chip, titanium design, and advanced camera system',
                'Apple',
                1199.00,
                (SELECT "id" FROM "suppliers" WHERE "name" = 'TechCorp'),
                (SELECT "id" FROM "categories" WHERE "name" = 'Smartphones'),
                '{"color": "Natural Titanium", "storage": "256GB", "features": ["5G", "Face ID", "Wireless Charging"]}'
            ),
            (
                'Samsung Galaxy S24 Ultra',
                'Premium Android smartphone with S Pen, AI features, and 200MP camera',
                'Samsung',
                1299.00,
                (SELECT "id" FROM "suppliers" WHERE "name" = 'TechCorp'),
                (SELECT "id" FROM "categories" WHERE "name" = 'Smartphones'),
                '{"color": "Titanium Black", "storage": "512GB", "features": ["S Pen", "AI Photo", "5G"]}'
            ),
            (
                'MacBook Pro 16"',
                'Powerful laptop with M3 Max chip, Liquid Retina XDR display, and all-day battery life',
                'Apple',
                2499.00,
                (SELECT "id" FROM "suppliers" WHERE "name" = 'TechCorp'),
                (SELECT "id" FROM "categories" WHERE "name" = 'Laptops'),
                '{"processor": "M3 Max", "memory": "32GB", "storage": "1TB SSD", "display": "16-inch Liquid Retina XDR"}'
            ),
            (
                'Dell XPS 15',
                'Premium Windows laptop with Intel Core i7, OLED display, and professional graphics',
                'Dell',
                1899.00,
                (SELECT "id" FROM "suppliers" WHERE "name" = 'TechCorp'),
                (SELECT "id" FROM "categories" WHERE "name" = 'Laptops'),
                '{"processor": "Intel Core i7", "memory": "16GB", "storage": "512GB SSD", "graphics": "RTX 4060"}'
            ),
            (
                'Organic Cotton T-Shirt',
                'Sustainable and comfortable organic cotton t-shirt in various colors',
                'EcoWear',
                29.99,
                (SELECT "id" FROM "suppliers" WHERE "name" = 'FashionHub'),
                (SELECT "id" FROM "categories" WHERE "name" = 'T-Shirts'),
                '{"material": "100% Organic Cotton", "sizes": ["XS", "S", "M", "L", "XL"], "colors": ["White", "Black", "Navy"]}'
            ),
            (
                'Premium Denim Jeans',
                'High-quality denim jeans with perfect fit and comfort',
                'DeniCo',
                79.99,
                (SELECT "id" FROM "suppliers" WHERE "name" = 'FashionHub'),
                (SELECT "id" FROM "categories" WHERE "name" = 'Jeans'),
                '{"fit": "Slim", "material": "98% Cotton, 2% Elastane", "wash": "Dark Blue", "sizes": [28, 30, 32, 34, 36, 38]}'
            ),
            (
                'Smart Garden Kit',
                'Complete hydroponic growing system for herbs and vegetables at home',
                'GrowTech',
                199.99,
                (SELECT "id" FROM "suppliers" WHERE "name" = 'HomeGoods'),
                (SELECT "id" FROM "categories" WHERE "name" = 'Home & Garden'),
                '{"type": "Hydroponic", "capacity": "12 plants", "features": ["LED Grow Light", "Automatic Watering", "App Control"]}'
            ),
            (
                'Wireless Noise-Cancelling Headphones',
                'Premium over-ear headphones with active noise cancellation and 30-hour battery',
                'AudioMax',
                299.99,
                (SELECT "id" FROM "suppliers" WHERE "name" = 'TechCorp'),
                (SELECT "id" FROM "categories" WHERE "name" = 'Electronics'),
                '{"type": "Over-ear", "features": ["Active Noise Cancellation", "Bluetooth 5.3", "Quick Charge"], "battery": "30 hours"}'
            )
        `);

    // Insert product variants
    await queryRunner.query(`
            INSERT INTO "product_variants" (
                "product_id",
                "sku",
                "variant_attributes",
                "price",
                "inventory_count"
            ) VALUES
            (
                (SELECT "id" FROM "products" WHERE "name" = 'iPhone 15 Pro Max'),
                'IPHONE15PM-256-TI',
                '{"storage": "256GB", "color": "Natural Titanium"}',
                1199.00,
                50
            ),
            (
                (SELECT "id" FROM "products" WHERE "name" = 'iPhone 15 Pro Max'),
                'IPHONE15PM-512-TI',
                '{"storage": "512GB", "color": "Natural Titanium"}',
                1399.00,
                30
            ),
            (
                (SELECT "id" FROM "products" WHERE "name" = 'Samsung Galaxy S24 Ultra'),
                'GALAXYS24U-512-BK',
                '{"storage": "512GB", "color": "Titanium Black"}',
                1299.00,
                25
            ),
            (
                (SELECT "id" FROM "products" WHERE "name" = 'MacBook Pro 16"'),
                'MBP16-M3MAX-1TB',
                '{"processor": "M3 Max", "memory": "32GB", "storage": "1TB"}',
                2499.00,
                15
            ),
            (
                (SELECT "id" FROM "products" WHERE "name" = 'Dell XPS 15'),
                'DELLXPS15-I7-512',
                '{"processor": "Intel i7", "memory": "16GB", "storage": "512GB"}',
                1899.00,
                20
            ),
            (
                (SELECT "id" FROM "products" WHERE "name" = 'Organic Cotton T-Shirt'),
                'ORGANIC-TEE-M-WHITE',
                '{"size": "M", "color": "White"}',
                29.99,
                100
            ),
            (
                (SELECT "id" FROM "products" WHERE "name" = 'Organic Cotton T-Shirt'),
                'ORGANIC-TEE-L-BLACK',
                '{"size": "L", "color": "Black"}',
                29.99,
                80
            ),
            (
                (SELECT "id" FROM "products" WHERE "name" = 'Premium Denim Jeans'),
                'DENIM-SLIM-32-DARK',
                '{"size": 32, "fit": "Slim", "wash": "Dark Blue"}',
                79.99,
                60
            ),
            (
                (SELECT "id" FROM "products" WHERE "name" = 'Smart Garden Kit'),
                'SMARTGARDEN-12P',
                '{"capacity": "12 plants", "type": "Hydroponic"}',
                199.99,
                40
            ),
            (
                (SELECT "id" FROM "products" WHERE "name" = 'Wireless Noise-Cancelling Headphones'),
                'AUDIOMAX-NC-BLK',
                '{"color": "Black", "type": "Over-ear"}',
                299.99,
                35
            )
        `);

    // Insert product metrics for ranking
    await queryRunner.query(`
            INSERT INTO "product_metrics" (
                "product_id",
                "total_sales",
                "total_views",
                "total_reviews",
                "average_rating",
                "popularity_score"
            )
            SELECT 
                p."id",
                CASE 
                    WHEN p."name" LIKE '%iPhone%' THEN 500
                    WHEN p."name" LIKE '%Samsung%' THEN 450
                    WHEN p."name" LIKE '%MacBook%' THEN 300
                    WHEN p."name" LIKE '%Dell%' THEN 250
                    WHEN p."name" LIKE '%T-Shirt%' THEN 200
                    WHEN p."name" LIKE '%Jeans%' THEN 180
                    WHEN p."name" LIKE '%Garden%' THEN 120
                    WHEN p."name" LIKE '%Headphones%' THEN 350
                    ELSE 100
                END as total_sales,
                CASE 
                    WHEN p."name" LIKE '%iPhone%' THEN 15000
                    WHEN p."name" LIKE '%Samsung%' THEN 12000
                    WHEN p."name" LIKE '%MacBook%' THEN 8000
                    WHEN p."name" LIKE '%Dell%' THEN 6000
                    WHEN p."name" LIKE '%T-Shirt%' THEN 3000
                    WHEN p."name" LIKE '%Jeans%' THEN 2500
                    WHEN p."name" LIKE '%Garden%' THEN 1500
                    WHEN p."name" LIKE '%Headphones%' THEN 5000
                    ELSE 1000
                END as total_views,
                CASE 
                    WHEN p."name" LIKE '%iPhone%' THEN 150
                    WHEN p."name" LIKE '%Samsung%' THEN 120
                    WHEN p."name" LIKE '%MacBook%' THEN 85
                    WHEN p."name" LIKE '%Dell%' THEN 70
                    WHEN p."name" LIKE '%T-Shirt%' THEN 45
                    WHEN p."name" LIKE '%Jeans%' THEN 38
                    WHEN p."name" LIKE '%Garden%' THEN 25
                    WHEN p."name" LIKE '%Headphones%' THEN 95
                    ELSE 20
                END as total_reviews,
                CASE 
                    WHEN p."name" LIKE '%iPhone%' THEN 4.5
                    WHEN p."name" LIKE '%Samsung%' THEN 4.3
                    WHEN p."name" LIKE '%MacBook%' THEN 4.7
                    WHEN p."name" LIKE '%Dell%' THEN 4.2
                    WHEN p."name" LIKE '%T-Shirt%' THEN 4.4
                    WHEN p."name" LIKE '%Jeans%' THEN 4.1
                    WHEN p."name" LIKE '%Garden%' THEN 4.6
                    WHEN p."name" LIKE '%Headphones%' THEN 4.4
                    ELSE 4.0
                END as average_rating,
                CASE 
                    WHEN p."name" LIKE '%iPhone%' THEN 0.95
                    WHEN p."name" LIKE '%Samsung%' THEN 0.88
                    WHEN p."name" LIKE '%MacBook%' THEN 0.82
                    WHEN p."name" LIKE '%Dell%' THEN 0.75
                    WHEN p."name" LIKE '%Headphones%' THEN 0.78
                    WHEN p."name" LIKE '%T-Shirt%' THEN 0.65
                    WHEN p."name" LIKE '%Jeans%' THEN 0.60
                    WHEN p."name" LIKE '%Garden%' THEN 0.55
                    ELSE 0.50
                END as popularity_score
            FROM "products" p
            WHERE NOT EXISTS (
                SELECT 1 FROM "product_metrics" pm WHERE pm."product_id" = p."id"
            )
        `);

    // Insert some search analytics data
    await queryRunner.query(`
            INSERT INTO "search_analytics" (
                "query",
                "user_id",
                "results_count",
                "clicked_product_id",
                "search_time_ms"
            ) VALUES
            ('iPhone', NULL, 1, (SELECT "id" FROM "products" WHERE "name" = 'iPhone 15 Pro Max'), 45),
            ('laptop', NULL, 2, (SELECT "id" FROM "products" WHERE "name" = 'MacBook Pro 16"'), 38),
            ('smartphone', NULL, 2, (SELECT "id" FROM "products" WHERE "name" = 'Samsung Galaxy S24 Ultra'), 42),
            ('t-shirt', NULL, 1, (SELECT "id" FROM "products" WHERE "name" = 'Organic Cotton T-Shirt'), 35),
            ('headphones', NULL, 1, (SELECT "id" FROM "products" WHERE "name" = 'Wireless Noise-Cancelling Headphones'), 40),
            ('garden', NULL, 1, (SELECT "id" FROM "products" WHERE "name" = 'Smart Garden Kit'), 50),
            ('Apple', NULL, 2, (SELECT "id" FROM "products" WHERE "name" = 'iPhone 15 Pro Max'), 33),
            ('Samsung', NULL, 1, (SELECT "id" FROM "products" WHERE "name" = 'Samsung Galaxy S24 Ultra'), 41)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete test data in reverse order due to foreign key constraints
    await queryRunner.query(
      `DELETE FROM "search_analytics" WHERE "query" IN ('iPhone', 'laptop', 'smartphone', 't-shirt', 'headphones', 'garden', 'Apple', 'Samsung')`
    );

    await queryRunner.query(`DELETE FROM "product_metrics" WHERE "product_id" IN (
            SELECT "id" FROM "products" WHERE "name" IN (
                'iPhone 15 Pro Max', 'Samsung Galaxy S24 Ultra', 'MacBook Pro 16"', 'Dell XPS 15',
                'Organic Cotton T-Shirt', 'Premium Denim Jeans', 'Smart Garden Kit', 'Wireless Noise-Cancelling Headphones'
            )
        )`);

    await queryRunner.query(`DELETE FROM "product_variants" WHERE "product_id" IN (
            SELECT "id" FROM "products" WHERE "name" IN (
                'iPhone 15 Pro Max', 'Samsung Galaxy S24 Ultra', 'MacBook Pro 16"', 'Dell XPS 15',
                'Organic Cotton T-Shirt', 'Premium Denim Jeans', 'Smart Garden Kit', 'Wireless Noise-Cancelling Headphones'
            )
        )`);

    await queryRunner.query(`DELETE FROM "products" WHERE "name" IN (
            'iPhone 15 Pro Max', 'Samsung Galaxy S24 Ultra', 'MacBook Pro 16"', 'Dell XPS 15',
            'Organic Cotton T-Shirt', 'Premium Denim Jeans', 'Smart Garden Kit', 'Wireless Noise-Cancelling Headphones'
        )`);
  }
}
