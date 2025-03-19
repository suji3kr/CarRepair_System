package com.company.controller;

import com.company.dto.chat.ChatRequest;
import com.company.dto.chat.ChatResponse;
import com.company.service.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class


ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @Operation(summary = "챗봇과 대화", description = "사용자의 메시지를 입력하면 AI 챗봇이 응답을 제공합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "응답 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/message")
    public ResponseEntity<ChatResponse> sendMessage(@RequestBody ChatRequest request) {
        String answer = chatService.getAnswer(request.getMessage());
        return ResponseEntity.ok(new ChatResponse(answer));
    }

    @Operation(summary = "챗봇 샘플 질문 목록", description = "챗봇이 제공하는 샘플 질문 목록을 조회합니다.")
    @ApiResponse(responseCode = "200", description = "질문 목록 조회 성공")
    @GetMapping("/questions")
    public ResponseEntity<Map<String, List<String>>> getQuestions() {
        return ResponseEntity.ok(chatService.getSampleQuestions());
    }
}
