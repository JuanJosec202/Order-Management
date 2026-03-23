package com.example.ordermanagement.orders.web;

import com.example.ordermanagement.orders.application.CreateOrderCommand;
import com.example.ordermanagement.orders.application.CreateOrderItemCommand;
import com.example.ordermanagement.orders.application.OrderService;
import com.example.ordermanagement.orders.web.dto.CreateOrderRequest;
import com.example.ordermanagement.orders.web.dto.OrderResponse;
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
public class OrderController {

    private final OrderService orderService;
    private final OrderWebMapper orderWebMapper;

    public OrderController(OrderService orderService, OrderWebMapper orderWebMapper) {
        this.orderService = orderService;
        this.orderWebMapper = orderWebMapper;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        OrderResponse response = orderWebMapper.toResponse(orderService.createOrder(new CreateOrderCommand(
                request.items().stream().map(item -> new CreateOrderItemCommand(item.productId(), item.quantity())).toList())));
        return ResponseEntity.created(URI.create("/api/orders/" + response.id())).body(response);
    }

    @GetMapping("/{orderId}")
    public OrderResponse getOrder(@PathVariable Long orderId) {
        return orderWebMapper.toResponse(orderService.getOrder(orderId));
    }

    @GetMapping
    public List<OrderResponse> listOrders() {
        return orderService.listOrders().stream().map(orderWebMapper::toResponse).toList();
    }
}
