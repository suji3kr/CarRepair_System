package com.company.service;

import com.company.entity.ai.AIProduct;
import com.company.repository.AIProductRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Service
public class ScraperService {

    @Autowired
    private AIProductRepository aiProductRepository;

    public void scrapeAndSave() {
        try {
            ProcessBuilder pb = new ProcessBuilder("python3", "/path/to/scraper.py");
            Process process = pb.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                output.append(line);
            }

            // JSON 파싱 후 DB 저장
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(output.toString());

            List<AIProduct> products = new ArrayList<>();
            for (JsonNode node : rootNode) {
                AIProduct product = new AIProduct();
                product.setName(node.get("name").asText());
                product.setPrice(node.get("price").asInt());  // 정수형 변환
                product.setImageUrl(node.get("image_url").asText());
                product.setLink(node.get("link").asText());

                products.add(product);
            }

            aiProductRepository.saveAll(products);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
