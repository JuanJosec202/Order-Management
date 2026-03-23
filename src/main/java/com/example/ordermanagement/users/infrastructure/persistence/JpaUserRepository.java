package com.example.ordermanagement.users.infrastructure.persistence;

import com.example.ordermanagement.users.application.UserRepository;
import com.example.ordermanagement.users.domain.User;
import com.example.ordermanagement.users.infrastructure.persistence.mapper.UserPersistenceMapper;
import com.example.ordermanagement.users.infrastructure.persistence.repository.SpringDataUserRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class JpaUserRepository implements UserRepository {

    private final SpringDataUserRepository springDataUserRepository;
    private final UserPersistenceMapper mapper;

    public JpaUserRepository(SpringDataUserRepository springDataUserRepository,
                             UserPersistenceMapper mapper) {
        this.springDataUserRepository = springDataUserRepository;
        this.mapper = mapper;
    }

    @Override
    public User save(User user) {
        return mapper.toDomain(springDataUserRepository.save(mapper.toEntity(user)));
    }

    @Override
    public List<User> findAll() {
        return springDataUserRepository.findAllByOrderByIdAsc()
                .stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public Optional<User> findById(Long id) {
        return springDataUserRepository.findById(id)
                .map(mapper::toDomain);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return springDataUserRepository.findByEmail(email)
                .map(mapper::toDomain);
    }

    @Override
    public boolean existsByEmail(String email) {
        return springDataUserRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByEmailAndIdNot(String email, Long id) {
        return springDataUserRepository.existsByEmailAndIdNot(email, id);
    }
}
