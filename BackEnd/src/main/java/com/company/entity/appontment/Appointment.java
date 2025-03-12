package com.company.entity.appontment;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 예약한 사용자 ID
    @Column(nullable = false)
    private String userId;

    // 예약 서비스 유형 (예: 정비, 출장 정비 등)
    @Column(nullable = false)
    private String serviceType;

    // 예약 예정 날짜 및 시간
    @Column(nullable = false)
    private LocalDateTime scheduledDate;

    // 예약 상태 (예: PENDING, CONFIRMED, CANCELLED)
    @Column(nullable = false)
    private String status;

    // 생성일시 (자동 기록)
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}