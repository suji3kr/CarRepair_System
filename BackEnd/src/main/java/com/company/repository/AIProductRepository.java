package com.company.repository;

import com.company.entity.ai.AIProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AIProductRepository extends JpaRepository<AIProduct, Long> {
}
