package com.example.ordermanagement.users.application;

import com.example.ordermanagement.users.domain.UserRole;

public record CreateUserCommand(
        String name,
        String email,
        String password,
        UserRole role,
        boolean active
) {
}
