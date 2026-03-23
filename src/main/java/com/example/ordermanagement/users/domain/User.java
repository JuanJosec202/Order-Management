package com.example.ordermanagement.users.domain;

import java.time.LocalDateTime;
import java.util.Objects;

public class User {

    private final Long id;
    private String name;
    private String email;
    private String passwordHash;
    private UserRole role;
    private boolean active;
    private final LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public User(Long id,
                String name,
                String email,
                String passwordHash,
                UserRole role,
                boolean active,
                LocalDateTime createdAt,
                LocalDateTime updatedAt) {
        this.id = id;
        this.name = requireText(name, "name");
        this.email = normalizeEmail(email);
        this.passwordHash = requireText(passwordHash, "passwordHash");
        this.role = Objects.requireNonNull(role, "role must not be null");
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static User newUser(String name,
                               String email,
                               String passwordHash,
                               UserRole role,
                               boolean active) {
        return new User(null, name, email, passwordHash, role, active, null, null);
    }

    public void updateDetails(String name,
                              String email,
                              String passwordHash,
                              UserRole role,
                              boolean active) {
        this.name = requireText(name, "name");
        this.email = normalizeEmail(email);
        this.passwordHash = requireText(passwordHash, "passwordHash");
        this.role = Objects.requireNonNull(role, "role must not be null");
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public UserRole getRole() {
        return role;
    }

    public boolean isActive() {
        return active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    private static String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + " must not be blank");
        }
        return value.trim();
    }

    private static String normalizeEmail(String email) {
        String normalizedEmail = requireText(email, "email").toLowerCase();
        if (!normalizedEmail.contains("@")) {
            throw new IllegalArgumentException("email must be valid");
        }
        return normalizedEmail;
    }
}
