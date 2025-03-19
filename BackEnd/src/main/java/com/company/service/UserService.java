package com.company.service;

import com.company.dto.UserResponseDto;
import com.company.dto.UserSignupRequest;
import com.company.dto.UserUpdateRequest;
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
        if (existsByUserId(request.getUserId())) {
            throw new IllegalArgumentException("이미 존재하는 사용자 ID입니다.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        User user = new User();
        user.setUserId(request.getUserId());
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);

        log.info("[회원가입] 새 계정 등록: {}", user);
        User savedUser = userRepository.save(user);

        if (request.getCarModel() != null && request.getVin() != null) {
            saveVehicleInfo(savedUser, request); // 차량 정보 저장
        }

        return savedUser;
    }

    // ✅ Google 로그인 후 자동 회원가입 메서드
    @Transactional
    public User googleRegisterUser(String email, String name) {
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            return existingUser.get();
        }

        String userId = email.split("@")[0];
        if (existsByUserId(userId)) {
            throw new IllegalArgumentException("이미 존재하는 사용자 ID입니다.");
        }

        User user = new User();
        user.setUserId(userId);
        user.setName(name);
        user.setEmail(email);
        user.setPhone("N/A");
        user.setPassword(null); // Google 계정은 비밀번호 없음
        user.setRole(Role.USER);

        log.info("[Google 회원가입] 새 계정 등록: {}", user);
        User savedUser = userRepository.save(user);

        saveDefaultVehicle(savedUser);
        return savedUser;
    }

    // ✅ 차량 정보 저장 로직
    private void saveVehicleInfo(User user, UserSignupRequest request) {
        Vehicle vehicle = new Vehicle();

        vehicle.setOwner(user);
        vehicle.setCarMake(request.getCarMake());
        vehicle.setCarModel(request.getCarModel());
        vehicle.setYear(request.getYear());
        vehicle.setVin(request.getVin());
        vehicle.setCarNumber(request.getCarNumber());

        if (request.isCoOwner()) {
            vehicle.setCoOwner(true);
            vehicle.setCoOwnerName(request.getCoOwnerName());
            vehicle.setCoOwnerPhone(request.getCoOwnerPhone());
        }

        vehicleRepository.save(vehicle);
        log.info("[차량 정보 저장] 사용자: {}, 차량: {}", user.getUserId(), vehicle);
    }

    // ✅ Google 로그인 시 기본 차량 정보 추가
    private void saveDefaultVehicle(User user) {
        Vehicle vehicle = new Vehicle();
        vehicle.setOwner(user);
        vehicle.setCarMake("Unknown");
        vehicle.setCarModel("Unknown");
        vehicle.setYear(0);
        vehicle.setVin("N/A");
        vehicle.setCarNumber("N/A");
        vehicle.setCoOwner(false);

        vehicleRepository.save(vehicle);
        log.info("[기본 차량 저장] 사용자: {}", user.getUserId());
    }

    // ✅ userId 기반 중복 확인 메서드
    public boolean existsByUserId(String userId) {
        log.debug("중복 확인 요청: userId={}", userId);
        return userRepository.existsByUserId(userId);
    }

    // ✅ userId 기반 사용자 조회
    public User getUserByUserId(String userId) {
        return userRepository.findByUserId(userId).orElse(null);
    }

    // ✅ 사용자와 차량 정보 조회
    @Transactional(readOnly = true)
    public UserResponseDto getUserByUserIdWithVehicle(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        return new UserResponseDto(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().name(),
                vehicleRepository.findByOwner(user)
        );
    }

    // ✅ 사용자 정보 수정
    @Transactional
    public UserResponseDto updateUser(String userId, UserUpdateRequest request) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 수정 가능한 필드만 업데이트
        if (request.getName() != null && !request.getName().isEmpty()) {
            user.setName(request.getName());
        }
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            if (!request.getEmail().equals(user.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
            }
            user.setEmail(request.getEmail());
        }
        if (request.getPhone() != null && !request.getPhone().isEmpty()) {
            user.setPhone(request.getPhone());
        }

        User updatedUser = userRepository.save(user);
        log.info("[사용자 정보 수정] 업데이트된 사용자: {}", updatedUser);

        return new UserResponseDto(
                updatedUser.getUserId(),
                updatedUser.getName(),
                updatedUser.getEmail(),
                updatedUser.getPhone(),
                updatedUser.getRole().name(),
                vehicleRepository.findByOwner(updatedUser)
        );
    }

    @Transactional(readOnly = true)
    public UserResponseDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        return new UserResponseDto(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().name(),
                null // ✅ 차량 정보 제외
        );
    }
}