package com.company.service;

import com.company.entity.repair.Reservation;
import com.company.entity.repair.ReservationStatus;
import com.company.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    /**
     * 예약 생성 시 기본 상태를 PENDING으로 설정하고 저장합니다.
     */
    public Reservation createReservation(Reservation reservation) {
        reservation.setStatus(ReservationStatus.PENDING);
        return reservationRepository.save(reservation);
    }

    /**
     * 특정 정비소(RepairStore)의 예약 목록을 조회합니다.
     * Repository 메서드 이름은 Reservation 엔티티의 repairStore 필드와 일치해야 합니다.
     */
    public List<Reservation> getReservationsByStore(Long storeId) {
        return reservationRepository.findByRepairStoreId(storeId);
    }

    /**
     * 특정 사용자의 예약 목록을 조회합니다.
     * User 엔티티의 userId(문자열)를 기준으로 조회합니다.
     */
    public List<Reservation> getReservationsByUser(String userId) {
        return reservationRepository.findByUserUserId(userId);
    }

    /**
     * 예약 ID로 단일 예약을 조회합니다.
     */
    public Optional<Reservation> getReservationById(Long id) {
        return reservationRepository.findById(id);
    }

    /**
     * 예약 상태를 업데이트합니다.
     */
    public Reservation updateReservationStatus(Long id, ReservationStatus status) {
        Optional<Reservation> optReservation = reservationRepository.findById(id);
        if (optReservation.isPresent()) {
            Reservation reservation = optReservation.get();
            reservation.setStatus(status);
            return reservationRepository.save(reservation);
        }
        return null;
    }

    /**
     * 예약을 취소합니다. (상태를 CANCELLED로 업데이트)
     */
    public void cancelReservation(Long id) {
        Optional<Reservation> optReservation = reservationRepository.findById(id);
        if (optReservation.isPresent()) {
            Reservation reservation = optReservation.get();
            reservation.setStatus(ReservationStatus.CANCELLED);
            reservationRepository.save(reservation);
        }
    }
}
