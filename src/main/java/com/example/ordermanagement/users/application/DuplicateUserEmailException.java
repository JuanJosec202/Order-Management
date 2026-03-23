package com.example.ordermanagement.users.application;

import com.example.ordermanagement.shared.application.exception.BusinessConflictException;

public class DuplicateUserEmailException extends BusinessConflictException {

    public DuplicateUserEmailException(String email) {
        super("User with email '" + email + "' already exists");
    }
}
