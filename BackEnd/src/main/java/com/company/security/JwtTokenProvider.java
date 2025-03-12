package com.company.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.Map;

@Component // Bean 등록
public class JwtTokenProvider {

    private final SecretKey secretKey;
    private final long validityInMilliseconds = 3600000; // 1시간
    private final ObjectMapper objectMapper; // ✅ Jackson ObjectMapper 추가

    public JwtTokenProvider() {
        // ✅ 환경변수 또는 고정된 Base64 Key 사용 (서버 재시작 시 동일한 키 유지)
        String secret = "mySuperSecretKeyForJwtTokenAuthentication"; // 🔹 안전한 키로 변경 필요
        this.secretKey = Keys.hmacShaKeyFor(Base64.getEncoder().encode(secret.getBytes()));

        // ✅ ObjectMapper 인스턴스 생성 (전역 변수)
        this.objectMapper = new ObjectMapper();
    }

    // ✅ userId 기반으로 토큰 생성
    public String createToken(String userId) {
        Claims claims = Jwts.claims().setSubject(userId); // ✅ userId를 subject로 설정

        Date now = new Date();
        Date validity = new Date(now.getTime() + validityInMilliseconds);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(secretKey)
                .compact();
    }

    // ✅ 토큰 유효성 검사
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // ✅ userId를 반환하도록 수정
    public String getUserIdFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(secretKey).build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // ✅ 인증 객체 반환
    public Authentication getAuthentication(String token, UserDetails userDetails) {
        return new UsernamePasswordAuthenticationToken(userDetails, token, userDetails.getAuthorities());
    }

    // ✅ Google JWT에서 이메일 추출
    public String extractEmail(String idToken) {
        try {
            Map<String, Object> payload = decodeJwtPayload(idToken);
            return (String) payload.get("email"); // Google JWT에서 "email" 필드 추출
        } catch (Exception e) {
            return null;
        }
    }

    // ✅ Google JWT에서 이름 추출
    public String extractName(String idToken) {
        try {
            Map<String, Object> payload = decodeJwtPayload(idToken);
            return (String) payload.get("name"); // Google JWT에서 "name" 필드 추출
        } catch (Exception e) {
            return null;
        }
    }

    // ✅ Google JWT의 Payload 부분을 Base64 디코딩하여 JSON으로 변환하는 메서드
    private Map<String, Object> decodeJwtPayload(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length < 2) {
                throw new IllegalArgumentException("Invalid JWT token format");
            }

            // ✅ Base64 디코딩
            byte[] decodedBytes = Base64.getUrlDecoder().decode(parts[1]);
            String payload = new String(decodedBytes);

            // ✅ JSON을 Map<String, Object>으로 변환
            return objectMapper.readValue(payload, Map.class);
        } catch (Exception e) {
            throw new RuntimeException("JWT Payload 파싱 중 오류 발생: " + e.getMessage(), e);
        }
    }
}
