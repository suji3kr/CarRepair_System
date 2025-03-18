package com.company.entity.repair;

import com.company.entity.appontment.Appointment;
import com.company.entity.store.Store;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "repair_store")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RepairStore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ★ 추가: 정비소(RepairStore)의 이름을 저장할 필드
    @Column(name = "name") // DB 테이블의 컬럼명이 name이라면
    private String name;

    // 판매점(Store)과 연관 – ON DELETE SET NULL 이므로 nullable 처리
    @ManyToOne
    @JoinColumn(name = "store_id", nullable = true)
    private Store store;

    // 정비 예약(Appointment)과 연관
    @ManyToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    private String location;

    @Column(name = "contact_info")
    private String contactInfo;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Lombok @Data로 인해 게터/세터 자동 생성
    // 만약 Lombok을 쓰지 않는다면 아래와 같은 메서드 필요:
    // public String getName() { return name; }
    // public void setName(String name) { this.name = name; }
}
