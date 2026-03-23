package com.example.ordermanagement.users.web;

import com.example.ordermanagement.users.application.CreateUserCommand;
import com.example.ordermanagement.users.application.UpdateUserCommand;
import com.example.ordermanagement.users.application.UserService;
import com.example.ordermanagement.users.web.dto.CreateUserRequest;
import com.example.ordermanagement.users.web.dto.UpdateUserRequest;
import com.example.ordermanagement.users.web.dto.UserResponse;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final UserWebMapper userWebMapper;

    public UserController(UserService userService, UserWebMapper userWebMapper) {
        this.userService = userService;
        this.userWebMapper = userWebMapper;
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserResponse response = userWebMapper.toResponse(userService.createUser(new CreateUserCommand(
                request.name(),
                request.email(),
                request.password(),
                request.role(),
                request.active()
        )));

        return ResponseEntity.created(URI.create("/api/users/" + response.id())).body(response);
    }

    @GetMapping
    public List<UserResponse> listUsers() {
        return userService.listUsers().stream().map(userWebMapper::toResponse).toList();
    }

    @GetMapping("/{userId}")
    public UserResponse getUser(@PathVariable Long userId) {
        return userWebMapper.toResponse(userService.getUser(userId));
    }

    @PutMapping("/{userId}")
    public UserResponse updateUser(@PathVariable Long userId,
                                   @Valid @RequestBody UpdateUserRequest request) {
        return userWebMapper.toResponse(userService.updateUser(userId, new UpdateUserCommand(
                request.name(),
                request.email(),
                request.password(),
                request.role(),
                request.active()
        )));
    }
}
