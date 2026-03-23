package com.example.ordermanagement.users.application;

import com.example.ordermanagement.shared.application.exception.ResourceNotFoundException;

public class UserNotFoundException extends ResourceNotFoundException {

    public UserNotFoundException(Long userId) {
        super("User with id " + userId + " was not found");
    }
}
