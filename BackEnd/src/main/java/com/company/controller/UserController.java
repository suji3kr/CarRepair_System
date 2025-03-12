package com.company.controller;

import com.company.dto.UserSignupRequest;
import com.company.dto.UserResponseDto;
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
        // 사용자 등록 후 DTO 반환
        User user = userService.registerUser(request);

        // ✅ 비밀번호가 제거된 UserResponseDto로 변환
        UserResponseDto responseDto = new UserResponseDto(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().name(),
                List.of()
        );

        return ResponseEntity.ok(responseDto); // ✅ 보안 강화: 비밀번호 없는 DTO 반환
    }

    // ✅ 현재 로그인한 사용자 정보 조회 API
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String token) {
        try {
            // Bearer 토큰에서 실제 토큰 값 추출
            String jwtToken = token.replace("Bearer ", "");
            String userId = jwtTokenProvider.getUserIdFromToken(jwtToken);

            User user = userService.getUserByUserId(userId);
            if (user == null) {
                return ResponseEntity.status(404).body("사용자를 찾을 수 없습니다.");
            }

            // ✅ 비밀번호가 제거된 UserResponseDto로 변환
            UserResponseDto responseDto = new UserResponseDto(
                    user.getUserId(),
                    user.getName(),
                    user.getEmail(),
                    user.getPhone(),
                    user.getRole().name(),
                    vehicleService.getVehicleByOwner(user)
            );

            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("유효하지 않은 토큰입니다.");
        }
    }

    // ✅ 예외 처리: 입력값이 누락되었을 경우 400 응답 반환
    @ExceptionHandler(jakarta.validation.ConstraintViolationException.class)
    public ResponseEntity<String> handleValidationException(Exception e) {
        return ResponseEntity.badRequest().body("입력값이 올바르지 않습니다: " + e.getMessage());
    }
}
