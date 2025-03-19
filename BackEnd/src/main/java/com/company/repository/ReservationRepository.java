package com.company.repository;

import com.company.entity.repair.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // 특정 사용자(userId)의 예약 목록 조회
    List<Reservation> findByUserId(String userId);
}
