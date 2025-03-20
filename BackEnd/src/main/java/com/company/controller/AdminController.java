package com.company.controller;

import com.company.dto.UpdateReservationStatusRequest;
import com.company.dto.UserDTO;
import com.company.entity.cars.Car;
import com.company.entity.part.Part;
import com.company.entity.repair.Reservation;
import com.company.entity.repair.ReservationStatus;
import com.company.repository.CarRepository;
import com.company.repository.PartRepository;
import com.company.repository.UserRepository;
import com.company.service.ReservationService;
import jakarta.persistence.OptimisticLockException;
import lombok.RequiredArgsConstructor;
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
    private final ReservationService reservationService;

    @GetMapping("/check")
    public ResponseEntity<?> checkAdmin(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || authHeader.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("🔒 인증 토큰이 필요합니다.");
        }

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

    @GetMapping("/reservations")
    public ResponseEntity<List<Reservation>> getAllReservations(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || authHeader.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<Reservation> reservations = reservationService.getAllReservations();
        return reservations.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(reservations);
    }

    @PutMapping("/reservations/{id}/status")
    public ResponseEntity<?> updateReservationStatus(
            @PathVariable Long id,
            @RequestBody UpdateReservationStatusRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || authHeader.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("🔒 인증 토큰이 필요합니다.");
        }

        try {
            ReservationStatus updatedStatus = request.toReservationStatus();
            reservationService.updateReservationStatus(id, updatedStatus);
            return ResponseEntity.ok("✅ 예약 ID " + id + " 상태가 " + updatedStatus + "로 업데이트되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (OptimisticLockException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("❌ 다른 요청에 의해 예약 상태가 이미 변경되었습니다. 다시 시도해주세요.");
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || authHeader.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<UserDTO> users = userRepository.findAll().stream()
                .map(UserDTO::new)
                .collect(Collectors.toList());

        return users.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || authHeader.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("🔒 인증 토큰이 필요합니다.");
        }

        return userRepository.findById(id)
                .map(user -> {
                    userRepository.delete(user);
                    return ResponseEntity.ok("✅ 사용자 ID " + id + " 삭제 완료.");
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ 사용자를 찾을 수 없습니다."));
    }

    @GetMapping("/cars")
    public ResponseEntity<List<Car>> getAllCars(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || authHeader.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<Car> cars = carRepository.findAll();
        return cars.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(cars);
    }

    @DeleteMapping("/cars/{carId}")
    public ResponseEntity<String> deleteCar(@PathVariable Long carId, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || authHeader.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("🔒 인증 토큰이 필요합니다.");
        }

        return carRepository.findById(carId)
                .map(car -> {
                    carRepository.delete(car);
                    return ResponseEntity.ok("✅ 차량 ID " + carId + " 삭제 완료.");
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ 차량을 찾을 수 없습니다."));
    }

    @GetMapping("/partshop")
    public ResponseEntity<List<Part>> getAllParts(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || authHeader.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<Part> parts = partRepository.findAll();
        return parts.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(parts);
    }

    @DeleteMapping("/partshop/{id}")
    public ResponseEntity<String> deletePart(@PathVariable Long id, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || authHeader.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("🔒 인증 토큰이 필요합니다.");
        }

        return partRepository.findById(id)
                .map(part -> {
                    partRepository.delete(part);
                    return ResponseEntity.ok("✅ 부품 ID " + id + " 삭제 완료.");
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ 부품을 찾을 수 없습니다."));
    }
}
