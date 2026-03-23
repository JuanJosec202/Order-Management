package com.example.ordermanagement.orders.application;

public interface InventoryGateway {
    long getAvailableStock(Long productId);
    void decreaseStock(Long productId, int quantity);
}
