package com.company.repository;

import com.company.entity.car.CarInfo;
import com.company.entity.user.User;
import com.company.entity.vehicle.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CarInfoRepository extends JpaRepository<Vehicle, Long> {
    static User save(CarInfo carInfo) {
        return null;
    }

    static Optional<Object> findbyId(Long carInfoId) {
        return null;
    }
}
