package com.example.ordermanagement.auth.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.ordermanagement.users.domain.UserRole;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthService authService;

    @Test
    void shouldAuthenticateUserAndReturnGeneratedToken() {
        LoginCommand command = new LoginCommand("admin@example.com", "secret");
        AuthenticatedUser authenticatedUser = new AuthenticatedUser(1L, "admin@example.com", "hash", UserRole.ADMIN, true);

        when(authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(command.email(), command.password())))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(authenticatedUser);
        when(jwtService.generateToken(authenticatedUser)).thenReturn("jwt-token");

        AuthTokenResult result = authService.login(command);

        assertThat(result.accessToken()).isEqualTo("jwt-token");
        verify(authenticationManager).authenticate(new UsernamePasswordAuthenticationToken(command.email(), command.password()));
        verify(jwtService).generateToken(authenticatedUser);
    }
}
