package com.company.dto;

import lombok.Data;

@Data
public class UserSignupRequest {
    private String userId; // 아이디 (이메일 등으로 활용할 수 있음)
    private String password;
    private String name;
    private String email;
    private String telecom; // 통신사 (예: SKT, KT, LG 등)
    private String phone;

    private String carModel; // 차종
    private String carNumber; // 차량 번호
    private boolean coOwner; // 공동 소유주 여부
    private String coOwnerName; // 공동 소유주 이름
    private String coOwnerPhone; // 공동 소유주 전화번호

    private boolean termsAgreed; // 약관 동의 여부
}
