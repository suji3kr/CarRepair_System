package com.company.entity.review;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "contact_messages")
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 문의자 이름
    @Column(nullable = false)
    private String name;

    // 차량 종류 (옵션)
    @Column(name = "car_type")
    private String carType;

    // 모델명
    @Column(nullable = false)
    private String model;

    // 이메일 주소
    @Column(nullable = false)
    private String email;

    // 전화번호
    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    // 문의 내용
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    // 추가 기재사항 (옵션)
    @Column(name = "additional_notes", columnDefinition = "TEXT")
    private String additionalNotes;

    // 작성일시 (자동 기록)
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
