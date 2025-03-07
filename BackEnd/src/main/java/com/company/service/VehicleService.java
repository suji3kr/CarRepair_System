package com.company.service;

import com.company.entity.car.CarInfo;
import com.company.entity.vehicle.Vehicle;
import com.company.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;  // VehicleRepository 주입

    // 차량 정보를 조회하는 메소드
    public Vehicle getVehicleById(Long vehicleId) {
        return vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("차량 정보를 찾을 수 없습니다. ID: " + vehicleId));
    }

    public Vehicle getVehicleByVIN(String vin){
        return vehicleRepository.findByVin(vin)
                .orElseThrow(()->  new RuntimeException("차량 정보를 찾을 수 없습니다. V ID Number: " + vin));
    }

    // 차량 정보 저장 메소드 (CarInfo도 Vehicle을 상속하므로 동일한 방식으로 처리)
    public Vehicle saveVehicle(Vehicle vehicle) {

        return vehicleRepository.save(vehicle);  // VehicleRepository를 통해 저장
    }

    // 차량 정보 삭제 메소드
    public void deleteVehicle(Long vehicleId) {
        Vehicle vehicle = getVehicleById(vehicleId);
        vehicleRepository.delete(vehicle);
    }

    // 차량 정보 업데이트
    public Vehicle updateVehicle(Long id, Vehicle vehicle) {
        Vehicle existingVehicle = getVehicleById(id);
        // 필요한 업데이트 로직
        return vehicleRepository.save(vehicle);
    }

    // 모든 차량 조회
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    // 새로운 차량 생성
    public Vehicle createVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }
}
