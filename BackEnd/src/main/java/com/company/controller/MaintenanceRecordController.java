package com.company.controller;

import com.company.entity.maintenance.MaintenanceRecord;
import com.company.service.MaintenanceRecordService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles/{vehicleId}/maintenance")
public class MaintenanceRecordController {

    @Autowired
    private MaintenanceRecordService maintenanceRecordService;

    // 차량 ID(vehicleId)를 기반으로 정비 기록 목록 조회
    @GetMapping
    public List<MaintenanceRecord> getMaintenanceRecords(@PathVariable Long vehicleId) {
        return maintenanceRecordService.getMaintenanceRecordsByVehicleId(vehicleId);
    }

    // 정비 기록 ID로 단건 조회
    @GetMapping("/{recordId}")
    public MaintenanceRecord getMaintenanceRecord(@PathVariable Long recordId) {
        return maintenanceRecordService.getRecordById(recordId);
    }

    // 차량 ID 기반 정비 기록 생성
    @PostMapping
    public MaintenanceRecord createMaintenanceRecord(@PathVariable Long vehicleId, @RequestBody MaintenanceRecord record) {
        return maintenanceRecordService.createRecord(vehicleId, record);
    }

    // 정비 기록 업데이트
    @PutMapping("/{recordId}")
    public MaintenanceRecord updateMaintenanceRecord(@PathVariable Long recordId, @RequestBody MaintenanceRecord record) {
        return maintenanceRecordService.updateRecord(recordId, record);
    }

    // 정비 기록 삭제
    @DeleteMapping("/{recordId}")
    public void deleteMaintenanceRecord(@PathVariable Long recordId) {
        maintenanceRecordService.deleteRecord(recordId);
    }
}
