package com.company.dto.login;

import lombok.Data;

@Data
public class GoogleTokenResponse {
    private String email; // ✅ Google에서 받은 이메일 정보
    private String name;  // ✅ Google에서 받은 이름 정보 (추가 가능)
}
