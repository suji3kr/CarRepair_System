package com.company.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "maintenance_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 정비된 차량과 다대일 관계 (Vehicle 엔티티의 maintenanceRecords와 연관)
    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    // 정비 요청 사용자 (User 엔티티와 다대일 관계; User 엔티티는 별도로 구현)
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // (필요 시 정비 예약(Appointment)와의 관계도 추가)
    @ManyToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    @Column(name = "service_type")
    private String serviceType;

    @Lob
    private String description;

    @Column(name = "service_date")
    private LocalDate serviceDate;

    private double cost;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
