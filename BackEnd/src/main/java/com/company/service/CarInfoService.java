package com.company.service;

import com.company.entity.car.CarInfo;
import com.company.entity.vehicle.Vehicle;
import com.company.repository.CarInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CarInfoService {

    private final CarInfoRepository carInfoRepository; // CarInfoRepository 의존성 주입

    // 차량 정보를 저장하는 메소드
    public CarInfo saveCarInfo(String carModel, String carNumber, boolean coOwner, String coOwnerName, String coOwnerPhone) {
        // 차량 정보 객체 생성
        CarInfo carInfo = new CarInfo();
        carInfo.setCarModel(carModel);
        carInfo.setCarNumber(carNumber);
        carInfo.setCoOwner(coOwner);
        carInfo.setCoOwnerName(coOwnerName);
        carInfo.setCoOwnerPhone(coOwnerPhone);

        // 차량 정보 저장
        return CarInfoRepository.save(carInfo).getCarInfo();
    }

    // 차량 정보를 ID로 조회하는 메소드
    public CarInfo getCarInfoById(Long carInfoId) {
        return (CarInfo) CarInfoRepository.findbyId(carInfoId)
                .orElseThrow(() -> new RuntimeException("차량 정보를 찾을 수 없습니다. ID: " + carInfoId));
    }

    // 차량 정보 수정 메소드
    public CarInfo updateCarInfo(Long carInfoId, String carModel, String carNumber, boolean coOwner, String coOwnerName, String coOwnerPhone) {
        // 차량 정보 조회
        CarInfo carInfo = getCarInfoById(carInfoId);

        // 수정된 정보로 차량 정보 업데이트
        carInfo.setCarModel(carModel);
        carInfo.setCarNumber(carNumber);
        carInfo.setCoOwner(coOwner);
        carInfo.setCoOwnerName(coOwnerName);
        carInfo.setCoOwnerPhone(coOwnerPhone);

        // 수정된 차량 정보 저장
        return CarInfoRepository.save(carInfo).getCarInfo();
    }

    // 차량 정보 삭제 메소드
    public void deleteCarInfo(Long carInfoId) {
        CarInfo carInfo = getCarInfoById(carInfoId);
        carInfoRepository.delete(carInfo); // 차량 정보 삭제
    }
}
