package com.company.dto;

import lombok.Data;

@Data
public class UserSignupRequest {
    private String userId;
    private String password;
    private String name;
    private String email;
    private String phone;

    private boolean coOwner;
    private String coOwnerName;  // ✅ 네이밍 수정 (coOwner_name → coOwnerName)
    private String coOwnerPhone; // ✅ 네이밍 수정 (coOwner_phone → coOwnerPhone)
    private boolean termsAgreed;

    private String carId;
    private String carMake;  // 🚗 제조사 (예: 현대, 기아, BMW 등)
    private String carModel; // 🚗 차종 (예: 소나타, 코란도 등)
    private Integer year;    // ✅ 타입 변경 (String → Integer)
    private String vin;      // 🚗 차량 식별번호 (VIN, Vehicle Identification Number)
    private String carNumber;// 🚗 차량 번호 (예: 12가 3456)
}
