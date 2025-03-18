package com.company.entity.repair;

import lombok.Data;


import java.time.LocalDateTime;

@Data
public class ReservationDTO {
    private Long id;
    private Long repairStoreId;
    private String repairStoreName;
    private String repairStoreLocation;
    private String userId; // User 엔티티의 user_id (문자열)
    private Long carId;
    private String carMake;
    private String carModel;
    private LocalDateTime reservationTime;
    private String details;
    private String status;

    // 기본 생성자, Getters 및 Setters
    public ReservationDTO() {}

}
