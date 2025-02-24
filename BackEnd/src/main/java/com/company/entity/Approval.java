package com.company.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "approvals")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Approval {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 관리자(Admin)와 다대일 관계 (ON DELETE SET NULL)
    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = true)
    private Admin admin;

    // 승인 대상 사용자
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "approval_type")
    private ApprovalType approvalType;

    @Enumerated(EnumType.STRING)
    private ApprovalStatus status;

    // 주문(StoreOrder)과 연관
    @ManyToOne
    @JoinColumn(name = "order_id")
    private StoreOrder order;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
