package com.example.ordermanagement.inventory.infrastructure.persistence.mapper;

import com.example.ordermanagement.inventory.domain.InventoryItem;
import com.example.ordermanagement.inventory.infrastructure.persistence.entity.InventoryItemEntity;
import org.springframework.stereotype.Component;

@Component
public class InventoryPersistenceMapper {

    public InventoryItem toDomain(InventoryItemEntity entity) {
        return new InventoryItem(
                entity.getProductId(),
                entity.getQuantity(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }

    public InventoryItemEntity toEntity(InventoryItem inventoryItem) {
        InventoryItemEntity entity = new InventoryItemEntity();
        entity.setProductId(inventoryItem.getProductId());
        entity.setQuantity(inventoryItem.getQuantity());
        entity.setCreatedAt(inventoryItem.getCreatedAt());
        entity.setUpdatedAt(inventoryItem.getUpdatedAt());
        return entity;
    }
}
