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

    public Reservation createReservation(Reservation reservation) {
        // 예약 생성 시 기본 상태가 null이면 PENDING으로 설정
        if (reservation.getStatus() == null) {
            reservation.setStatus(ReservationStatus.PENDING);
        }
        return reservationRepository.save(reservation);
    }

    public List<Reservation> getReservationsByUser(String userId) {
        return reservationRepository.findByUser_UserId(userId);
    }

    public List<Reservation> getReservationsByStore(Long storeId) {
        return reservationRepository.findByRepairStore_Id(storeId);
    }

    public Optional<Reservation> getReservationById(Long id) {
        return reservationRepository.findById(id);
    }

    public Reservation updateReservationStatus(Long id, ReservationStatus status) {
        Optional<Reservation> opt = reservationRepository.findById(id);
        if (opt.isPresent()) {
            Reservation reservation = opt.get();
            reservation.setStatus(status);
            return reservationRepository.save(reservation);
        }
        return null;
    }

    public void cancelReservation(Long id) {
        updateReservationStatus(id, ReservationStatus.CANCELLED);
    }
}
