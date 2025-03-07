package com.company.repository;

import com.company.entity.vehicle.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    // Vehicle 관련 추가적인 커스텀 쿼리 메소드가 있다면 정의할 수 있습니다.
}
