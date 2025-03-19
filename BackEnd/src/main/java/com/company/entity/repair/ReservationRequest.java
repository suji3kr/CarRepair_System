package com.company.entity.repair;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ReservationRequest {
    private String userId;            // "aa"와 같이 문자열
    private String appointmentDate;   // "2025-03-26"
    private String carMake;           // "현대"
    private String carModel;          // "아반떼"
    private String content;           // 예약 상세 내용 (예: "ㅁㅁ")
    private String inquiryType;       // 예: "엔진오일"
    private String repairStoreId;     // 문자열 "105" (필요하면 숫자로 변환)
    private String repairStoreName;   // "용인중앙지점"

    // getters and setters...
}