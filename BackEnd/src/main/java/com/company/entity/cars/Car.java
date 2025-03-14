package com.company.entity.cars;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "car")  // 테이블명이 car인 경우 명시
@Getter
@Setter
@NoArgsConstructor  // 기본 생성자 자동 생성
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "car_model") // snake_case 사용 가능
    private String carModel;

    @Column(name = "image_url") // snake_case 사용 가능
    private String imageUrl;

    @Column(name = "car_make")
    private String carMake;

    // ✅ 기존 세터에서 오타 수정
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
