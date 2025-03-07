package com.company.repository;

import com.company.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailOrUserId(String email, String userId);
    boolean existsByUserId(String userId);

}
