package com.company.service;

import com.company.entity.repair.Reservation;
import com.company.entity.repair.ReservationStatus;
import com.company.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;

    public ReservationService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    // 예약 생성
    public Reservation createReservation(Reservation reservation) {
        // 기본 상태를 설정 (예약 생성 시 전달되지 않았다면)
        if (reservation.getStatus() == null) {
            reservation.setStatus(ReservationStatus.PENDING);
        }
        return reservationRepository.save(reservation);
    }

    // 전체 예약 목록 조회
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    // 특정 사용자(userId)의 예약 목록 조회
    public List<Reservation> getReservationsByUserId(String userId) {
        return reservationRepository.findByUserId(userId);
    }
}
