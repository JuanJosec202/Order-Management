package com.example.ordermanagement.inventory.web;

import com.example.ordermanagement.inventory.application.InventoryService;
import com.example.ordermanagement.inventory.web.dto.InventoryResponse;
import com.example.ordermanagement.inventory.web.dto.StockAdjustmentRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/inventory")
public class InventoryController {

    private final InventoryService inventoryService;
    private final InventoryWebMapper inventoryWebMapper;

    public InventoryController(InventoryService inventoryService, InventoryWebMapper inventoryWebMapper) {
        this.inventoryService = inventoryService;
        this.inventoryWebMapper = inventoryWebMapper;
    }

    @GetMapping("/{productId}")
    public InventoryResponse getStock(@PathVariable Long productId) {
        return inventoryWebMapper.toResponse(inventoryService.getStock(productId));
    }

    @PostMapping("/{productId}/increase")
    public InventoryResponse increaseStock(@PathVariable Long productId,
                                           @Valid @RequestBody StockAdjustmentRequest request) {
        return inventoryWebMapper.toResponse(inventoryService.increaseStock(productId, request.amount()));
    }

    @PostMapping("/{productId}/decrease")
    public InventoryResponse decreaseStock(@PathVariable Long productId,
                                           @Valid @RequestBody StockAdjustmentRequest request) {
        return inventoryWebMapper.toResponse(inventoryService.decreaseStock(productId, request.amount()));
    }
}
