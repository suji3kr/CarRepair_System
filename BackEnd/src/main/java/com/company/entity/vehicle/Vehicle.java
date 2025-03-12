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
@Inheritance
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 차량 소유자 (User 엔티티와 다대일 관계; User 엔티티는 별도로 구현되어 있다고 가정)
    @ManyToOne
    @JoinColumn(name = "owner_id")
    @JsonIgnore
    private User owner;

    private String make;
    private String model;
    private int year;

    @Column(unique = true)
    private String vin;

    private String carNumber;

    @CreationTimestamp
    private LocalDateTime createdAt;

    // 해당 차량에 대한 정비 기록 (양방향 연관관계)
    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MaintenanceRecord> maintenanceRecords;

    // 공동 소유자 정보 (차량에 관련된 필드 추가)
    private boolean coOwner = false;
    private String coOwnerName;  // 공동 소유자 이름
    private String coOwnerPhone; // 공동 소유자 전화번호

    // 차량과 관련된 추가 메소드들을 정의할 수 있음
    public void setVehicle(Vehicle vehicle) {
        // 필요한 로직 추가
    }
}

