package com.company.entity.repair;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // DB 컬럼명: repair_store_id
    @Column(name = "repair_store_id", nullable = false)
    private Long repairStoreId;

    // DB 컬럼명: user_id
    @Column(name = "user_id", nullable = false)
    private String userId;

    // DB 컬럼명: car_id
    @Column(name = "car_id", nullable = false)
    private Long carId;

    // DB 컬럼명: reservation_time
    @Column(name = "reservation_time", nullable = false)
    private LocalDateTime reservationTime;

    @Column(name = "details")
    private String details;

    // DB 컬럼명: status (ENUM)
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ReservationStatus status;

    // DB 컬럼명: created_at
    @Column(name = "created_at", nullable = false, updatable = false,
            insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    @PrePersist
    public void onPrePersist() {
        // 예약 생성 시 기본값을 PENDING으로
        if (status == null) {
            status = ReservationStatus.PENDING;
        }
    }
}