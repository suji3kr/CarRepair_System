package com.company.repository;

import com.company.entity.vehicle.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarInfoRepository extends JpaRepository<Vehicle, Long> {
}
