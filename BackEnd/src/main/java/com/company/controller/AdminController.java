package com.company.controller;

import com.company.dto.UserDTO;
import com.company.entity.cars.Car;
import com.company.entity.user.User;
import com.company.repository.CarRepository;
import com.company.repository.UserRepository;
import com.company.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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


    // ✅ 전체 사용자 목록 조회 (등록된 차량 개수 포함)
    @GetMapping("/users")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userRepository.findAll().stream()
                .map(UserDTO::new)
                .collect(Collectors.toList());

        if (users.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // ✅ 사용자 삭제
            userRepository.delete(user);

            return ResponseEntity.ok("사용자 ID " + id + " 및 등록된 차량(Car) 삭제 완료.");
        } else {
            return ResponseEntity.status(404).body("사용자를 찾을 수 없습니다.");
        }
    }



    // ✅ 전체 차량 목록 조회
    @GetMapping("/cars")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Car>> getAllCars() {
        List<Car> cars = carRepository.findAll();

        if (cars.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(cars);
    }

    // ✅ 특정 차량 삭제 (존재 여부 검증 및 예외 처리 강화)
    @DeleteMapping("/cars/{carId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteCar(@PathVariable Long carId) {
        return carRepository.findById(carId)
                .map(car -> {
                    carRepository.delete(car);
                    return ResponseEntity.ok("차량 ID " + carId + " 삭제 완료.");
                })
                .orElse(ResponseEntity.status(404).body("차량을 찾을 수 없습니다."));
    }
}