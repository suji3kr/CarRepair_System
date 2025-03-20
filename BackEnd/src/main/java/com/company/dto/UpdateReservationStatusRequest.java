package com.company.dto;

import com.company.entity.repair.ReservationStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateReservationStatusRequest {
    private String status;

    public void setStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("❌ 상태 값은 비워둘 수 없습니다.");
        }
        this.status = status.trim().toUpperCase();
    }

    public ReservationStatus toReservationStatus() {
        try {
            return ReservationStatus.valueOf(this.status);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("❌ 상태 값은 'PENDING', 'CONFIRMED', 'CANCELLED' 중 하나여야 합니다.");
        }
    }
}
