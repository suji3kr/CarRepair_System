// src/main/java/com/company/service/StoreReviewService.java
package com.company.service;

import com.company.entity.review.StoreReview;
import com.company.repository.StoreReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StoreReviewService {

    @Autowired
    private StoreReviewRepository storeReviewRepository;

    public StoreReview saveReview(StoreReview review) {
        return storeReviewRepository.save(review);
    }

    public List<StoreReview> getAllReviews() {
        return storeReviewRepository.findAll();
    }

    public Optional<StoreReview> getReviewById(Long id) {
        return storeReviewRepository.findById(id);
    }

    public List<StoreReview> getReviewsByStoreName(String storeName) {
        return storeReviewRepository.findByStoreName(storeName);
    }

    public StoreReview updateReview(Long id, StoreReview updatedReview) {
        return storeReviewRepository.findById(id).map(review -> {
            review.setStoreName(updatedReview.getStoreName());
            review.setContent(updatedReview.getContent());
            review.setRating(updatedReview.getRating());
            return storeReviewRepository.save(review);
        }).orElse(null);
    }

    public void deleteReview(Long id) {
        storeReviewRepository.deleteById(id);
    }

    // 가게별 평균 평점 반환 (storeName -> 평균 평점)
    public Map<String, BigDecimal> getAverageRatingByStore() {
        List<Object[]> result = storeReviewRepository.findAverageRatingByStoreName();
        return result.stream().collect(Collectors.toMap(
                row -> (String) row[0],
                row -> BigDecimal.valueOf((Double) row[1])
        ));
    }
}
