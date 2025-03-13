package com.company.entity.store;

import com.company.entity.user.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDateTime reservationTime;
    private String details; // 예약 관련 세부사항

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status; // 예약 상태 (예: 예약완료, 취소됨, 진행중 등)

    public void setStatus(ReservationStatus status) {
        this.status = status;
    }

    // getters and setters
}