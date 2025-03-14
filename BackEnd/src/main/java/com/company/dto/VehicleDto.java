package com.company.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VehicleDto {
    private String owner_id;
    private String car_id;
    private String carMake;
    private String carModel;
    private int year;
    private String vin;
    private String carNumber;
    private boolean coOwner; // ✅ 공동 소유 여부
    private String coOwnerName; // ✅ 공동 소유주 이름
    private String coOwnerPhone; // ✅ 공동 소유주 연락처
}
