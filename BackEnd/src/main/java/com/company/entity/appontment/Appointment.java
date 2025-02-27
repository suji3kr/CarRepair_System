package com.company.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 예약한 사용자와 다대일 관계
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // 예약 대상 차량과 다대일 관계
    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @Column(name = "service_type")
    private String serviceType;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    // 예약 일시 (TIMESTAMP)
    private LocalDateTime scheduledDate;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
