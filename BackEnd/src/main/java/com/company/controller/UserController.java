package com.company.controller;

import com.company.dto.UserSignupRequest;
import com.company.entity.car.CarInfo;
import com.company.entity.user.User;
import com.company.service.UserService;
import com.company.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final VehicleService vehicleService;

    @PostMapping("/signup")
    public ResponseEntity<User> register(@RequestBody UserSignupRequest request) {
        // 차량 정보 저장 (VehicleService를 통해 저장)
        CarInfo carInfo = new CarInfo();  // CarInfo 객체 생성
        carInfo.setCarModel(request.getCarModel());
        carInfo.setCarNumber(request.getCarNumber());
        carInfo.setCoOwner(request.isCo_owner());
        carInfo.setCoOwnerName(request.getCo_owner_name());
        carInfo.setCoOwnerPhone(request.getCo_owner_phone());

        // VehicleService를 통해 CarInfo 저장
        carInfo = (CarInfo) vehicleService.saveVehicle(carInfo); // 수정된 방식으로 인스턴스 메소드 호출

        // 사용자 정보와 차량 정보 연결하여 저장
        User user = userService.registerUser(request); // 기존의 사용자 등록 메소드 호출

        return ResponseEntity.ok(user); // 저장된 사용자 반환
    }
}
