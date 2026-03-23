package com.example.ordermanagement.inventory.application;

import com.example.ordermanagement.inventory.domain.InventoryItem;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductExistenceChecker productExistenceChecker;

    public InventoryService(InventoryRepository inventoryRepository,
                            ProductExistenceChecker productExistenceChecker) {
        this.inventoryRepository = inventoryRepository;
        this.productExistenceChecker = productExistenceChecker;
    }

    public InventoryItem getStock(Long productId) {
        ensureProductExists(productId);
        return inventoryRepository.findByProductId(productId)
                .orElseGet(() -> InventoryItem.initialize(productId));
    }

    @Transactional
    public InventoryItem increaseStock(Long productId, long amount) {
        ensureProductExists(productId);
        InventoryItem inventoryItem = inventoryRepository.findByProductId(productId)
                .orElseGet(() -> InventoryItem.initialize(productId));
        inventoryItem.increase(amount);
        return inventoryRepository.save(inventoryItem);
    }

    @Transactional
    public InventoryItem decreaseStock(Long productId, long amount) {
        ensureProductExists(productId);
        InventoryItem inventoryItem = inventoryRepository.findByProductId(productId)
                .orElseGet(() -> InventoryItem.initialize(productId));

        try {
            inventoryItem.decrease(amount);
        } catch (IllegalStateException ex) {
            throw new InsufficientStockException(productId, inventoryItem.getQuantity(), amount);
        }

        return inventoryRepository.save(inventoryItem);
    }

    private void ensureProductExists(Long productId) {
        if (!productExistenceChecker.existsById(productId)) {
            throw new InventoryProductNotFoundException(productId);
        }
    }
}
