package com.company.service;

import com.company.dto.UserResponseDto;
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

    // ✅ 일반 회원가입 메서드
    @Transactional
    public User registerUser(UserSignupRequest request) {

        // 🚨 중복된 userId 검사 (이미 존재하면 예외 발생)
        if (userRepository.existsByUserId(request.getUserId())) {
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

        log.info("[회원가입] 새 계정 등록: " + user.toString());
        User savedUser = userRepository.save(user);

        // ✅ 차량 정보가 있는 경우 차량 저장
        if (request.getCarModel() != null && request.getVin() != null) {
            Vehicle vehicle = new Vehicle();
            vehicle.setOwner(savedUser);  // 사용자 정보를 차량의 owner_id로 설정
            vehicle.setCarMake(request.getCarMake());
            vehicle.setCarModel(request.getCarModel());

            // 🚨 year 변환 시 NumberFormatException 방지 (DTO에서 Integer로 변경)
            vehicle.setYear(request.getYear());

            vehicle.setVin(request.getVin());
            vehicle.setCarNumber(request.getCarNumber());
            saveVehicleInfo(savedUser, request);
        }

        return savedUser;
    }

    // ✅ Google 로그인 후 자동 회원가입 메서드 (차량 정보 포함)
    @Transactional
    public User googleRegisterUser(String email, String name) {
        // 🚨 중복된 이메일 검사 (이미 존재하면 기존 계정 반환)
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            return existingUser.get(); // 기존 회원 반환
        }

        // ✅ Google 계정은 비밀번호를 사용하지 않으므로 null로 설정 (비밀번호 없이 로그인 가능)
        String userId = email.split("@")[0];

        // 🚨 사용자 정보 저장
        User user = new User();
        user.setUserId(userId); // 이메일 앞부분을 userId로 사용
        user.setName(name);
        user.setEmail(email);
        user.setPhone("N/A"); // 기본 값 설정 (Google 로그인 시 전화번호 없음)
        user.setPassword(null); // Google 계정은 비밀번호 사용 안 함
        user.setRole(Role.USER);

        log.info("[Google 회원가입] 새 계정 등록: " + user.toString());
        User savedUser = userRepository.save(user);

        // 🚗 Google 로그인 회원도 차량 정보를 등록할 수 있도록 추가
        saveDefaultVehicle(savedUser);

        return savedUser;
    }

    // ✅ 차량 정보 저장 로직을 별도로 분리 (일반 회원가입과 Google 회원가입에서 사용 가능)
    private void saveVehicleInfo(User user, UserSignupRequest request) {
        Vehicle vehicle = new Vehicle();
        vehicle.setOwner(user);
        vehicle.setCarMake(request.getCarMake());
        vehicle.setCarModel(request.getCarModel());
        vehicle.setYear(request.getYear());
        vehicle.setVin(request.getVin());
        vehicle.setCarNumber(request.getCarNumber());

        // 🚗 공동 소유자 정보가 있으면 설정
        if (request.isCoOwner()) {
            vehicle.setCoOwner(true);
            vehicle.setCoOwnerName(request.getCoOwnerName());
            vehicle.setCoOwnerPhone(request.getCoOwnerPhone());
        }

        vehicleRepository.save(vehicle);
    }

    // ✅ Google 로그인 시 기본 차량 정보를 추가하는 메서드
    private void saveDefaultVehicle(User user) {
        Vehicle vehicle = new Vehicle();
        vehicle.setOwner(user);
        vehicle.setCarMake("Unknown"); // 기본 차량 정보 설정
        vehicle.setCarModel("Unknown");
        vehicle.setYear(0);
        vehicle.setVin("N/A");
        vehicle.setCarNumber("N/A");
        vehicle.setCoOwner(false);

        vehicleRepository.save(vehicle);
    }

    // ✅ userId 기반 사용자 조회
    public User getUserByUserId(String userId) {
        Optional<User> userOptional = userRepository.findByUserId(userId);
        return userOptional.orElse(null);
    }

    @Transactional
    public UserResponseDto getUserByUserIdWithVehicle(String userId) {

        User user = userRepository.findByUserId(userId).orElseThrow();
        return new UserResponseDto(
            user.getUserId(),
            user.getName(),
            user.getEmail(),
            user.getPhone(),
            user.getRole().name(),
            vehicleRepository.findByOwner(user)
        );
    }
}