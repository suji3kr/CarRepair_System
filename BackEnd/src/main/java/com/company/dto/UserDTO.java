package com.company.dto;

import com.company.entity.user.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {
    private Long id;
    private String userId;
    private String name;
    private String email;
    private String phone;
    private String role;

    // ✅ User 엔티티를 받아서 DTO 생성
    public UserDTO(User user) {
        this.id = user.getId();
        this.userId = user.getUserId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.phone = user.getPhone();
        this.role = user.getUserRole();
    }
}
