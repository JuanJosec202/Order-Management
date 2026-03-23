package com.example.ordermanagement.inventory.web.dto;

import java.time.LocalDateTime;

public record InventoryResponse(
        Long productId,
        long quantity,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
