package com.company.controller;

import com.company.entity.store.Reservation;
import com.company.entity.store.ReservationDTO;
import com.company.entity.store.ReservationStatus;
import com.company.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:3000")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    /**
     * Reservation 엔티티를 DTO로 변환하는 메서드
     */
    private ReservationDTO convertToDTO(Reservation reservation) {
        ReservationDTO dto = new ReservationDTO();
        dto.setId(reservation.getId());
        dto.setReservationTime(reservation.getReservationTime());
        dto.setDetails(reservation.getDetails());
        dto.setStatus(reservation.getStatus() != null ? reservation.getStatus().toString() : "PENDING");

        // Store 정보 설정 (null 방어)
        if (reservation.getStore() != null) {
            dto.setStoreId(reservation.getStore().getId());
            dto.setStoreName(reservation.getStore().getName() != null ? reservation.getStore().getName() : "알 수 없음");
            dto.setStoreAddress(reservation.getStore().getAddress() != null ? reservation.getStore().getAddress() : "주소 미등록");
        } else {
            dto.setStoreId(null);
            dto.setStoreName("미지정 정비소");
            dto.setStoreAddress("주소 미등록");
        }

        // User 정보 설정
        if (reservation.getUser() != null) {
            dto.setUserId(reservation.getUser().getId());
        } else {
            dto.setUserId(null);
        }

        return dto;
    }

    /**
     * 예약 생성
     */
    @PostMapping
    public ResponseEntity<ReservationDTO> createReservation(@RequestBody Reservation reservation) {
        Reservation saved = reservationService.createReservation(reservation);
        return ResponseEntity.ok(convertToDTO(saved));
    }

    /**
     * 특정 가게의 예약 리스트 가져오기
     */
    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<ReservationDTO>> getReservationsByStore(@PathVariable Long storeId) {
        List<Reservation> reservations = reservationService.getReservationsByStore(storeId);
        List<ReservationDTO> dtos = reservations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * 특정 사용자의 예약 리스트 가져오기
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReservationDTO>> getReservationsByUser(@PathVariable Long userId) {
        List<Reservation> reservations = reservationService.getReservationsByUser(userId);
        List<ReservationDTO> dtos = reservations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * 예약 상태 업데이트
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<ReservationDTO> updateReservationStatus(
            @PathVariable Long id,
            @RequestBody ReservationStatus status
    ) {
        Reservation updated = reservationService.updateReservationStatus(id, status);
        return updated != null
                ? ResponseEntity.ok(convertToDTO(updated))
                : ResponseEntity.notFound().build();
    }

    /**
     * 예약 취소
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelReservation(@PathVariable Long id) {
        reservationService.cancelReservation(id);
        return ResponseEntity.noContent().build();
    }
}
