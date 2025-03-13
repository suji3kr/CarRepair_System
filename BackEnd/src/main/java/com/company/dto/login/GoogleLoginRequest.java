package com.company.dto.login;

import lombok.Data;

@Data
public class GoogleLoginRequest {
    private String tokenId;
    private String email; // ✅ Google에서 받은 이메일 정보
    private String name;
}
