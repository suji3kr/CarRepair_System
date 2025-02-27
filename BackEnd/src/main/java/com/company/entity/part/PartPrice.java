package com.company.entity.part;

import com.company.entity.store.Store;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "part_prices")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PartPrice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 부품과 다대일 관계
    @ManyToOne
    @JoinColumn(name = "part_id")
    private Part part;

    // 판매점과 다대일 관계
    @ManyToOne
    @JoinColumn(name = "store_id")
    private Store store;

    private double price;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
