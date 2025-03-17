package com.company.entity.repair;

import com.company.entity.cars.Car;
import com.company.entity.user.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")  // 테이블명 명시
@Data
@ToString
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 정비소(RepairStore)와의 연관관계
     */
    @ManyToOne
    @JoinColumn(name = "repair_store_id", nullable = false)
    private RepairStore repairStore;

    /**
     * 사용자(User)와의 연관관계 – User 엔티티의 user_id(문자열)를 사용
     */
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", nullable = false)
    private User user;

    /**
     * 차량(Car)와의 연관관계 – 예약 시 선택한 차량 정보
     */
    @ManyToOne
    @JoinColumn(name = "car_id", nullable = false)
    private Car car;

    /**
     * 예약 시간
     */
    @Column(name = "reservation_time", nullable = false)
    private LocalDateTime reservationTime;

    /**
     * 예약에 대한 세부사항
     */
    @Column(columnDefinition = "TEXT")
    private String details;

    /**
     * 예약 상태 (PENDING, CONFIRMED, CANCELLED 등)
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status;

    /**
     * 예약 생성 시간 (자동 저장)
     */
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now(); // 엔티티 생성 시 자동 설정
}
