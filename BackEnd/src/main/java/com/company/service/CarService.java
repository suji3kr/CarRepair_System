package com.company.service;


import com.company.entity.cars.Car;
import com.company.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarService {
    @Autowired
    private CarRepository carRepository;

    public List<Car> getCarsByCarMake(String car_Make) {
        return carRepository.findByCarMake(car_Make);
    }
}