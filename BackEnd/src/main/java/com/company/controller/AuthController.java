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
@CrossOrigin(origins = "http://garagez.s3-website.ap-northeast-2.amazonaws.com", allowCredentials = "true")
public class AuthController {

    private final AuthenticationService authenticationService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        AuthResponse response = authenticationService.authenticate(request);
        Optional<User> userOpt = userRepository.findByUserId(request.getUserId());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, null, null, true, "유효하지 않은 사용자 ID입니다."));
        }

        User user = userOpt.get();
        String userRole = user.getUserRole() != null && !user.getUserRole().isEmpty() ? user.getUserRole() : "USER";
        String token = jwtTokenProvider.createToken(request.getUserId(), userRole);

        System.out.println("🔹 로그인 성공!");
        System.out.println("👤 사용자 ID: " + request.getUserId());
        System.out.println("🎭 사용자 역할(userRole): " + userRole);

        return ResponseEntity.ok(new AuthResponse(token, request.getUserId(), userRole, false));
    }

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest request) {
        String email = jwtTokenProvider.extractEmail(request.getTokenId());
        String name = jwtTokenProvider.extractName(request.getTokenId());
        if (email == null) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, null, null, true, "Google JWT에서 이메일을 추출할 수 없습니다."));
        }

        Optional<User> existingUser = userRepository.findByEmail(email);
        String userId;
        boolean isNewUser = false;
        String userRole;
        User user;

        if (existingUser.isPresent()) {
            user = existingUser.get();
            userId = user.getUserId();
            userRole = user.getUserRole();
        } else {
            user = userService.googleRegisterUser(email, name);
            userId = user.getUserId();
            userRole = user.getUserRole();
            isNewUser = true;
        }

        userRole = userRole != null && !userRole.isEmpty() ? userRole : "USER";

        if (user.getName() == null || user.getName().isEmpty() || vehicleRepository.findByOwner(user).isEmpty()) {
            isNewUser = true;
        }

        String token = jwtTokenProvider.createToken(userId, userRole);

        System.out.println("🔹 Google 로그인 성공!");
        System.out.println("👤 사용자 ID: " + userId);
        System.out.println("📧 사용자 이메일: " + email);
        System.out.println("🎭 사용자 역할(userRole): " + userRole);

        return ResponseEntity.ok(new AuthResponse(token, userId, userRole, isNewUser));
    }
}