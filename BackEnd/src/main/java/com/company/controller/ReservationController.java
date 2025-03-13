package com.company.controller;

import com.company.entity.store.Reservation;
import com.company.entity.store.ReservationStatus;
import com.company.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:3000")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    // 예약 생성
    @PostMapping
    public ResponseEntity<Reservation> createReservation(@RequestBody Reservation reservation) {
        return ResponseEntity.ok(reservationService.createReservation(reservation));
    }

    // 특정 가게의 예약 리스트 가져오기
    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<Reservation>> getReservationsByStore(@PathVariable Long storeId) {
        return ResponseEntity.ok(reservationService.getReservationsByStore(storeId));
    }

    // 특정 사용자 예약 리스트 가져오기
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Reservation>> getReservationsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reservationService.getReservationsByUser(userId));
    }

    // 예약 상태 업데이트
    @PutMapping("/{id}/status")
    public ResponseEntity<Reservation> updateReservationStatus(@PathVariable Long id, @RequestBody ReservationStatus status) {
        Reservation updatedReservation = reservationService.updateReservationStatus(id, status);
        return updatedReservation != null ? ResponseEntity.ok(updatedReservation) : ResponseEntity.notFound().build();
    }

    // 예약 취소
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelReservation(@PathVariable Long id) {
        reservationService.cancelReservation(id);
        return ResponseEntity.noContent().build();
    }
}
