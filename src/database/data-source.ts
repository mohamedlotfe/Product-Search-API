import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Supplier } from "../suppliers/entities/supplier.entity";
import { Category } from "../categories/entities/category.entity";
import { Product } from "../products/entities/product.entity";
import { ProductVariant } from "../products/entities/product-variant.entity";
import { ProductMetrics } from "../analytics/entities/product-metrics.entity";
import { SearchAnalytics } from "../search/entities/search-analytics.entity";

const configService = new ConfigService();

export default new DataSource({
  type: "postgres",
  host: configService.get("DB_HOST") || "localhost",
  port: parseInt(configService.get("DB_PORT")) || 5432,
  username: configService.get("DB_USERNAME") || "postgres",
  password: configService.get("DB_PASSWORD") || "postgres",
  database: configService.get("DB_NAME") || "catalog",
  entities: [Supplier, Category, Product, ProductVariant, ProductMetrics, SearchAnalytics],
  migrations: [__dirname + "/migrations/*.ts"],
  synchronize: false,
  logging: configService.get("NODE_ENV") === "development",
});
