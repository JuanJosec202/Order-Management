package com.example.ordermanagement.inventory.web;

import com.example.ordermanagement.inventory.application.InventoryService;
import com.example.ordermanagement.inventory.web.dto.InventoryResponse;
import com.example.ordermanagement.inventory.web.dto.StockAdjustmentRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/inventory")
@Tag(name = "Inventory", description = "Gestion de stock por producto")
@SecurityRequirement(name = "bearerAuth")
public class InventoryController {

    private final InventoryService inventoryService;
    private final InventoryWebMapper inventoryWebMapper;

    public InventoryController(InventoryService inventoryService, InventoryWebMapper inventoryWebMapper) {
        this.inventoryService = inventoryService;
        this.inventoryWebMapper = inventoryWebMapper;
    }

    @GetMapping("/{productId}")
    @Operation(summary = "Consultar stock actual")
    @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    public InventoryResponse getStock(@PathVariable Long productId) {
        return inventoryWebMapper.toResponse(inventoryService.getStock(productId));
    }

    @PostMapping("/{productId}/increase")
    @Operation(summary = "Incrementar stock")
    @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    public InventoryResponse increaseStock(@PathVariable Long productId,
                                           @Valid @RequestBody StockAdjustmentRequest request) {
        return inventoryWebMapper.toResponse(inventoryService.increaseStock(productId, request.amount()));
    }

    @PostMapping("/{productId}/decrease")
    @Operation(summary = "Disminuir stock")
    @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    @ApiResponse(responseCode = "409", description = "Stock insuficiente")
    public InventoryResponse decreaseStock(@PathVariable Long productId,
                                           @Valid @RequestBody StockAdjustmentRequest request) {
        return inventoryWebMapper.toResponse(inventoryService.decreaseStock(productId, request.amount()));
    }
}
