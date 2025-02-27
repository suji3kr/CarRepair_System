package com.company.service;

import com.company.entity.review.Review;
import com.company.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    // 전체 리뷰 조회
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    // ID로 리뷰 조회
    public Optional<Review> getReviewById(Long id) {
        return reviewRepository.findById(id);
    }

    // 새 리뷰 생성
    public Review createReview(Review review) {
        return reviewRepository.save(review);
    }

    // 리뷰 업데이트 (리뷰 내용만 업데이트하는 예제)
    public Review updateReview(Long id, Review updatedReview) {
        return reviewRepository.findById(id).map(review -> {
            review.setContent(updatedReview.getContent());
            // 필요하다면 다른 필드도 업데이트
            return reviewRepository.save(review);
        }).orElse(null);
    }

    // 리뷰 삭제
    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }
}
