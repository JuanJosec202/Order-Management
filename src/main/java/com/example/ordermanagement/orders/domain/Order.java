package com.example.ordermanagement.orders.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

public class Order {

    private final Long id;
    private final List<OrderItem> items;
    private final BigDecimal totalAmount;
    private OrderStatus status;
    private final LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private final String createdBy;
    private String updatedBy;

    public Order(Long id,
                 List<OrderItem> items,
                 BigDecimal totalAmount,
                 OrderStatus status,
                 LocalDateTime createdAt,
                 LocalDateTime updatedAt,
                 String createdBy,
                 String updatedBy) {
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("order must contain at least one item");
        }
        this.id = id;
        this.items = new ArrayList<>(items);
        this.totalAmount = Objects.requireNonNull(totalAmount, "totalAmount must not be null");
        this.status = Objects.requireNonNull(status, "status must not be null");
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
    }

    public static Order create(List<OrderItem> items) {
        BigDecimal totalAmount = items.stream()
                .map(OrderItem::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new Order(null, items, totalAmount, OrderStatus.CREATED, null, null, null, null);
    }

    public void markAsPaid() {
        if (status != OrderStatus.CREATED) {
            throw new IllegalStateException("order cannot be paid in status " + status);
        }
        this.status = OrderStatus.PAID;
    }

    public Long getId() { return id; }
    public List<OrderItem> getItems() { return Collections.unmodifiableList(items); }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public OrderStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public String getCreatedBy() { return createdBy; }
    public String getUpdatedBy() { return updatedBy; }
}
