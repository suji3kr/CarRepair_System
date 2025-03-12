package com.company.controller;

import com.company.entity.part.Part;
import com.company.repository.PartRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/parts")
@CrossOrigin(origins = "http://localhost:3000") // React 프론트엔드 허용
public class PartController {

    private final PartRepository partRepository;

    public PartController(PartRepository partRepository) {
        this.partRepository = partRepository;
    }

    // 🔹 1. 모든 부품 조회
    @GetMapping
    public ResponseEntity<List<Part>> getAllParts() {
        List<Part> parts = partRepository.findAll();
        return ResponseEntity.ok(parts);
    }

    // 🔹 2. 특정 ID의 부품 조회
    @GetMapping("/{id}")
    public ResponseEntity<Part> getPartById(@PathVariable Long id) {
        Optional<Part> part = partRepository.findById(id);
        return part.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 🔹 3. 새로운 부품 추가
    @PostMapping
    public ResponseEntity<Part> createPart(@RequestBody Part part) {
        Part savedPart = partRepository.save(part);
        return ResponseEntity.ok(savedPart);
    }

    // 🔹 4. 특정 부품 정보 수정
    @PutMapping("/{id}")
    public ResponseEntity<Part> updatePart(@PathVariable Long id, @RequestBody Part updatedPart) {
        return partRepository.findById(id)
                .map(part -> {
                    part.setName(updatedPart.getName());
                    part.setCategory(updatedPart.getCategory());
                    part.setPrice(updatedPart.getPrice());
                    part.setStock(updatedPart.getStock());
                    Part savedPart = partRepository.save(part);
                    return ResponseEntity.ok(savedPart);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 🔹 5. 특정 부품 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePart(@PathVariable Long id) {
        if (partRepository.existsById(id)) {
            partRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
