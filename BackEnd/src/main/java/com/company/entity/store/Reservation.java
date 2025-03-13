package com.company.entity.store;

import com.company.entity.user.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 가게(Store)와의 연관관계
     * store_id 컬럼을 통해 Store 테이블과 조인
     */
    @ManyToOne
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    /**
     * 사용자(User)와의 연관관계
     * user_id 컬럼을 통해 User 테이블과 조인
     */
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * 예약 시간
     */
    private LocalDateTime reservationTime;

    /**
     * 예약에 대한 세부사항
     */
    private String details;

    /**
     * 예약 상태 (PENDING, CONFIRMED, CANCELLED 등)
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status;

    // -------------------------------------------
    //                Getter/Setter
    // -------------------------------------------

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Store getStore() {
        return store;
    }

    public void setStore(Store store) {
        this.store = store;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getReservationTime() {
        return reservationTime;
    }

    public void setReservationTime(LocalDateTime reservationTime) {
        this.reservationTime = reservationTime;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public ReservationStatus getStatus() {
        return status;
    }

    public void setStatus(ReservationStatus status) {
        this.status = status;
    }
}
