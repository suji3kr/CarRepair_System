// src/main/java/com/company/repository/StoreReviewRepository.java
package com.company.repository;

import com.company.entity.review.StoreReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StoreReviewRepository extends JpaRepository<StoreReview, Long> {

    // 가게 이름별 리뷰 조회
    List<StoreReview> findByStoreName(String storeName);

    // 가게별 평균 평점 조회: 결과로 Object 배열 [storeName, 평균 평점] 반환
    @Query("SELECT sr.storeName, AVG(sr.rating) FROM StoreReview sr GROUP BY sr.storeName")
    List<Object[]> findAverageRatingByStoreName();
}
