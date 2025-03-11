package com.company.service;

import com.company.entity.user.User;
import com.company.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        // 🔹 userId를 기반으로 검색
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userId));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUserId()) // 🔹 username은 고객의 로그인 ID (userId)
                .password(user.getPassword()) // 🔹 패스워드는 이미 암호화된 상태여야 함
                .roles(user.getRole().name()) // 🔹 권한 추가
                .build();
    }
}
