package com.company.dto.login;

import lombok.Data;

@Data
public class JwtResponse {
    private String token;
    private Long userId;   // 사용자 ID 추가
    private boolean newUser; // 새 유저 여부 추가

    // Constructor, Getter, Setter
}
