package com.company.service;

import org.springframework.stereotype.Service;

@Service
public class ChatService {

    // AI API 호출 로직 (예시: OpenAI API)
    public String getAnswer(String message) {
        // API 호출 후 AI 응답을 받아오는 코드
        return callAiApi(message);
    }

    private String callAiApi(String prompt) {
        // OpenAI 등 실제 API를 활용하여 구현
        // (RestTemplate 또는 WebClient 사용)
        return "챗봇이 생성한 AI 응답";
    }
}
