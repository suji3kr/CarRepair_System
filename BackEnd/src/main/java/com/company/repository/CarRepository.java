package com.company.repository;

import com.company.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarRepository extends JpaRepository<Vehicle, Long> {
}
