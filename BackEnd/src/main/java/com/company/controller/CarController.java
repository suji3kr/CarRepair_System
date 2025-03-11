package com.company.controller;



import com.company.entity.cars.Car;
import com.company.service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars") // 엔드포인트 변경
@CrossOrigin(origins = "http://localhost:3000") // 임시 CORS 설정
public class CarController {
    @Autowired
    private CarService carService;

    @GetMapping
    public List<Car> getCarsByCategory(@RequestParam String category) {
        return carService.getCarsByCategory(category);
    }
}