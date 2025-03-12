package com.company.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponseDto {
    private String userId;
    private String name;
    private String email;
    private String phone;
    private String role;
}
