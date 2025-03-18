package com.company.repository;

import com.company.entity.user.User;
import com.company.entity.vehicle.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    // ✅ 특정 사용자의 차량을 조회하는 메서드 (사용자가 차량을 여러 개 등록할 수도 있음)
    List<Vehicle> findByOwner(User user);

    // ✅ 특정 VIN을 가진 차량을 조회하는 메서드
    Optional<Vehicle> findByVin(String vin);

}
