// src/main/java/com/company/controller/StoreReviewController.java
package com.company.controller;

import com.company.entity.review.StoreReview;
import com.company.service.StoreReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/storereviews")
@CrossOrigin(origins = "http://localhost:3000")
public class StoreReviewController {

    @Autowired
    private StoreReviewService storeReviewService;

    @PostMapping
    public ResponseEntity<StoreReview> createReview(@RequestBody StoreReview review) {
        return ResponseEntity.ok(storeReviewService.saveReview(review));
    }

    @GetMapping
    public ResponseEntity<List<StoreReview>> getAllReviews() {
        List<StoreReview> reviews = storeReviewService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StoreReview> getReviewById(@PathVariable Long id) {
        return storeReviewService.getReviewById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/store/{storeName}")
    public ResponseEntity<List<StoreReview>> getReviewsByStoreName(@PathVariable String storeName) {
        List<StoreReview> storeReviews = storeReviewService.getReviewsByStoreName(storeName);
        if (storeReviews.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(storeReviews);
    }

    // 가게별 평균 평점 조회
    @GetMapping("/average")
    public ResponseEntity<Map<String, BigDecimal>> getAverageRatings() {
        Map<String, BigDecimal> averageRatings = storeReviewService.getAverageRatingByStore();
        return ResponseEntity.ok(averageRatings);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StoreReview> updateReview(@PathVariable Long id, @RequestBody StoreReview review) {
        StoreReview updated = storeReviewService.updateReview(id, review);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        storeReviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}
