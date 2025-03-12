package com.company.service;

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

    // 차량 정보 저장 메소드
    public Vehicle saveVehicle(Vehicle vehicle) {
        // 공동 소유자 정보 유효성 검사 (coOwner가 true일 경우 필수)
        validateCoOwnerInfo(vehicle);
        return vehicleRepository.save(vehicle);
    }

    // 차량 정보 삭제 메소드
    public void deleteVehicle(Long vehicleId) {
        Vehicle vehicle = getVehicleById(vehicleId);
        vehicleRepository.delete(vehicle);
    }

    // 차량 정보 업데이트
    public Vehicle updateVehicle(Long id, Vehicle vehicle) {
        Vehicle existingVehicle = getVehicleById(id);
        // 공동 소유자 정보 업데이트 유효성 검사
        validateCoOwnerInfo(vehicle);

        // 필요한 업데이트 로직 (예: 기존 차량 정보 업데이트)
        existingVehicle.setMake(vehicle.getMake());
        existingVehicle.setModel(vehicle.getModel());
        existingVehicle.setYear(vehicle.getYear());
        existingVehicle.setVin(vehicle.getVin());
        existingVehicle.setCarNumber(vehicle.getCarNumber());
        existingVehicle.setCoOwner(vehicle.isCoOwner());
        existingVehicle.setCoOwnerName(vehicle.getCoOwnerName());
        existingVehicle.setCoOwnerPhone(vehicle.getCoOwnerPhone());

        return vehicleRepository.save(existingVehicle);
    }

    // 모든 차량 조회
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    // 새로운 차량 생성
    public Vehicle createVehicle(Vehicle vehicle) {
        // 공동 소유자 정보 유효성 검사
        validateCoOwnerInfo(vehicle);
        return vehicleRepository.save(vehicle);
    }

    // 공동 소유자 정보 유효성 검사
    private void validateCoOwnerInfo(Vehicle vehicle) {
        if (vehicle.isCoOwner()) {
            if (vehicle.getCoOwnerName() == null || vehicle.getCoOwnerPhone() == null) {
                throw new IllegalArgumentException("공동 소유자 정보가 누락되었습니다. 이름과 연락처가 필요합니다.");
            }
        }
    }

    // 차량의 공동 소유자 정보 조회
    public Vehicle getVehicleWithCoOwnerInfo(Long vehicleId) {
        Vehicle vehicle = getVehicleById(vehicleId);
        if (!vehicle.isCoOwner()) {
            throw new RuntimeException("이 차량은 공동 소유자가 없습니다.");
        }
        return vehicle;
    }
}
