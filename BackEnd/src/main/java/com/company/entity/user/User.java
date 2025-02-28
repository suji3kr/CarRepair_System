package com.company.entity.user;

import com.company.entity.car.CarInfo;
import com.company.entity.role.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId; // 사용자 아이디 (email, username 등)
    private String name;
    private String email;
    private String password;
    private String phone;
    private String telecom; // 통신사

    @Enumerated(EnumType.STRING)
    private Role role;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // 🚗 차량 정보
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "car_info_id")
    private CarInfo carInfo;
}
