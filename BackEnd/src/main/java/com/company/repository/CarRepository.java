package com.company.repository;

import com.company.entity.cars.Car;
import com.company.entity.vehicle.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {
    List<Car> findByCarMake(String carMake); // carMake 필드에 맞춤

}