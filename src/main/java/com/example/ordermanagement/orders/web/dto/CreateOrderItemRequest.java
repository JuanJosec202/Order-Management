package com.example.ordermanagement.orders.web.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateOrderItemRequest(@NotNull Long productId, @Positive int quantity) {
}
