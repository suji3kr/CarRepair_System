package com.company.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class ChatService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    private final Map<String, String> faqDatabase = Map.of(
            "엔진오일은 언제 교체해야 하지?", "보통 3,000~5,000km마다 교체하는 것이 좋습니다.",
            "세차는 어떻게 하는 게 좋아?", "미지근한 물과 전용 세제를 사용하세요."
    );

    public String getAnswer(String message) {
        // FAQ에서 먼저 확인
        if (faqDatabase.containsKey(message)) {
            return faqDatabase.get(message);
        }
        // FAQ에 없으면 AI API 호출
        return callAiApi(message);
    }

    public String callAiApi(String prompt) {
        // API URL에 Key 추가
        String requestUrl = apiUrl + "?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", "당신은 정비전문업체 GaragEZ의 매니저입니다. 관련 질문에만 답변해주세요.\n\n" +
                                        "답변은 짧게 3문장 이하로\n\n" + prompt)
                        ))

                ),
                "generationConfig", Map.of(
                        "temperature", 0.0
                )

        );

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.exchange(requestUrl, HttpMethod.POST, requestEntity, Map.class);

        @SuppressWarnings("unchecked")
        Map<String, Object> responseBody = response.getBody();
        if (responseBody != null && responseBody.containsKey("candidates")) {
            @SuppressWarnings("unchecked")
            var candidates = (List<Map<String, Object>>) responseBody.get("candidates");
            if (!candidates.isEmpty()) {
                @SuppressWarnings("unchecked")
                var contentMap = (Map<String, Object>) candidates.get(0).get("content");
                if (contentMap != null && contentMap.containsKey("parts")) {
                    @SuppressWarnings("unchecked")
                    var parts = (List<Map<String, Object>>) contentMap.get("parts");
                    if (!parts.isEmpty()) {
                        return (String) parts.get(0).get("text");
                    }
                }
            }
        }

        return "AI 응답을 가져오는 데 실패했습니다.";
    }

    public Map<String, List<String>> getSampleQuestions() {
        return Map.of(
                "차량 관리", List.of("엔진오일은 언제 교체해야 하지?", "연비가 좋으려면 어떻게 해야 하지?"),
                "운전 방법", List.of("크루즈 컨트롤은 어떻게 켜는 거야?", "차량 배터리 타입 알려줘."),
                "기타", List.of("세차는 어떻게 하는 게 좋아?", "중립 주차 하려면 어떻게 해야 해?")
        );
    }
}