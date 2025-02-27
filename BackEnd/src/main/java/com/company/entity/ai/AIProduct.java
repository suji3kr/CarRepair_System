package com.company.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ai")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AIProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int price;
    private String imageUrl;  // 상품 이미지 URL 추가
    private String link;  // 상품 상세 링크 추가
}
