package com.example.ordermanagement.orders.infrastructure.inventory;

import com.example.ordermanagement.inventory.application.InventoryService;
import com.example.ordermanagement.orders.application.InventoryGateway;
import org.springframework.stereotype.Component;

@Component
public class InventoryServiceGatewayAdapter implements InventoryGateway {

    private final InventoryService inventoryService;

    public InventoryServiceGatewayAdapter(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @Override
    public long getAvailableStock(Long productId) {
        return inventoryService.getStock(productId).getQuantity();
    }

    @Override
    public void decreaseStock(Long productId, int quantity) {
        inventoryService.decreaseStock(productId, quantity);
    }
}
