package com.company.controller;

import com.company.dto.UserDTO;
import com.company.entity.cars.Car;
import com.company.entity.part.Part;
import com.company.entity.user.User;
import com.company.repository.CarRepository;
import com.company.repository.PartRepository;
import com.company.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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
    private final PartRepository partRepository;

    @GetMapping("/check")
    public ResponseEntity<?> checkAdmin(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || authHeader.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("🔒 인증 토큰이 필요합니다.");
        }

        // 현재 로그인한 사용자 정보 가져오기
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails userDetails) {
            boolean isAdmin = userDetails.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

            if (isAdmin) {
                return ResponseEntity.ok().body("✅ 관리자 확인 완료");
            }
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("🚫 접근 권한이 없습니다.");
    }



    // ✅ 현재 인증된 사용자 정보 가져오기
    private String getAuthenticatedUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        }
        return null;
    }

    // ✅ 전체 사용자 목록 조회
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || authHeader.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        List<UserDTO> users = userRepository.findAll().stream()
                .map(UserDTO::new)
                .collect(Collectors.toList());

        if (users.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(users);
    }

    // ✅ 사용자 삭제
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || authHeader.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("🔒 인증 토큰이 필요합니다.");
        }

        if (!userRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ 사용자를 찾을 수 없습니다.");
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok("✅ 사용자 ID " + id + " 삭제 완료.");
    }

    // ✅ 전체 차량 목록 조회
    @GetMapping("/cars")
    public ResponseEntity<List<Car>> getAllCars(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || authHeader.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        List<Car> cars = carRepository.findAll();
        if (cars.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(cars);
    }

    // ✅ 특정 차량 삭제
    @DeleteMapping("/cars/{carId}")
    public ResponseEntity<String> deleteCar(@PathVariable Long carId, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || authHeader.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("🔒 인증 토큰이 필요합니다.");
        }

        if (!carRepository.existsById(carId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ 차량을 찾을 수 없습니다.");
        }

        carRepository.deleteById(carId);
        return ResponseEntity.ok("✅ 차량 ID " + carId + " 삭제 완료.");
    }

    // ✅ 모든 부품 조회
    @GetMapping("/partshop")
    public ResponseEntity<List<Part>> getAllParts(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || authHeader.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        List<Part> parts = partRepository.findAll();
        if (parts.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(parts);
    }

    // ✅ 새로운 부품 추가
    @PostMapping("/partshop")
    public ResponseEntity<Part> createPart(@RequestBody Part part, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || authHeader.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        Part savedPart = partRepository.save(part);
        return ResponseEntity.ok(savedPart);
    }

    @PutMapping("/partshop/{id}")
    public ResponseEntity<?> updatePart(@PathVariable Long id, @RequestBody Part updatedPart,
                                        @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || authHeader.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("🔒 인증 토큰이 필요합니다.");
        }

        Optional<Part> partOptional = partRepository.findById(id);
        if (partOptional.isPresent()) {
            Part part = partOptional.get();

            // ✅ null 또는 빈 값 체크 (필수 컬럼 보호)
            if (updatedPart.getName() == null || updatedPart.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("❌ 부품명(name)은 비워둘 수 없습니다.");
            }
            if (updatedPart.getCategory() == null || updatedPart.getCategory().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("❌ 카테고리(category)는 비워둘 수 없습니다.");
            }

            // ✅ 값이 null이 아닌 경우만 업데이트
            part.setName(updatedPart.getName());
            part.setCategory(updatedPart.getCategory());
            part.setPrice(updatedPart.getPrice());
            part.setStock(updatedPart.getStock());

            return ResponseEntity.ok(partRepository.save(part));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ 부품을 찾을 수 없습니다.");
        }
    }

    // ✅ 특정 부품 삭제
    @DeleteMapping("/partshop/{id}")
    public ResponseEntity<String> deletePart(@PathVariable Long id, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || authHeader.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("🔒 인증 토큰이 필요합니다.");
        }

        if (!partRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ 부품을 찾을 수 없습니다.");
        }

        partRepository.deleteById(id);
        return ResponseEntity.ok("✅ 부품 ID " + id + " 삭제 완료.");
    }
}
