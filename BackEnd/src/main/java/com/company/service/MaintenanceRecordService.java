package com.company.service;

import com.company.entity.maintenance.MaintenanceRecord;
import com.company.entity.vehicle.Vehicle;
import com.company.repository.MaintenanceRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaintenanceRecordService {

    private final MaintenanceRecordRepository maintenanceRecordRepository;
    private final VehicleService vehicleService;

    // 차량 ID로 정비 내역 조회
    public List<MaintenanceRecord> getMaintenanceRecordsByVehicleId(Long vehicleId) {
        Vehicle vehicle = vehicleService.getVehicleById(vehicleId);
        return maintenanceRecordRepository.findByVehicle(vehicle);  // vehicle을 기반으로 정비 내역 조회
    }

    public MaintenanceRecord getRecordById(Long recordId) {
        return null;
    }

    public MaintenanceRecord createRecord(Long vehicleId, MaintenanceRecord record) {
        return record;
    }

    public MaintenanceRecord updateRecord(Long recordId, MaintenanceRecord record) {
        return record;
    }

    public void deleteRecord(Long recordId) {
    }
}
