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

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService customUserDetailsService;

    /**
     * 일반 로그인 (userId 기반)
     */
    public AuthResponse authenticate(LoginRequest request) {
        // 🔹 Spring Security 방식으로 사용자 로드
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(request.getUserId());

        if (userDetails == null || !passwordEncoder.matches(request.getPassword(), userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid userId or password");
        }

        // ✅ 기존 회원이므로 isNewUser = false 로 설정
        return generateJwtForUser(userDetails.getUsername(), false);
    }


    /**
     * Google 로그인 (email → userId 변환 후 처리)
     */
    public AuthResponse googleAuthenticate(GoogleLoginRequest request) {
        String email = verifyGoogleToken(request.getTokenId());

        Optional<User> userOptional = userRepository.findByEmail(email);

        boolean isNewUser = false; // 기본적으로 기존 회원으로 설정

        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
        } else {
            // 새로운 유저 생성 (회원가입)
            user = new User();
            user.setEmail(email);
            user.setUserId(generateUserIdFromEmail(email));
            user.setRole(Role.USER);

            userRepository.save(user);
            isNewUser = true; // 신규 회원으로 표시
        }

        return new AuthResponse(jwtTokenProvider.createToken(user.getUserId()), user.getUserId(), isNewUser);
    }

    /**
     * 🔹 JWT 발급 로직 (공통)
     */
    private AuthResponse generateJwtForUser(String userId, boolean isNewUser) {
        String token = jwtTokenProvider.createToken(userId);
        return new AuthResponse(token, userId, isNewUser);
    }

    /**
     * 🔹 Google 토큰 검증 (email 반환)
     */
    private String verifyGoogleToken(String tokenId) {
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

    /**
     * 🔹 Google 로그인 시 userId 생성 (예제)
     */
    private String generateUserIdFromEmail(String email) {
        return "google_" + email.split("@")[0]; // ex) google_username
    }

    // 🔹 Google 토큰 검증 응답 DTO
    private static class GoogleTokenResponse {
        private String email;
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }
}
