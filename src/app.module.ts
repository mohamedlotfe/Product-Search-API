import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ProductsModule } from "./products/products.module";
import { SuppliersModule } from "./suppliers/suppliers.module";
import { CategoriesModule } from "./categories/categories.module";
import { SearchModule } from "./search/search.module";
import { CommonModule } from "./common/common.module";
import { DatabaseModule } from "./database/database.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    DatabaseModule, // Database configuration with migrations
    EventEmitterModule.forRoot({
      // Global event emitter configuration
      wildcard: false,
      delimiter: ".",
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),
    SuppliersModule, // No dependencies
    CategoriesModule, // No dependencies
    ProductsModule, // Depends on suppliers + categories
    SearchModule, // Depends on products + categories
    CommonModule, // Global shared modules
  ],
})
export class AppModule {}
