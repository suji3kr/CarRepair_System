package com.company.controller;

import com.company.dto.UserSignupRequest;
import com.company.dto.UserResponseDto;
import com.company.entity.user.User;
import com.company.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    // ✅ 회원가입 엔드포인트
    @PostMapping("/signup")
    public ResponseEntity<UserResponseDto> register(@Valid @RequestBody UserSignupRequest request) {
        // 사용자 등록 후 DTO 반환

        User user = userService.registerUser(request);

        // ✅ 비밀번호가 제거된 UserResponseDto로 변환
        UserResponseDto responseDto = new UserResponseDto(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().name()
        );

        return ResponseEntity.ok(responseDto); // ✅ 보안 강화: 비밀번호 없는 DTO 반환
    }

    // ✅ 예외 처리: 입력값이 누락되었을 경우 400 응답 반환
    @ExceptionHandler(jakarta.validation.ConstraintViolationException.class)
    public ResponseEntity<String> handleValidationException(Exception e) {
        return ResponseEntity.badRequest().body("입력값이 올바르지 않습니다: " + e.getMessage());
    }
}
