package com.company.entity.vehicle;

import com.company.entity.maintenance.MaintenanceRecord;
import com.company.entity.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
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

    // 차량 소유자: users 테이블의 id를 참조 (ON DELETE CASCADE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    @JsonIgnore
    private User owner;

    // car_id: car 테이블과의 외래키 (ON DELETE SET NULL)
    @Column(name = "car_id")
    private Long carId;

    @Column(name = "car_make", nullable = false, length = 100)
    private String carMake;

    @Column(name = "car_model", nullable = false, length = 100)
    private String carModel;

    @Column(name = "year", nullable = false)
    private int year;

    @Column(name = "vin", nullable = false, unique = true, length = 50)
    private String vin;

    @Column(name = "car_number", nullable = false, unique = true, length = 20)
    private String carNumber;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 차량에 대한 정비 기록 (양방향 연관관계)
    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<MaintenanceRecord> maintenanceRecords;

    // 공동 소유자 관련 정보
    @Column(name = "co_owner", nullable = false)
    private boolean coOwner = false;

    @Column(name = "co_owner_name", length = 100)
    private String coOwnerName;

    @Column(name = "co_owner_phone", length = 20)
    private String coOwnerPhone;
}
