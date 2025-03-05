package com.company.entity.car;

import com.company.entity.vehicle.Vehicle;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
public class CarInfo extends Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String carModel;  // 차종
    private String carNumber;  // 차량 번호
    private boolean coOwner;  // 공동 소유주 여부
    private String coOwnerName;  // 공동 소유주 이름
    private String coOwnerPhone;  // 공동 소유주 전화번호
}
