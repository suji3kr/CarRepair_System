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
        reservation.setStatus(ReservationStatus.PENDING); // 예약 상태를 '대기중'으로 설정
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
        Optional<Reservation> reservation = reservationRepository.findById(id);
        if (reservation.isPresent()) {
            reservation.get().setStatus(status);
            return reservationRepository.save(reservation.get());
        }
        return null;
    }

    public void cancelReservation(Long id) {
        Optional<Reservation> reservation = reservationRepository.findById(id);
        if (reservation.isPresent()) {
            reservation.get().setStatus(ReservationStatus.CANCELLED);
            reservationRepository.save(reservation.get());
        }
    }
}
