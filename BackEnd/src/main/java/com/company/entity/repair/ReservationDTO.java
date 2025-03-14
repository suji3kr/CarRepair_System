package com.company.entity.repair;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
public class ReservationDTO {
    private Long id;
    private Long repairStoreId;
    private String repairStoreLocation;
    private String userId; // 문자열로 저장된 사용자 ID (예: "alice123")

    // 새로 추가된 차량 정보
    private Long carId;
    private String carModel;
    private String carMake;

    private LocalDateTime reservationTime;
    private String details;
    private String status;

    // 기본 생성자
    public ReservationDTO() {}

}
