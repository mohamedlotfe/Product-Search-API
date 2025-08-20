import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { Product } from "../entities/product.entity";
import { ProductVariant } from "../entities/product-variant.entity";

// Event interfaces for type safety
export interface ProductCreatedEvent {
  productId: string;
  supplierId: string;
  categoryId: string;
  name: string;
  createdAt: Date;
}

export interface ProductUpdatedEvent {
  productId: string;
  supplierId: string;
  changes: Partial<Product>;
  updatedAt: Date;
}

export interface ProductVariantCreatedEvent {
  variantId: string;
  productId: string;
  sku: string;
  price: number;
  inventoryCount: number;
  createdAt: Date;
}

export interface InventoryUpdatedEvent {
  variantId: string;
  productId: string;
  oldInventory: number;
  newInventory: number;
  updatedAt: Date;
}

@Injectable()
export class ProductEventsService {
  // Emit product domain events
  emitProductCreated(event: ProductCreatedEvent): void {
    // Implementation in the service that creates products
  }

  emitProductUpdated(event: ProductUpdatedEvent): void {
    // Implementation in the service that updates products
  }

  emitVariantCreated(event: ProductVariantCreatedEvent): void {
    // Implementation in the service that creates variants
  }

  emitInventoryUpdated(event: InventoryUpdatedEvent): void {
    // Implementation in the service that updates inventory
  }

  // Event handlers for cross-module communication
  @OnEvent("product.created")
  handleProductCreated(event: ProductCreatedEvent) {
    // Handle product creation events
    // This could trigger notifications, analytics, etc.
    console.log("Product created:", event);
  }

  @OnEvent("product.updated")
  handleProductUpdated(event: ProductUpdatedEvent) {
    // Handle product update events
    // This could trigger cache invalidation, notifications, etc.
    console.log("Product updated:", event);
  }

  @OnEvent("product.variant.created")
  handleVariantCreated(event: ProductVariantCreatedEvent) {
    // Handle variant creation events
    console.log("Product variant created:", event);
  }

  @OnEvent("inventory.updated")
  handleInventoryUpdated(event: InventoryUpdatedEvent) {
    // Handle inventory update events
    // This could trigger low stock alerts, etc.
    console.log("Inventory updated:", event);
  }
}
