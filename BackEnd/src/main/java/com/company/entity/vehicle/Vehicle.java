package com.company.entity.vehicle;

import com.company.entity.maintenance.MaintenanceRecord;
import com.company.entity.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 차량 소유자 (User 엔티티와 다대일 관계; User 엔티티는 별도로 구현되어 있다고 가정)
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    private String make;
    private String model;
    private int year;

    @Column(unique = true)
    private String vin;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // 해당 차량에 대한 정비 기록 (양방향 연관관계)
    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MaintenanceRecord> maintenanceRecords;
}
