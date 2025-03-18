package com.company.controller;

import com.company.entity.repair.ReservationDTO;
import com.company.entity.repair.Reservation;
import com.company.entity.repair.ReservationStatus;
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
     * Reservation 엔티티를 ReservationDTO로 변환
     */
    private ReservationDTO convertToDTO(Reservation reservation) {
        ReservationDTO dto = new ReservationDTO();
        dto.setId(reservation.getId());
        dto.setReservationTime(reservation.getReservationTime());
        dto.setDetails(reservation.getDetails());
        dto.setStatus(reservation.getStatus() != null
                ? reservation.getStatus().toString()
                : "PENDING");

        if (reservation.getRepairStore() != null) {
            dto.setRepairStoreId(reservation.getRepairStore().getId());
            // ★ 여기가 문제였음: repairStore 엔티티에 getName()이 없으면 오류
            dto.setRepairStoreName(reservation.getRepairStore().getName());
            dto.setRepairStoreLocation(reservation.getRepairStore().getLocation());
        } else {
            dto.setRepairStoreId(null);
            dto.setRepairStoreName("미지정 정비소");
            dto.setRepairStoreLocation("주소 미등록");
        }

        if (reservation.getUser() != null) {
            dto.setUserId(reservation.getUser().getUserId());
        } else {
            dto.setUserId(null);
        }

        if (reservation.getCar() != null) {
            dto.setCarId(reservation.getCar().getId());
            dto.setCarMake(reservation.getCar().getCarMake());
            dto.setCarModel(reservation.getCar().getCarModel());
        } else {
            dto.setCarId(null);
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
     * 특정 사용자의 예약 목록 조회 (userId는 문자열)
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReservationDTO>> getReservationsByUser(@PathVariable String userId) {
        List<Reservation> reservations = reservationService.getReservationsByUser(userId);
        List<ReservationDTO> dtos = reservations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * 특정 가게의 예약 목록 조회
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
     * 예약 상태 업데이트
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<ReservationDTO> updateReservationStatus(
            @PathVariable Long id,
            @RequestBody ReservationStatus status
    ) {
        Reservation updated = reservationService.updateReservationStatus(id, status);
        if (updated != null) {
            return ResponseEntity.ok(convertToDTO(updated));
        } else {
            return ResponseEntity.notFound().build();
        }
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
