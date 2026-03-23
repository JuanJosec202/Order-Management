package com.example.ordermanagement.users.infrastructure.persistence.repository;

import com.example.ordermanagement.users.infrastructure.persistence.entity.UserEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataUserRepository extends JpaRepository<UserEntity, Long> {

    List<UserEntity> findAllByOrderByIdAsc();

    Optional<UserEntity> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);
}
