package com.example.ordermanagement.products.application;

import java.math.BigDecimal;

public record UpdateProductCommand(
        String sku,
        String name,
        String description,
        BigDecimal price
) {
}
