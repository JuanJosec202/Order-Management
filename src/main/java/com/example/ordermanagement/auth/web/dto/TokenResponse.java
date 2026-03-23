package com.example.ordermanagement.auth.web.dto;

public record TokenResponse(String accessToken,
                            String tokenType) {
}
