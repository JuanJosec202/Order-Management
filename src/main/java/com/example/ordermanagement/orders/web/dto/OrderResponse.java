package com.example.ordermanagement.orders.web.dto;

import com.example.ordermanagement.orders.domain.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(Long id,
                            List<OrderItemResponse> items,
                            BigDecimal totalAmount,
                            OrderStatus status,
                            LocalDateTime createdAt,
                            LocalDateTime updatedAt) {
}
