package com.company.controller;

import com.company.dto.UserSignupRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired  // ✅ Spring이 자동으로 JdbcTemplate을 주입
    private JdbcTemplate jdbcTemplate;
    private PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<String> registerUser(@RequestBody UserSignupRequest request) {
        try {
            // 1️⃣ users 테이블에 사용자 정보 저장
            String userInsertQuery = "INSERT INTO users (userId, name, email, password, phone, role, coOwner, coOwnerName, coOwnerPhone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            jdbcTemplate.update(userInsertQuery, request.getUserId(), request.getName(), request.getEmail(),
                    passwordEncoder.encode(request.getPassword()), request.getPhone(), "USER",
                    request.isCoOwner(), request.getCoOwnerName(), request.getCoOwnerPhone());

            // 2️⃣ vehicles 테이블에 차량 정보 저장
            String vehicleInsertQuery = "INSERT INTO vehicles (owner_id, make, model, year, vin, carNumber) VALUES ((SELECT id FROM users WHERE userId = ?), ?, ?, ?, ?, ?)";
            jdbcTemplate.update(vehicleInsertQuery, request.getUserId(), request.getCarMake(), request.getCarModel(),
                    request.getCarYear(), request.getVin(), request.getCarNumber());

            // 3️⃣ user_vehicles 테이블에 사용자와 차량 관계 저장
            String userVehicleQuery = "INSERT INTO user_vehicles (user_id, vehicle_id) VALUES ((SELECT id FROM users WHERE userId = ?), (SELECT id FROM vehicles WHERE vin = ?))";
            jdbcTemplate.update(userVehicleQuery, request.getUserId(), request.getVin());

            return ResponseEntity.ok("회원가입이 완료되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입 실패: " + e.getMessage());
        }
    }

}
