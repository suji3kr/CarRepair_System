package com.company.service;

import com.company.entity.store.Reservation;
import com.company.entity.store.ReservationStatus;
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
        // 예: 예약 생성 시 기본 상태를 PENDING 으로 설정
        reservation.setStatus(ReservationStatus.PENDING);
        return reservationRepository.save(reservation);
    }

    public List<Reservation> getReservationsByStore(Long storeId) {
        return reservationRepository.findByStoreId(storeId);
    }

    public List<Reservation> getReservationsByUser(Long userId) {
        return reservationRepository.findByUserId(userId);
    }

    public Optional<Reservation> getReservationById(Long id) {
        return reservationRepository.findById(id);
    }

    public Reservation updateReservationStatus(Long id, ReservationStatus status) {
        Optional<Reservation> optReservation = reservationRepository.findById(id);
        if (optReservation.isPresent()) {
            Reservation reservation = optReservation.get();
            reservation.setStatus(status);
            return reservationRepository.save(reservation);
        }
        return null;
    }

    public void cancelReservation(Long id) {
        Optional<Reservation> optReservation = reservationRepository.findById(id);
        if (optReservation.isPresent()) {
            Reservation reservation = optReservation.get();
            reservation.setStatus(ReservationStatus.CANCELLED);
            reservationRepository.save(reservation);
        }
    }
}
