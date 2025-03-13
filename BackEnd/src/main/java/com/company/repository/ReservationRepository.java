package com.company.repository;

import com.company.entity.store.Reservation;
import com.company.entity.store.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByStoreId(Long storeId);
    List<Reservation> findByUserId(Long userId);
}
