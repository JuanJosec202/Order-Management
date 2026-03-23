package com.example.ordermanagement.users.application;

import com.example.ordermanagement.users.domain.User;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User createUser(CreateUserCommand command) {
        String normalizedEmail = normalizeEmail(command.email());
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new DuplicateUserEmailException(normalizedEmail);
        }

        User user = User.newUser(
                command.name(),
                normalizedEmail,
                command.passwordHash(),
                command.role(),
                command.active()
        );

        return userRepository.save(user);
    }

    public List<User> listUsers() {
        return userRepository.findAll();
    }

    public User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
    }

    @Transactional
    public User updateUser(Long userId, UpdateUserCommand command) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        String normalizedEmail = normalizeEmail(command.email());
        if (userRepository.existsByEmailAndIdNot(normalizedEmail, userId)) {
            throw new DuplicateUserEmailException(normalizedEmail);
        }

        user.updateDetails(
                command.name(),
                normalizedEmail,
                command.passwordHash(),
                command.role(),
                command.active()
        );

        return userRepository.save(user);
    }

    private String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }
}
