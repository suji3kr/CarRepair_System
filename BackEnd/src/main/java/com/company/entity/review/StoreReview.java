// src/main/java/com/company/entity/review/StoreReview.java
package com.company.entity.review;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "store_reviews")
public class StoreReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 가게 이름
    @Column(name = "store_name", nullable = false)
    private String storeName;

    // 리뷰 내용
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    // 평점 (소수점 한자리, 0.0 ~ 5.0)
    @Column(nullable = false, precision = 3, scale = 1)
    private BigDecimal rating;

    // 작성일시
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
