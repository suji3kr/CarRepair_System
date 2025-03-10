package com.company.entity.part;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "parts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Part {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    private double price;
    private int stock;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    private String imageUrl;  // 부품 이미지 URL (선택적 필드 추가)
}
