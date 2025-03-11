package com.company.entity.user;

import com.company.entity.role.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users") // 🚀 DB 테이블 "users"와 연결
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id") // 🚀 id 컬럼을 명확하게 지정
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true) // 🚀 user_id 컬럼 매핑
    private String userId;

    @Column(nullable = false) // 🚀 name은 필수값
    private String name;

    @Column(nullable = false, unique = true) // 🚀 email은 필수값 + 유니크
    private String email;

    @Column(nullable = false) // 🚀 password는 필수값
    private String password;

    @Column(nullable = true) // 🚀 전화번호는 필수값 아님
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false) // 🚀 role 필수값
    private Role role;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false) // 🚀 자동 생성 + 수정 불가
    private LocalDateTime createdAt;

    // 공동 소유자 관련 정보
    @Column(nullable = false)
    private boolean coOwner = false;

    @Column(name = "co_owner_name", nullable = true)
    private String coOwnerName;

    @Column(name = "co_owner_phone", nullable = true)
    private String coOwnerPhone;

    // 약관 동의 여부
    @Column(name = "terms_agreed", nullable = false)
    private boolean termsAgreed = false;
}
