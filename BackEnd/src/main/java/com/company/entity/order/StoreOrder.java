package com.company.entity.order;

import com.company.entity.part.Part;
import com.company.entity.user.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "store_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StoreOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 주문한 사용자와 다대일 관계
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // 주문한 부품과 다대일 관계
    @ManyToOne
    @JoinColumn(name = "part_id")
    private Part part;

    private int quantity;
    private double orderPrice;
    private double totalPrice;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @CreationTimestamp
    @Column(name = "order_date")
    private LocalDateTime orderDate;
}
