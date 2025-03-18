package com.company.entity.repair;

import com.company.entity.user.User;
import com.company.entity.cars.Car;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "reservations")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 정비소 정보
    @ManyToOne
    @JoinColumn(name = "repair_store_id", nullable = false)
    private RepairStore repairStore;

    // 사용자 정보 (User 엔티티의 user_id(문자열)을 참조)
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", nullable = false)
    private User user;

    // 차량 정보 (Car 테이블 참조)
    @ManyToOne
    @JoinColumn(name = "car_id", nullable = false)
    private Car car;

    @Column(name = "reservation_time", nullable = false)
    private LocalDateTime reservationTime;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

}
