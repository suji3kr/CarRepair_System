package com.company.controller;

import com.company.entity.repair.Reservation;
import com.company.entity.repair.ReservationRequest;
import com.company.service.ReservationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://garagez.s3-website.ap-northeast-2.amazonaws.com/")
public class ReservationController {

    private static final Logger log = LoggerFactory.getLogger(ReservationController.class);
    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping
    public Reservation createReservation(@RequestBody ReservationRequest request) {
        log.info("Received reservation request: {}", request);

        Reservation reservation = new Reservation();
        reservation.setUserId(request.getUserId());
        try {
            reservation.setRepairStoreId(Long.parseLong(request.getRepairStoreId()));
            reservation.setCarId(Long.parseLong(request.getCarId()));
        } catch (NumberFormatException e) {
            log.error("Invalid number format for repairStoreId or carId", e);
            throw new IllegalArgumentException("repairStoreId 또는 carId 형식이 잘못되었습니다.", e);
        }
        reservation.setDetails(request.getContent());

        // appointmentDate를 LocalDateTime으로 변환
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate date = LocalDate.parse(request.getAppointmentDate(), formatter);
            LocalDateTime reservationTime = date.atTime(10, 0); // 시간은 10:00으로 고정
            reservation.setReservationTime(reservationTime);
        } catch (Exception e) {
            log.error("Failed to parse appointmentDate: {}", request.getAppointmentDate(), e);
            throw new IllegalArgumentException("appointmentDate 형식이 잘못되었습니다. (예: 2025-03-26)", e);
        }

        Reservation saved = reservationService.createReservation(reservation);
        log.info("Saved reservation: {}", saved);
        return saved;
    }

    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationService.getAllReservations();
    }

    @GetMapping("/user/{userId}")
    public List<Reservation> getReservationsByUserId(@PathVariable String userId) {
        log.info("Fetching reservations for userId: {}", userId);
        List<Reservation> reservations = reservationService.getReservationsByUserId(userId);
        log.info("Found {} reservations for userId: {}", reservations.size(), userId);
        return reservations;
    }
}