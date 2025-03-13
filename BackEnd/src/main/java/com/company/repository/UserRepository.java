package com.company.repository;

import com.company.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUserId(String userId); // 기존 userId 기반 검색
    Optional<User> findByEmail(String email); // Google 로그인 시 이메일 검색
    boolean existsByUserId(String userId);

    boolean existsByEmail(String email);
}
