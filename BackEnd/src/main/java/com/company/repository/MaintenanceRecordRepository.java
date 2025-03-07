package com.company.repository;

import com.company.entity.maintenance.MaintenanceRecord;
import com.company.entity.vehicle.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MaintenanceRecordRepository extends JpaRepository<MaintenanceRecord, Long> {
    // Vehicle의 id를 기준으로 정비 기록 목록 조회
    List<MaintenanceRecord> findByVehicle(Vehicle vehicle);
}
