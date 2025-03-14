package com.company.dto;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UserUpdateRequest {
    private String name;
    @Email(message = "유효한 이메일 형식이어야 합니다.")
    private String email;
    private String phone;
}