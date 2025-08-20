import { Module } from "@nestjs/common";
import { CacheModule as NestCacheModule } from "@nestjs/cache-manager";
import { CacheService } from "./cache.service";

@Module({
  imports: [
    NestCacheModule.register({
      isGlobal: true,
      store: require("cache-manager-redis-store"),
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT) || 6379,
      ttl: 300, // 5 minutes default
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
