package com.company.service;

import com.company.dto.UserSignupRequest;
import com.company.entity.car.CarInfo;
import com.company.entity.role.Role;
import com.company.entity.user.User;
import com.company.repository.CarInfoRepository;
import com.company.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final CarInfoRepository carInfoRepository;
    private final PasswordEncoder passwordEncoder;

    public static User registerUser(UserSignupRequest request) {
        // 🚗 차량 정보 생성
        CarInfo carInfo = new CarInfo();
        carInfo.setCarModel(request.getCarModel());
        carInfo.setCarNumber(request.getCarNumber());
        carInfo.setCoOwner(request.isCoOwner());
        carInfo.setCoOwnerName(request.getCoOwnerName());
        carInfo.setCoOwnerPhone(request.getCoOwnerPhone());
        carInfoRepository.save(carInfo); // 차량 정보 저장

        // 👤 사용자 정보 저장
        User user = new User();
        user.setUserId(request.getUserId());
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setTelecom(request.getTelecom());
        user.setRole(Role.valueOf("ROLE_USER")); // 기본값 ROLE_USER 설정 (필요시 관리자 처리)
        user.setCarInfo(carInfo); // 차량 정보 연결

        return userRepository.save(user);
    }
}
