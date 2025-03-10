package com.company.service;

import com.company.dto.login.AuthResponse;
import com.company.dto.login.GoogleLoginRequest;
import com.company.dto.login.LoginRequest;
import com.company.entity.role.Role;
import com.company.entity.user.User;
import com.company.repository.UserRepository;
import com.company.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService; // 🔹 UserService를 주입받습니다.
    private final CustomUserDetailsService customUserDetailsService;

    public AuthResponse authenticate(LoginRequest request) {
        // 🔹 UserService를 활용하여 Spring Security 방식으로 사용자 로드
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(request.getUser_id()); // UserService 사용

        if (userDetails == null || !passwordEncoder.matches(request.getPassword(), userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String token = jwtTokenProvider.createToken(userDetails.getUsername());

        return new AuthResponse(token, userDetails.getUsername());
    }

    public AuthResponse googleAuthenticate(GoogleLoginRequest request) {
        String email = verifyGoogleToken(request.getTokenId());

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setRole(Role.USER);
                    return userRepository.save(newUser);
                });

        String token = jwtTokenProvider.createToken(user.getEmail());

        return new AuthResponse(token, user.getEmail());
    }

    private String verifyGoogleToken(String tokenId) {
        // 🔹 실제 Google OAuth 토큰 검증 로직 추가
        try {
            String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + tokenId;
            RestTemplate restTemplate = new RestTemplate();
            GoogleTokenResponse response = restTemplate.getForObject(url, GoogleTokenResponse.class);

            if (response == null || response.getEmail() == null) {
                throw new BadCredentialsException("Invalid Google token");
            }

            return response.getEmail();
        } catch (Exception e) {
            throw new BadCredentialsException("Failed to verify Google token");
        }
    }

    // 🔹 Google 토큰 검증 응답 DTO 추가
    private static class GoogleTokenResponse {
        private String email;
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }
}
