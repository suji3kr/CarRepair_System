package com.company.dto.login;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String userId;
    private String userRole; // 사용자 역할
    private boolean isNewUser; // 신규 사용자 여부
    private String error; // 에러 메시지 (선택적)

    // 성공 응답용 생성자
    public AuthResponse(String token, String userId, String userRole, boolean isNewUser) {
        this.token = token;
        this.userId = userId;
        this.userRole = userRole;
        this.isNewUser = isNewUser;
    }
}