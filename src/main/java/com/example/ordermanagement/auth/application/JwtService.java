package com.example.ordermanagement.auth.application;

public interface JwtService {

    String generateToken(AuthenticatedUser authenticatedUser);

    String extractUsername(String token);

    boolean isTokenValid(String token, AuthenticatedUser authenticatedUser);
}
