package com.company.dto.login;

import lombok.Data;

@Data
public class LoginRequest {
    private String user_id;  // ID 대신 email을 사용
    private String password;
}
