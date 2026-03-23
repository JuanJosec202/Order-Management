package com.example.ordermanagement.orders.web.dto;

import java.math.BigDecimal;

public record OrderItemResponse(Long id,
                                Long productId,
                                String productName,
                                BigDecimal unitPrice,
                                int quantity,
                                BigDecimal lineTotal) {
}
