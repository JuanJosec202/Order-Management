package com.example.ordermanagement.inventory.web;

import com.example.ordermanagement.inventory.domain.InventoryItem;
import com.example.ordermanagement.inventory.web.dto.InventoryResponse;
import org.springframework.stereotype.Component;

@Component
public class InventoryWebMapper {

    public InventoryResponse toResponse(InventoryItem inventoryItem) {
        return new InventoryResponse(
                inventoryItem.getProductId(),
                inventoryItem.getQuantity(),
                inventoryItem.getCreatedAt(),
                inventoryItem.getUpdatedAt()
        );
    }
}
