package com.company.entity.cars;

import jakarta.persistence.*;

@Entity
public class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "carModel")
    private String carModel;

    @Column(name = "image_url")
    private String image_url;

    @Column(name = "carMake")
    private String carMake;

    // 기본 생성자
    public Car() {}

    // getters, setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCarModel() { return carModel; }
    public void setCarModel(String carModel) { this.carModel = carModel; }
    public String getImage_url() { return image_url; }
    public void setImage_url(String image_url) { this.image_url = image_url; }
    public String getCarMake() { return carMake; }
    public void setCarMake(String carMake) { this.carMake = carMake; }
}