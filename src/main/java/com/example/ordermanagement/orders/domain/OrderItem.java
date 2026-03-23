package com.example.ordermanagement.orders.domain;

import java.math.BigDecimal;
import java.util.Objects;

public class OrderItem {

    private final Long id;
    private final Long productId;
    private final String productName;
    private final BigDecimal unitPrice;
    private final int quantity;
    private final BigDecimal lineTotal;

    public OrderItem(Long id,
                     Long productId,
                     String productName,
                     BigDecimal unitPrice,
                     int quantity,
                     BigDecimal lineTotal) {
        this.id = id;
        this.productId = Objects.requireNonNull(productId, "productId must not be null");
        this.productName = requireText(productName, "productName");
        this.unitPrice = requireMoney(unitPrice, "unitPrice");
        this.quantity = requireQuantity(quantity);
        this.lineTotal = requireMoney(lineTotal, "lineTotal");
    }

    public static OrderItem create(Long productId, String productName, BigDecimal unitPrice, int quantity) {
        BigDecimal calculatedLineTotal = unitPrice.multiply(BigDecimal.valueOf(quantity));
        return new OrderItem(null, productId, productName, unitPrice, quantity, calculatedLineTotal);
    }

    public Long getId() { return id; }
    public Long getProductId() { return productId; }
    public String getProductName() { return productName; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public int getQuantity() { return quantity; }
    public BigDecimal getLineTotal() { return lineTotal; }

    private static String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + " must not be blank");
        }
        return value.trim();
    }

    private static BigDecimal requireMoney(BigDecimal value, String fieldName) {
        Objects.requireNonNull(value, fieldName + " must not be null");
        if (value.signum() < 0) {
            throw new IllegalArgumentException(fieldName + " must be greater than or equal to zero");
        }
        return value;
    }

    private static int requireQuantity(int value) {
        if (value <= 0) {
            throw new IllegalArgumentException("quantity must be greater than zero");
        }
        return value;
    }
}
