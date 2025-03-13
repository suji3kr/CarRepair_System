package com.company.service;

import com.company.entity.review.StoreReview;
import com.company.repository.StoreReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StoreReviewService {

    @Autowired
    private StoreReviewRepository storeReviewRepository;

    // 리뷰 저장
    public StoreReview saveReview(StoreReview review) {
        return storeReviewRepository.save(review);
    }

    // 모든 리뷰 조회
    public List<StoreReview> getAllReviews() {
        return storeReviewRepository.findAll();
    }

    // 특정 리뷰 조회
    public Optional<StoreReview> getReviewById(Long id) {
        return storeReviewRepository.findById(id);
    }

    // 리뷰 수정
    public StoreReview updateReview(Long id, StoreReview review) {
        if (storeReviewRepository.existsById(id)) {
            review.setId(id);
            return storeReviewRepository.save(review);
        }
        return null;
    }

    // 리뷰 삭제
    public void deleteReview(Long id) {
        storeReviewRepository.deleteById(id);
    }

    // 가게별 평균 평점 계산
    public double getAverageRatingForStore(String storeName) {
        List<StoreReview> reviews = storeReviewRepository.findByStoreName(storeName);
        if (reviews.isEmpty()) {
            return 0;
        }

        double totalRating = 0;
        for (StoreReview review : reviews) {
            totalRating += review.getRating();
        }

        return totalRating / reviews.size(); // 평균 계산
    }
}
