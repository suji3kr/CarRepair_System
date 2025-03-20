package com.company.service;

import com.company.entity.repair.Reservation;
import com.company.entity.repair.ReservationStatus;
import com.company.repository.ReservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;

    public ReservationService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    @Transactional
    public Reservation createReservation(Reservation reservation) {
        if (reservation.getUserId() == null || reservation.getRepairStoreId() == null ||
                reservation.getCarId() == null || reservation.getReservationTime() == null) {
            throw new IllegalArgumentException("필수 필드가 누락되었습니다.");
        }
        return reservationRepository.save(reservation);
    }

    @Transactional(readOnly = true)
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Reservation> getReservationsByUserId(String userId) {
        return reservationRepository.findByUserId(userId);
    }

    @Transactional
    public void updateReservationStatus(Long id, ReservationStatus updatedStatus) {
        // 예약 ID로 예약 조회 (없으면 예외 발생)
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 예약이 존재하지 않습니다: " + id));

        // 상태 업데이트 (JPA의 더티 체킹 적용)
        reservation.setStatus(updatedStatus);
    }
}
