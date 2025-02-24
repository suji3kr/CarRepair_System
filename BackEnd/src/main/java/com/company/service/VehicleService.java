package com.company.service;

import com.company.entity.Vehicle;
import com.company.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    // 전체 차량 목록 조회
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    // ID로 차량 조회
    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id).orElse(null);
    }

    // 차량 생성
    public Vehicle createVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    // 차량 업데이트
    public Vehicle updateVehicle(Long id, Vehicle updatedVehicle) {
        Optional<Vehicle> optionalVehicle = vehicleRepository.findById(id);
        if(optionalVehicle.isPresent()){
            Vehicle vehicle = optionalVehicle.get();
            vehicle.setMake(updatedVehicle.getMake());
            vehicle.setModel(updatedVehicle.getModel());
            vehicle.setYear(updatedVehicle.getYear());
            vehicle.setVin(updatedVehicle.getVin());
            vehicle.setOwner(updatedVehicle.getOwner());
            return vehicleRepository.save(vehicle);
        }
        return null;
    }

    // 차량 삭제
    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }
}
