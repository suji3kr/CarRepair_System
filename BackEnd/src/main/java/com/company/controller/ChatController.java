package com.company.controller;

import com.company.dto.chat.ChatRequest;
import com.company.dto.chat.ChatResponse;
import com.company.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
//챗봇 대화 처리기능

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    // 생성자 주입으로 ChatService 의존성 관리
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    // 클라이언트 메시지를 받아 서비스로 전달하고 응답을 반환
    @PostMapping("/message")
    public ResponseEntity<ChatResponse> sendMessage(@RequestBody ChatRequest request) {
        String answer = chatService.getAnswer(request.getMessage());
        return ResponseEntity.ok(new ChatResponse(answer));
    }
    @GetMapping("/questions")
    public ResponseEntity<Map<String, List<String>>> getQuestions() {
        return ResponseEntity.ok(chatService.getSampleQuestions());
    }
}