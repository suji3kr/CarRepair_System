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

    // ✅ 일반 로그인 (userRole 포함)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        AuthResponse response = authenticationService.authenticate(request);

        // ✅ userId 기반으로 userRole 가져오기
        Optional<User> userOpt = userRepository.findByUserId(request.getUserId());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("유효하지 않은 사용자 ID입니다.");
        }

        User user = userOpt.get();
        String userRole = user.getUserRole();

        // ✅ userRole이 null이면 기본값 "USER" 설정
        if (userRole == null || userRole.isEmpty()) {
            userRole = "USER";
        }

        // ✅ 로그인 성공 시 콘솔 로그 출력
        System.out.println("🔹 로그인 성공!");
        System.out.println("👤 사용자 ID: " + request.getUserId());
        System.out.println("🎭 사용자 역할(userRole): " + userRole);

        // ✅ JWT 생성 시 역할(role) 정보 포함
        String token = jwtTokenProvider.createToken(request.getUserId(), userRole);

        return ResponseEntity.ok(new AuthResponse(token, request.getUserId(), userRole, false));
    }

    // ✅ Google 로그인 (userRole 포함)
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
        boolean isProfileIncomplete = false;
        String userRole;
        User user;

        if (existingUser.isPresent()) {
            // 기존 회원이면 userId 가져오기
            user = existingUser.get();
            userId = user.getUserId();
            userRole = user.getUserRole();
        } else {
            // ❌ 회원이 없으면 자동 회원가입
            user = userService.googleRegisterUser(email, name);
            userId = user.getUserId();
            userRole = user.getUserRole();
            isProfileIncomplete = true;
        }

        // ✅ userRole이 null이면 기본값 "USER" 설정
        if (userRole == null || userRole.isEmpty()) {
            userRole = "USER";
        }

        // ✅ name 또는 차량 정보가 없는 경우 추가 회원가입 유도
        if (user.getName() == null || user.getName().isEmpty() ||
                vehicleRepository.findByOwner(user).isEmpty()) {
            isProfileIncomplete = true;
        }

        // ✅ 로그인 성공 시 콘솔 로그 출력
        System.out.println("🔹 Google 로그인 성공!");
        System.out.println("👤 사용자 ID: " + userId);
        System.out.println("📧 사용자 이메일: " + email);
        System.out.println("🎭 사용자 역할(userRole): " + userRole);

        // ✅ JWT 생성 시 역할(role) 정보 포함
        String token = jwtTokenProvider.createToken(userId, userRole);

        return ResponseEntity.ok(new AuthResponse(token, userId, userRole, isProfileIncomplete));
    }
}
