package com.company.dto;

import com.company.entity.vehicle.Vehicle;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class UserResponseDto {
    private String userId;
    private String name;
    private String email;
    private String phone;
    private String role;
//    private List<Vehicle> vehicles; // ✅ 차량 정보 추가
}
