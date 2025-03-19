package com.company.entity.repair;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReservationRequest {
    private String userId;
    private String appointmentDate;
    private String carMake;
    private String carModel;
    private String carId;  // 추가: 프론트엔드에서 보내는 carId
    private String content;
    private String inquiryType;
    private String repairStoreId;
    private String repairStoreName;
}