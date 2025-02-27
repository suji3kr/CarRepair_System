package com.company.entity.payment;

import com.company.entity.PaymentMethod;
import com.company.entity.PaymentStatus;
import com.company.entity.order.StoreOrder;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 결제와 연계되는 주문(StoreOrder) - StoreOrder 엔티티가 이미 존재한다고 가정
    @OneToOne
    @JoinColumn(name = "order_id", nullable = false)
    private StoreOrder order;

    // 결제 금액
    @Column(nullable = false)
    private BigDecimal amount;

    // 결제 수단
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod paymentMethod;

    // 결제 상태
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus paymentStatus;

    // 결제 생성 일시
    @CreationTimestamp
    @Column(name = "payment_date")
    private LocalDateTime paymentDate;
}
