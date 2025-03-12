// src/main/java/com/company/config/WebSocketConfig.java
package com.company.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // 클라이언트가 WebSocket 연결을 시도할 엔드포인트 (SockJS 폴백 지원)
        registry.addEndpoint("/ws-chat").setAllowedOriginPatterns("*").withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // 클라이언트가 메시지를 전송할 때 사용할 prefix 설정 (예: /app)
        registry.setApplicationDestinationPrefixes("/app");
        // 클라이언트가 구독할 메시지 브로커 설정 (예: /topic)
        registry.enableSimpleBroker("/topic");
    }
}
