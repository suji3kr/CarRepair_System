package com.company.entity.user;

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

    private String name;

    @Column(unique = true)
    private String email;

    private String password; // Google 로그인 사용자는 null 가능

    private String phone;

    @Enumerated(EnumType.STRING)
    private Role role;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
