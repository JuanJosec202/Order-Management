package com.example.ordermanagement.auth.web;

import com.example.ordermanagement.auth.application.AuthService;
import com.example.ordermanagement.auth.application.LoginCommand;
import com.example.ordermanagement.auth.web.dto.LoginRequest;
import com.example.ordermanagement.auth.web.dto.TokenResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(new TokenResponse(
                authService.login(new LoginCommand(request.email(), request.password())).accessToken(),
                "Bearer"
        ));
    }
}
