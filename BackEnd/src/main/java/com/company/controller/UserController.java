package com.company.controller;

import com.company.dto.UserSignupRequest;
import com.company.entity.user.User;
import com.company.service.UserService;
import com.company.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final VehicleService vehicleService;

    @PostMapping("/signup")
    public ResponseEntity<User> register(@RequestBody UserSignupRequest request) {
        // 사용자 정보와 차량 정보 연결하여 저장
        User user = userService.registerUser(request); // 기존의 사용자 등록 메소드 호출

        return ResponseEntity.ok(user); // 저장된 사용자 반환
    }
}
