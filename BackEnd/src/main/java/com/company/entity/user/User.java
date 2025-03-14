package com.company.entity.user;

import com.company.entity.role.Role;
import com.company.entity.vehicle.Vehicle;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Slf4j
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private String userId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = true) // Google 계정 지원
    private String password;

    @Column(nullable = true)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "terms_agreed", nullable = false)
    private boolean termsAgreed = false;

    // 차량 관계 추가
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Vehicle> vehicles = new ArrayList<>();

    public String getUserRole() {
        return (role != null) ? role.name() : "USER";
    }

    public void setUserRole(String userRole) {
        try {
            this.role = Role.valueOf(userRole.toUpperCase());
        } catch (IllegalArgumentException e) {
            this.role = Role.USER;
            log.warn("잘못된 역할 값: {}, 기본값 USER로 설정", userRole);
        }
    }
}