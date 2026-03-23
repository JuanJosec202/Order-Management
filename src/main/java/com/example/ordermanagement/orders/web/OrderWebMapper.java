package com.example.ordermanagement.orders.web;

import com.example.ordermanagement.orders.domain.Order;
import com.example.ordermanagement.orders.web.dto.OrderItemResponse;
import com.example.ordermanagement.orders.web.dto.OrderResponse;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class OrderWebMapper {

    public OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(item -> new OrderItemResponse(
                        item.getId(),
                        item.getProductId(),
                        item.getProductName(),
                        item.getUnitPrice(),
                        item.getQuantity(),
                        item.getLineTotal()))
                .toList();

        return new OrderResponse(order.getId(), items, order.getTotalAmount(), order.getStatus(), order.getCreatedAt(), order.getUpdatedAt(), order.getCreatedBy(), order.getUpdatedBy());
    }
}
