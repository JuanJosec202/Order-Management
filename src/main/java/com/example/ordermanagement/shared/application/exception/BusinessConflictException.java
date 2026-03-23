package com.example.ordermanagement.shared.application.exception;

public class BusinessConflictException extends RuntimeException {

    public BusinessConflictException(String message) {
        super(message);
    }
}
