package com.company.service;

import com.company.entity.car.CarInfo;
import com.company.entity.vehicle.Vehicle;
import com.company.repository.CarInfoRepository;
import com.company.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CarInfoService {

//    private final CarInfoRepository carInfoRepository;
//    private final VehicleRepository vehicleRepository;
//
//    // 차량 수리 정보 저장
//    public CarInfo saveCarInfo(Long vehicleId, String serviceDescription, String serviceDate, double cost) {
//        // 차량 정보 조회
//        Vehicle vehicle = vehicleRepository.findById(vehicleId)
//                .orElseThrow(() -> new RuntimeException("차량을 찾을 수 없습니다. ID: " + vehicleId));
//
//        // 차량 수리 정보 저장
//        CarInfo carInfo = new CarInfo();
//        carInfo.setVehicle(vehicle);  // 수리 정보를 차량과 연결
//        carInfo.setServiceDescription(serviceDescription);
//        carInfo.setServiceDate(serviceDate);
//        carInfo.setCost(cost);
//
//        return carInfoRepository.save(carInfo);  // 수리 정보 저장
//    }
//
//    // 차량 정보 조회
//    public CarInfo getCarInfoById(Long carInfoId) {
//        return carInfoRepository.findById(carInfoId)
//                .orElseThrow(() -> new RuntimeException("차량 정보를 찾을 수 없습니다. ID: " + carInfoId));// VehicleService를 통해 조회
//    }
//
//    // 차량 정보 삭제
//    public void deleteCarInfo(Long carInfoId) {
//        carInfoRepository.deleteById(carInfoId);
//    }
}
