package com.company.entity.store;

import com.company.entity.part.Part;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "store")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Store {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 판매되는 부품과 연관 (다대일)
    @ManyToOne
    @JoinColumn(name = "part_id")
    private Part part;

    // 추가: 가게 이름과 주소
    private String name;
    private String address;

    private double price;
    private int stock;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
