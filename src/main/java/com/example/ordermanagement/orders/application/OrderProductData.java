package com.example.ordermanagement.orders.application;

import java.math.BigDecimal;

public record OrderProductData(Long id, String name, BigDecimal price) {
}
