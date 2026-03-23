package com.example.ordermanagement.inventory.application;

import com.example.ordermanagement.inventory.domain.InventoryItem;
import java.util.Optional;

public interface InventoryRepository {

    Optional<InventoryItem> findByProductId(Long productId);

    InventoryItem save(InventoryItem inventoryItem);
}
