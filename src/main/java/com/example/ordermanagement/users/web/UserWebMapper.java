package com.example.ordermanagement.users.web;

import com.example.ordermanagement.users.domain.User;
import com.example.ordermanagement.users.web.dto.UserResponse;
import org.springframework.stereotype.Component;

@Component
public class UserWebMapper {

    public UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.isActive(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
