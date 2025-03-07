package com.company.dto;

import lombok.Data;

@Data
public class UserSignupRequest {
    private String user_id;
    private String password;
    private String name;
    private String email;
    private String phone;

    private boolean coOwner;
    private String coOwner_name;
    private String coOwner_phone;

    private String carMake;  // 🚗 제조사 (예: 현대, 기아, BMW 등)
    private String carModel; // 🚗 차종 (예: 소나타, 코란도 등)
    private int year;
    private String vin;      // 🚗 차량 식별번호 (VIN, Vehicle Identification Number)
    private String carNumber;// 🚗 차량 번호 (예: 12가 3456)
}
