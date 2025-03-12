package com.company.controller;



import com.company.entity.cars.Car;
import com.company.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api")
public class CarController {
    @Autowired
    private CarRepository carRepository;

    @GetMapping("/cars")
    public List<Car> getCarsByMake(@RequestParam("car_make") String carMake) {
        return carRepository.findByCarMake(carMake);
    }
}