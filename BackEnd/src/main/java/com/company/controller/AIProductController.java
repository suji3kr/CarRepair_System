package com.company.controller;

import com.company.entity.ai.AIProduct;
import com.company.repository.AIProductRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class AIProductController {

    private final AIProductRepository aiProductRepository;

    public AIProductController(AIProductRepository aiProductRepository) {
        this.aiProductRepository = aiProductRepository;
    }

    @GetMapping("/cheapest")
    public List<AIProduct> getCheapestProducts() {
        return aiProductRepository.findAll()
                .stream()
                .sorted((p1, p2) -> Integer.compare(p1.getPrice(), p2.getPrice()))
                .limit(5) // 최저가 상품 5개 반환
                .toList();
    }
}
