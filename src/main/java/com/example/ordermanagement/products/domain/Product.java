package com.example.ordermanagement.products.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

public class Product {

    private final Long id;
    private String sku;
    private String name;
    private String description;
    private BigDecimal price;
    private final LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private final String createdBy;
    private String updatedBy;

    public Product(Long id,
                   String sku,
                   String name,
                   String description,
                   BigDecimal price,
                   LocalDateTime createdAt,
                   LocalDateTime updatedAt,
                   String createdBy,
                   String updatedBy) {
        this.id = id;
        this.sku = requireText(sku, "sku");
        this.name = requireText(name, "name");
        this.description = normalize(description);
        this.price = requirePrice(price);
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
    }

    public static Product newProduct(String sku, String name, String description, BigDecimal price) {
        return new Product(null, sku, name, description, price, null, null, null, null);
    }

    public void updateDetails(String sku, String name, String description, BigDecimal price) {
        this.sku = requireText(sku, "sku");
        this.name = requireText(name, "name");
        this.description = normalize(description);
        this.price = requirePrice(price);
    }

    public Long getId() { return id; }
    public String getSku() { return sku; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public BigDecimal getPrice() { return price; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public String getCreatedBy() { return createdBy; }
    public String getUpdatedBy() { return updatedBy; }

    private static String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + " must not be blank");
        }
        return value.trim();
    }

    private static BigDecimal requirePrice(BigDecimal value) {
        Objects.requireNonNull(value, "price must not be null");
        if (value.signum() < 0) {
            throw new IllegalArgumentException("price must be greater than or equal to zero");
        }
        return value;
    }

    private static String normalize(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
