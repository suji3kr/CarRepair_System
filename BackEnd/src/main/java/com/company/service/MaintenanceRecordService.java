package com.company.service;

import com.company.entity.maintenance.MaintenanceRecord;
import com.company.entity.vehicle.Vehicle;
import com.company.repository.MaintenanceRecordRepository;
import com.company.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;

@Service
public class MaintenanceRecordService {

    @Autowired
    private MaintenanceRecordRepository maintenanceRecordRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    // 특정 차량(Vehicle)에 해당하는 정비 내역 조회
    public List<MaintenanceRecord> getMaintenanceRecordsByVehicleId(Long vehicleId) {
        return maintenanceRecordRepository.findByVehicleId(vehicleId);
    }

    // 만약 기존 API와의 호환을 위해 Car 관련 메서드가 필요하면 Vehicle을 사용하도록 호출
    public List<MaintenanceRecord> getMaintenanceRecordsByCarId(Long carId) {
        return getMaintenanceRecordsByVehicleId(carId);
    }

    // 정비 내역 ID로 조회
    public MaintenanceRecord getRecordById(Long id) {
        return maintenanceRecordRepository.findById(id).orElse(null);
    }

    // 차량 ID를 기준으로 정비 내역 생성
    public MaintenanceRecord createRecord(Long vehicleId, MaintenanceRecord record) {
        Optional<Vehicle> optionalVehicle = vehicleRepository.findById(vehicleId);
        if (optionalVehicle.isPresent()) {
            record.setVehicle(optionalVehicle.get());
            return maintenanceRecordRepository.save(record);
        }
        return null;
    }

    // 정비 내역 업데이트 (serviceDate, description, cost, serviceType 등)
    public MaintenanceRecord updateRecord(Long id, MaintenanceRecord updatedRecord) {
        Optional<MaintenanceRecord> optionalRecord = maintenanceRecordRepository.findById(id);
        if (optionalRecord.isPresent()) {
            MaintenanceRecord record = optionalRecord.get();
            record.setDescription(updatedRecord.getDescription());
            record.setServiceDate(updatedRecord.getServiceDate());
            record.setCost(updatedRecord.getCost());
            record.setServiceType(updatedRecord.getServiceType());
            return maintenanceRecordRepository.save(record);
        }
        return null;
    }

    // 정비 내역 삭제
    public void deleteRecord(Long id) {
        maintenanceRecordRepository.deleteById(id);
    }
}
