package com.company.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class ChatService {

    @Value("${openai.api.key}") // 환경 변수에서 OpenAI API 키 가져오기
    private String apiKey;

    @Value("${openai.api.url}") // 환경 변수에서 API URL 가져오기
    private String apiUrl;

    // AI API를 호출하여 답변을 가져오는 메서드
    public String getAnswer(String message) {
        return callAiApi(message);
    }

    // OpenAI API 호출 메서드
    private String callAiApi(String prompt) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey); // API 키 설정

        Map<String, Object> requestBody = Map.of(
                "model", "gpt-3.5-turbo",
                "messages", List.of(Map.of("role", "user", "content", prompt)),
                "max_tokens", 100
        );

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, requestEntity, Map.class);

        Map<String, Object> responseBody = response.getBody();
        if (responseBody != null && responseBody.containsKey("choices")) {
            List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
            if (!choices.isEmpty()) {
                return (String) ((Map<String, Object>) choices.get(0).get("message")).get("content");
            }
        }
        return "AI 응답을 가져오는 데 실패했습니다.";
    }

    // 카테고리별 질문 목록 제공
    public Map<String, List<String>> getSampleQuestions() {
        return Map.of(
                "차량 관리", List.of("엔진오일은 언제 교체해야 하지?", "연비가 좋으려면 어떻게 해야 하지?"),
                "운전 방법", List.of("크루즈 컨트롤은 어떻게 켜는 거야?", "차량 배터리 타입 알려줘."),
                "기타", List.of("세차는 어떻게 하는 게 좋아?", "중립 주차 하려면 어떻게 해야 해?")
        );
    }
}
