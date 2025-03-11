package com.company.service;

import com.company.dto.UserSignupRequest;
import com.company.entity.role.Role;
import com.company.entity.user.User;
import com.company.entity.vehicle.Vehicle;
import com.company.repository.UserRepository;
import com.company.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final PasswordEncoder passwordEncoder;

    // ✅ 사용자 등록 메소드 (로그인 가능하도록 수정)
    @Transactional
    public User registerUser(UserSignupRequest request) {

        // 🚨 중복된 userId 검사 (이미 존재하면 예외 발생)
        if (userRepository.existsByUserId(request.getUserId())) { // 필드명 수정
            throw new IllegalArgumentException("이미 존재하는 사용자 ID입니다.");
        }

        // 🚨 사용자 정보 저장
        User user = new User();
        user.setUserId(request.getUserId());
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        // ✅ 비밀번호 암호화 (필수)
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // ✅ 기본 역할 USER 설정
        user.setRole(Role.USER);

        log.info(user.toString());
        User savedUser = userRepository.save(user); // 저장 후 사용자 정보 반환

        // ✅ 차량 정보가 있는 경우 차량 저장
        if (request.getCarModel() != null && request.getVin() != null) {
            Vehicle vehicle = new Vehicle();
            vehicle.setOwner(savedUser);  // 사용자 정보를 차량의 owner_id로 설정
            vehicle.setMake(request.getCarMake());
            vehicle.setModel(request.getCarModel());

            // 🚨 year 변환 시 NumberFormatException 방지 (DTO에서 Integer로 변경)
            vehicle.setYear(request.getYear());

            vehicle.setVin(request.getVin());
            vehicle.setCarNumber(request.getCarNumber());
            vehicleRepository.save(vehicle); // 차량 정보 저장
        }

        return savedUser;
    }
}
