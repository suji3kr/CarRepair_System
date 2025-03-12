package com.company.dto.login;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String userId;
    private boolean isNewUser; // ✅ 추가 정보 필요 여부
}
