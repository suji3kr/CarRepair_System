package com.company.service;

import com.company.dto.UserSignupRequest;
import com.company.entity.role.Role;
import com.company.entity.user.User;
import com.company.entity.vehicle.Vehicle;
import com.company.repository.UserRepository;
import com.company.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final PasswordEncoder passwordEncoder;

    public User registerUser(UserSignupRequest request) {
        // 사용자 정보 저장
        User user = new User();
        user.setUserId(request.getUser_id());
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // 비밀번호 암호화
        user.setRole(Role.valueOf("USER")); // 기본 역할 USER 설정

        User savedUser = userRepository.save(user); // 저장 후 사용자 정보 반환

        // 차량 정보 저장 (Vehicle 엔티티 사용)
        if (request.isCo_owner()) {
            Vehicle vehicle = new Vehicle();
            vehicle.setOwner(savedUser);  // 사용자 정보를 차량의 owner_id로 설정
            vehicle.setMake(request.getCarMake());
            vehicle.setModel(request.getCarModel());
            vehicle.setVin(request.getVin());
            vehicle.setCarNumber(request.getCarNumber());

            vehicleRepository.save(vehicle); // 차량 정보 저장
        }

        return savedUser;  // 저장된 사용자 객체 반환
    }
}
