package com.company.controller;

import com.company.dto.UserSignupRequest;
import com.company.dto.UserResponseDto;
import com.company.dto.UserUpdateRequest;
import com.company.entity.user.User;
import com.company.service.UserService;
import com.company.security.JwtTokenProvider;
import com.company.service.VehicleService;
import io.jsonwebtoken.JwtException;
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

    // ✅ 사용자 ID 기반 조회 API (PK 사용)
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            UserResponseDto userResponse = userService.getUserById(id);
            return ResponseEntity.ok(userResponse);
        } catch (IllegalArgumentException e) {
            log.error("사용자 조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body("사용자를 찾을 수 없습니다.");
        }
    }

    // ✅ 중복 확인 엔드포인트
    @PostMapping("/check-duplicate")
    public ResponseEntity<DuplicateCheckResponse> checkDuplicateId(@RequestBody DuplicateCheckRequest request) {
        try {
            if (request.getUserId() == null || request.getUserId().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new DuplicateCheckResponse(false, "아이디를 입력해 주세요."));
            }

            log.info("중복 확인 요청: userId={}", request.getUserId());
            boolean isDuplicate = userService.existsByUserId(request.getUserId());
            log.info("중복 여부: isDuplicate={}", isDuplicate);
            return ResponseEntity.ok(new DuplicateCheckResponse(isDuplicate));
        } catch (Exception e) {
            log.error("중복 확인 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(new DuplicateCheckResponse(true, "서버 오류가 발생했습니다."));
        }
    }

    // ✅ 현재 로그인한 사용자 정보 조회 API
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String token) {
        try {
            String jwtToken = token.replace("Bearer ", "");
            String userId = jwtTokenProvider.getUserIdFromToken(jwtToken); // 수정된 메서드 호출
            UserResponseDto responseDto = userService.getUserByUserIdWithVehicle(userId);
            return ResponseEntity.ok(responseDto);
        } catch (JwtException e) {
            log.error("토큰 파싱 실패: {}", e.getMessage());
            return ResponseEntity.status(401).body("유효하지 않은 토큰입니다.");
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
            String userId = jwtTokenProvider.getUserIdFromToken(token); // 수정된 메서드 호출
            UserResponseDto updatedUser = userService.updateUser(userId, request);
            return ResponseEntity.ok(updatedUser);
        } catch (JwtException e) {
            log.error("토큰 파싱 실패: {}", e.getMessage());
            return ResponseEntity.status(401).body("유효하지 않은 토큰입니다.");
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

// 요청 DTO
record DuplicateCheckRequest(String userId) {
    public String getUserId() {
        return userId;
    }
}

// 응답 DTO
record DuplicateCheckResponse(boolean isDuplicate, String message) {
    public DuplicateCheckResponse(boolean isDuplicate) {
        this(isDuplicate, isDuplicate ? "중복된 아이디입니다." : "사용 가능한 아이디입니다.");
    }
}