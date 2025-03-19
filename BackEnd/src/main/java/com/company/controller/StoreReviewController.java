package com.company.controller;

import com.company.entity.review.StoreReview;
import com.company.service.StoreReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/storereviews")
@CrossOrigin(origins = "http://garagez.s3-website.ap-northeast-2.amazonaws.com/")
public class StoreReviewController {

    @Autowired
    private StoreReviewService storeReviewService;

    // 리뷰 등록
    @PostMapping
    public ResponseEntity<StoreReview> createReview(@RequestBody StoreReview review) {
        return ResponseEntity.ok(storeReviewService.saveReview(review));
    }

    // 모든 리뷰 조회
    @GetMapping
    public ResponseEntity<List<StoreReview>> getAllReviews() {
        List<StoreReview> reviews = storeReviewService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }

    // 특정 리뷰 조회
    @GetMapping("/{id}")
    public ResponseEntity<StoreReview> getReviewById(@PathVariable Long id) {
        return storeReviewService.getReviewById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 리뷰 수정
    @PutMapping("/{id}")
    public ResponseEntity<StoreReview> updateReview(@PathVariable Long id, @RequestBody StoreReview review) {
        StoreReview updated = storeReviewService.updateReview(id, review);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    // 리뷰 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        storeReviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }

    // 가게별 평균 평점 조회
    @GetMapping("/average/{storeName}")
    public ResponseEntity<Double> getAverageRating(@PathVariable String storeName) {
        double averageRating = storeReviewService.getAverageRatingForStore(storeName);
        return ResponseEntity.ok(averageRating);
    }
}
