package com.example.ordermanagement.auth.web;

import com.example.ordermanagement.auth.application.AuthService;
import com.example.ordermanagement.auth.application.LoginCommand;
import com.example.ordermanagement.auth.web.dto.LoginRequest;
import com.example.ordermanagement.auth.web.dto.TokenResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Autenticacion de usuarios con JWT")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(
            summary = "Iniciar sesion",
            description = "Autentica un usuario por email y password y devuelve un JWT Bearer."
    )
    @SecurityRequirements
    @ApiResponse(responseCode = "200", description = "Login exitoso")
    @ApiResponse(responseCode = "401", description = "Credenciales invalidas", content = @Content)
    @ApiResponse(responseCode = "400", description = "Request invalido", content = @Content(schema = @Schema(hidden = true)))
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(new TokenResponse(
                authService.login(new LoginCommand(request.email(), request.password())).accessToken(),
                "Bearer"
        ));
    }
}
