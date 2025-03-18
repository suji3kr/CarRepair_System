package com.company.controller;

import com.company.dto.UserDTO;
import com.company.entity.cars.Car;
import com.company.entity.user.User;
import com.company.repository.CarRepository;
import com.company.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final CarRepository carRepository;

    // ✅ 현재 인증된 사용자 정보 가져오기
    private String getAuthenticatedUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        }
        return null;
    }

    // ✅ 전체 사용자 목록 조회 (등록된 차량 개수 포함)
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || authHeader.isEmpty()) {
            return ResponseEntity.status(401).body("🔒 인증 토큰이 필요합니다.");
        }

        List<UserDTO> users = userRepository.findAll().stream()
                .map(UserDTO::new)
                .collect(Collectors.toList());

        if (users.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("Authorization", authHeader); // 응답 헤더에 Authorization 추가

        return ResponseEntity.ok().headers(responseHeaders).body(users);
    }

    // ✅ 사용자 삭제
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || authHeader.isEmpty()) {
            return ResponseEntity.status(401).body("🔒 인증 토큰이 필요합니다.");
        }

        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            userRepository.delete(userOptional.get());
            return ResponseEntity.ok("✅ 사용자 ID " + id + " 삭제 완료.");
        } else {
            return ResponseEntity.status(404).body("❌ 사용자를 찾을 수 없습니다.");
        }
    }

    // ✅ 전체 차량 목록 조회
    @GetMapping("/cars")
    public ResponseEntity<?> getAllCars(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || authHeader.isEmpty()) {
            return ResponseEntity.status(401).body("🔒 인증 토큰이 필요합니다.");
        }

        List<Car> cars = carRepository.findAll();
        if (cars.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("Authorization", authHeader); // 응답 헤더에 Authorization 추가

        return ResponseEntity.ok().headers(responseHeaders).body(cars);
    }

    // ✅ 특정 차량 삭제 (존재 여부 검증 및 예외 처리 강화)
    @DeleteMapping("/cars/{carId}")
    public ResponseEntity<?> deleteCar(@PathVariable Long carId, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || authHeader.isEmpty()) {
            return ResponseEntity.status(401).body("🔒 인증 토큰이 필요합니다.");
        }

        return carRepository.findById(carId)
                .map(car -> {
                    carRepository.delete(car);
                    return ResponseEntity.ok("✅ 차량 ID " + carId + " 삭제 완료.");
                })
                .orElse(ResponseEntity.status(404).body("❌ 차량을 찾을 수 없습니다."));
    }
}
