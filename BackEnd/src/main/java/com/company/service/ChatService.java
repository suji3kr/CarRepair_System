package com.company.service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class ChatService {

    // AI API 호출 로직 (예시: OpenAI API)
    public String getAnswer(String message) {
        return callAiApi(message);
    }

    private String callAiApi(String prompt) {
        return "AI 응답: " + prompt; // 실제 OpenAI API 호출 구현 필요
    }

    // 카테고리별 질문 목록
    public Map<String, List<String>> getSampleQuestions() {
        return Map.of(
                "차량 관리", List.of("엔진오일은 언제 교체해야 하지?", "연비가 좋으려면 어떻게 해야 하지?"),
                "운전 방법", List.of("크루즈 컨트롤은 어떻게 켜는 거야?", "차량 배터리 타입 알려줘."),
                "기타", List.of("세차는 어떻게 하는 게 좋아?", "중립 주차 하려면 어떻게 해야 해?")
        );
    }
}
