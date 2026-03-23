package com.example.ordermanagement.inventory.web.dto;

import jakarta.validation.constraints.Positive;

public record StockAdjustmentRequest(@Positive long amount) {
}
