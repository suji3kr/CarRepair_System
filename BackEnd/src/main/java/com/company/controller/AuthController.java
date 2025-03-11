package com.company.controller;

import com.company.dto.login.AuthResponse;
import com.company.dto.login.GoogleLoginRequest;
import com.company.dto.login.LoginRequest;
import com.company.service.AuthenticationService;
import com.company.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    private final AuthenticationService authenticationService;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        AuthResponse response = authenticationService.authenticate(request);
        return ResponseEntity.ok(response); // 📌 userId를 포함한 응답 반환
    }

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest request) {
        return ResponseEntity.ok(authenticationService.googleAuthenticate(request));
    }
}
