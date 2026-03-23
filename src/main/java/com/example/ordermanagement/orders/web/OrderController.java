package com.example.ordermanagement.orders.web;

import com.example.ordermanagement.orders.application.CreateOrderCommand;
import com.example.ordermanagement.orders.application.CreateOrderItemCommand;
import com.example.ordermanagement.orders.application.OrderService;
import com.example.ordermanagement.orders.web.dto.CreateOrderRequest;
import com.example.ordermanagement.orders.web.dto.OrderResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/orders")
@Tag(name = "Orders", description = "Gestion de ordenes de compra")
@SecurityRequirement(name = "bearerAuth")
public class OrderController {

    private final OrderService orderService;
    private final OrderWebMapper orderWebMapper;

    public OrderController(OrderService orderService, OrderWebMapper orderWebMapper) {
        this.orderService = orderService;
        this.orderWebMapper = orderWebMapper;
    }

    @PostMapping
    @Operation(summary = "Crear orden", description = "Crea una orden validando productos existentes y stock disponible.")
    @ApiResponse(responseCode = "201", description = "Orden creada")
    @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    @ApiResponse(responseCode = "409", description = "Stock insuficiente")
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        OrderResponse response = orderWebMapper.toResponse(orderService.createOrder(new CreateOrderCommand(
                request.items().stream().map(item -> new CreateOrderItemCommand(item.productId(), item.quantity())).toList())));
        return ResponseEntity.created(URI.create("/api/orders/" + response.id())).body(response);
    }

    @GetMapping("/{orderId}")
    @Operation(summary = "Consultar orden por id")
    @ApiResponse(responseCode = "404", description = "Orden no encontrada")
    public OrderResponse getOrder(@PathVariable Long orderId) {
        return orderWebMapper.toResponse(orderService.getOrder(orderId));
    }

    @GetMapping
    @Operation(summary = "Listar ordenes")
    public List<OrderResponse> listOrders() {
        return orderService.listOrders().stream().map(orderWebMapper::toResponse).toList();
    }
}
