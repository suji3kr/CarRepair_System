package com.company.controller;

import com.company.dto.UserSignupRequest;
import com.company.dto.login.GoogleLoginRequest;
import com.company.dto.login.LoginRequest;
import com.company.entity.car.CarInfo;
import com.company.entity.user.User;
import com.company.service.AuthenticationService;
import com.company.service.CarInfoService;
import com.company.service.UserService;
import com.company.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;
    private final UserService userService;
    private final CarInfoService carInfoService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest request) {
        return ResponseEntity.ok(authenticationService.googleAuthenticate(request));
    }


//    private final VehicleService vehicleService;  // VehicleService 주입
//    @PostMapping("/signup")
//    public ResponseEntity<User> register(@RequestBody UserSignupRequest request) {
//        // 차량 정보 저장 (VehicleService를 통해 저장)
//        CarInfo carInfo = new CarInfo();  // CarInfo 객체 생성
//        carInfo.setCarModel(request.getCarModel());
//        carInfo.setCarNumber(request.getCarNumber());
//        carInfo.setCoOwner(request.isCoOwner());
//        carInfo.setCoOwnerName(request.getCoOwner_name());
//        carInfo.setCoOwnerPhone(request.getCoOwner_phone());
//
//        // VehicleService를 통해 CarInfo 저장
//        carInfo = (CarInfo) vehicleService.saveVehicle(carInfo); // VehicleService 인스턴스를 통해 호출
//
//        // 추가적인 회원 가입 처리 로직 (User 저장 등)
//        return ResponseEntity.ok(new User()); // 반환할 사용자 정보
//    }
}
