package com.company.service;


import com.company.dto.CarDto;
import com.company.entity.cars.Car;
import com.company.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CarService {
    private final CarRepository carRepository;

    public CarService(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    public List<CarDto> getCarsByMake(String carMake) {
        List<Car> cars = carRepository.findByCarMake(carMake);
        return cars.stream()
                .map(car -> new CarDto(car.getCarMake(), car.getCarModel(), String.valueOf(car.getId()), car.getImageUrl()))
                .collect(Collectors.toList());
    }
}