package com.company.controller;

import com.company.entity.repair.Reservation;
import com.company.entity.repair.ReservationDTO;
import com.company.entity.repair.ReservationStatus;
import com.company.service.ReservationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:3000")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    /**
     * Reservation 엔티티를 ReservationDTO로 변환하는 메서드
     */
    private ReservationDTO convertToDTO(Reservation reservation) {
        ReservationDTO dto = new ReservationDTO();
        dto.setId(reservation.getId());
        dto.setReservationTime(reservation.getReservationTime());
        dto.setDetails(reservation.getDetails());
        dto.setStatus(reservation.getStatus() != null ? reservation.getStatus().toString() : "PENDING");

        // 정비소 정보 설정
        if (reservation.getRepairStore() != null) {
            dto.setRepairStoreId(reservation.getRepairStore().getId());
            dto.setRepairStoreLocation(reservation.getRepairStore().getLocation());
        } else {
            dto.setRepairStoreId(null);
            dto.setRepairStoreLocation("주소 미등록");
        }

        // 사용자 정보 설정: User 엔티티의 userId (문자열) 사용
        if (reservation.getUser() != null) {
            dto.setUserId(reservation.getUser().getUserId());
        } else {
            dto.setUserId(null);
        }

        // 차량 정보 설정 (Reservation 엔티티에 새로 추가된 차량 연관관계)
        if (reservation.getCar() != null) {
            dto.setCarId(reservation.getCar().getId());
            dto.setCarModel(reservation.getCar().getCarModel());
            dto.setCarMake(reservation.getCar().getCarMake());
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
        log.info("예약 생성 요청: {}", reservation.toString());
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
     * userId는 문자열 (예: "alice123")
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
     * 예약 상태 업데이트
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<ReservationDTO> updateReservationStatus(
            @PathVariable Long id,
            @RequestBody ReservationStatus status
    ) {
        Reservation updated = reservationService.updateReservationStatus(id, status);
        return updated != null ? ResponseEntity.ok(convertToDTO(updated)) : ResponseEntity.notFound().build();
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
