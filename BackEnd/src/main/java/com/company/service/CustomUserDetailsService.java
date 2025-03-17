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
        // 🔹 userId를 통해 사용자 검색 (DB에 userId 필드가 있는 경우)
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userId));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUserId())    // 로그인 시 사용할 ID
                .password(user.getPassword())  // 암호화된 패스워드
                .roles(user.getRole().name())  // Enum이라면 .name() 사용, 문자열이라면 user.getRole()만 넣어도 됨
                .build();
    }
}
