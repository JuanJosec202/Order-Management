package com.example.ordermanagement.inventory.domain;

import java.time.LocalDateTime;

public class InventoryItem {

    private final Long productId;
    private long quantity;
    private final LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public InventoryItem(Long productId, long quantity, LocalDateTime createdAt, LocalDateTime updatedAt) {
        if (productId == null) {
            throw new IllegalArgumentException("productId must not be null");
        }
        if (quantity < 0) {
            throw new IllegalArgumentException("quantity must be greater than or equal to zero");
        }
        this.productId = productId;
        this.quantity = quantity;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static InventoryItem initialize(Long productId) {
        return new InventoryItem(productId, 0, null, null);
    }

    public void increase(long amount) {
        validateAmount(amount);
        this.quantity += amount;
    }

    public void decrease(long amount) {
        validateAmount(amount);
        if (this.quantity < amount) {
            throw new IllegalStateException("insufficient stock");
        }
        this.quantity -= amount;
    }

    public Long getProductId() {
        return productId;
    }

    public long getQuantity() {
        return quantity;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    private void validateAmount(long amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("amount must be greater than zero");
        }
    }
}
