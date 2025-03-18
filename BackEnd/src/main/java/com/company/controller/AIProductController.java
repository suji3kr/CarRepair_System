package com.company.controller;

import com.company.entity.part.Part;
import com.company.repository.PartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;

// 최저가 상품 조회기능

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class AIProductController {

    private final PartRepository partRepository;


    @GetMapping("/cheapest")
    public List<Part> getCheapestProducts(@RequestParam("category") String category) {
        return partRepository.findAll()
                .stream()
                .filter(part -> part.getCategory().equals(category))
                .sorted(Comparator.comparingDouble(Part::getPrice))
                .limit(5) // 최저가 상품 5개 반환
                .toList();
    }
}
