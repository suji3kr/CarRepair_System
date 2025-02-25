package com.company.client;

import com.company.dto.ChatRequest;
import com.company.dto.ChatResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "chatClient", url = "${openapi.chatbot.url}")
public interface ChatbotClient {

    @PostMapping("/message")
    ChatResponse sendMessage(@RequestHeader("Authorization") String apiKey,
                             @RequestBody ChatRequest request);
}