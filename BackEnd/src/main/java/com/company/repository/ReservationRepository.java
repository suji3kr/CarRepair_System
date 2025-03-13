package com.company.repository;

import com.company.entity.repair.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // User 엔티티의 userId 필드를 기준으로 조회
    List<Reservation> findByUserUserId(String userId);
    List<Reservation> findByRepairStoreId(Long repairStoreId);
}
