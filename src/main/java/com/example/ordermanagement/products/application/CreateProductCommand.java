package com.example.ordermanagement.products.application;

import java.math.BigDecimal;

public record CreateProductCommand(
        String sku,
        String name,
        String description,
        BigDecimal price
) {
}
