package com.company.controller;

import com.company.dto.UserSignupRequest;
import com.company.dto.login.GoogleLoginRequest;
import com.company.dto.login.LoginRequest;
import com.company.entity.user.User;
import com.company.service.AuthenticationService;
import com.company.service.CarInfoService;
import com.company.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;
    private final UserService userService;
    private final CarInfoService carInfoService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest request) {
        return ResponseEntity.ok(authenticationService.googleAuthenticate(request));
    }

    @PostMapping("/signup")
    public ResponseEntity<User> register(@RequestBody UserSignupRequest request) {
        // 차량 정보 저장
        carInfoService.saveCarInfo(
                request.getCarModel(),
                request.getCarNumber(),
                request.isCoOwner(),
                request.getCoOwnerName(),
                request.getCoOwnerPhone()
        );

        // 사용자 저장 (기존 UserService 로직 활용)
        User user = userService.registerUser(request);
        return ResponseEntity.ok(user);
    }
}
