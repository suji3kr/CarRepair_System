package com.company.controller;

import com.company.dto.UserSignupRequest;
import com.company.dto.UserResponseDto;
import com.company.dto.UserUpdateRequest; // 추가 필요
import com.company.entity.user.User;
import com.company.service.UserService;
import com.company.security.JwtTokenProvider;
import com.company.service.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;
    private final VehicleService vehicleService;
    private final JwtTokenProvider jwtTokenProvider;

    // ✅ 회원가입 엔드포인트
    @PostMapping("/signup")
    public ResponseEntity<UserResponseDto> register(@Valid @RequestBody UserSignupRequest request) {
        User user = userService.registerUser(request);
        UserResponseDto responseDto = new UserResponseDto(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().name(),
                List.of()
        );
        return ResponseEntity.ok(responseDto);
    }

    // ✅ 현재 로그인한 사용자 정보 조회 API
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String token) {
        try {
            String jwtToken = token.replace("Bearer ", "");
            String userId = jwtTokenProvider.getUserIdFromToken(jwtToken);
            UserResponseDto responseDto = userService.getUserByUserIdWithVehicle(userId);
            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            log.error("토큰 검증 실패: {}", e.getMessage());
            return ResponseEntity.status(401).body("유효하지 않은 토큰입니다.");
        }
    }

    // ✅ 사용자 정보 수정 API
    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody UserUpdateRequest request) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String userId = jwtTokenProvider.getUserIdFromToken(token);
            UserResponseDto updatedUser = userService.updateUser(userId, request);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            log.error("프로필 수정 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("토큰 검증 실패: {}", e.getMessage());
            return ResponseEntity.status(401).body("유효하지 않은 토큰입니다.");
        }
    }

    // ✅ 예외 처리: 입력값 유효성 검사 실패
    @ExceptionHandler(jakarta.validation.ConstraintViolationException.class)
    public ResponseEntity<String> handleValidationException(Exception e) {
        return ResponseEntity.badRequest().body("입력값이 올바르지 않습니다: " + e.getMessage());
    }
}