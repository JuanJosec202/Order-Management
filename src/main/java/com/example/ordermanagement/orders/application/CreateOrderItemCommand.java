package com.example.ordermanagement.orders.application;

public record CreateOrderItemCommand(Long productId, int quantity) {
}
