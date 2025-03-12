package com.company.controller;

import com.company.dto.login.AuthResponse;
import com.company.dto.login.GoogleLoginRequest;
import com.company.dto.login.LoginRequest;
import com.company.entity.user.User;
import com.company.repository.VehicleRepository;
import com.company.service.AuthenticationService;
import com.company.service.UserService;
import com.company.repository.UserRepository;
import com.company.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    private final AuthenticationService authenticationService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        AuthResponse response = authenticationService.authenticate(request);
        return ResponseEntity.ok(response); // 📌 userId를 포함한 응답 반환
    }

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest request) {
        // 🔍 Google JWT에서 이메일과 이름 추출
        String email = jwtTokenProvider.extractEmail(request.getTokenId());
        String name = jwtTokenProvider.extractName(request.getTokenId());

        if (email == null) {
            return ResponseEntity.badRequest().body("Google JWT에서 이메일을 추출할 수 없습니다.");
        }

        // ✅ 기존 회원 여부 확인
        Optional<User> existingUser = userRepository.findByEmail(email);

        String userId;
        boolean isProfileIncomplete = false; // ✅ 추가 정보 필요 여부
        if (existingUser.isPresent()) {
            // 기존 회원이면 userId 가져오기
            User user = existingUser.get();
            userId = user.getUserId();

            // ✅ name 또는 차량 정보가 없는 경우 추가 회원가입 유도
            if (user.getName() == null || user.getName().isEmpty() ||
                    vehicleRepository.findByOwner(user).isEmpty()) {
                isProfileIncomplete = true;
            }
        } else {
            // ❌ 회원이 없으면 자동 회원가입 후 userId 생성
            User newUser = userService.googleRegisterUser(email, name);
            userId = newUser.getUserId();

            isProfileIncomplete = true;
        }

        // ✅ userId 기반으로 JWT 생성
        String token = jwtTokenProvider.createToken(userId);

        // ✅ `isProfileIncomplete` 값 포함하여 응답
        return ResponseEntity.ok(new AuthResponse(token, userId, isProfileIncomplete));
    }


}
