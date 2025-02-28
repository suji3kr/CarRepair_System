package com.company.entity.car;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "car_info")  // 테이블 이름 확인
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String carModel;  // 차종
    private String carNumber;  // 차량 번호
    private boolean coOwner;  // 공동 소유주 여부
    private String coOwnerName;  // 공동 소유주 이름
    private String coOwnerPhone;  // 공동 소유주 전화번호
}
