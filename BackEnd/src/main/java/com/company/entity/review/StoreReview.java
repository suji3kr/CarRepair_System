package com.company.entity.review;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

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

    // 가게명
    @Column(name = "store_name", nullable = false)
    private String storeName;

    // 리뷰 내용
    @Column(nullable = false)
    private String content;

    // 평점 (0.5 단위까지)
    @Column(nullable = false)
    private Double rating;

    // 작성일시 (자동 기록)
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
