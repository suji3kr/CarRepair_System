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
}
