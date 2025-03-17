package com.company.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.Map;

@Slf4j
@Component
public class JwtTokenProvider {

    private final SecretKey secretKey;
    private final long validityInMilliseconds;
    private final ObjectMapper objectMapper;

    // ✅ 환경 변수 또는 application.properties에서 키를 불러오도록 개선
    public JwtTokenProvider(@Value("${jwt.secret}") String secret, @Value("${jwt.expiration}") long validityMs) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.validityInMilliseconds = validityMs;
        this.objectMapper = new ObjectMapper();
    }

    // ✅ userId 기반으로 토큰 생성, "ROLE_" 중복 방지 및 일관성 유지
    public String createToken(String userId, String userRole) {
        Claims claims = Jwts.claims().setSubject(userId);

        // "ROLE_" 접두사가 없는 경우만 추가
        if (!userRole.startsWith("ROLE_")) {
            userRole = "ROLE_" + userRole;
        }
        claims.put("role", userRole);

        Date now = new Date();
        Date validity = new Date(now.getTime() + validityInMilliseconds);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(secretKey, SignatureAlgorithm.HS256) // ✅ 알고리즘 명시
                .compact();
    }

    // ✅ JWT 토큰 유효성 검사 개선 (더 상세한 예외 로그 추가)
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
            log.info("✅ JWT 토큰 유효성 검증 성공");
            return true;
        } catch (ExpiredJwtException e) {
            log.error("🚨 JWT 토큰 만료됨: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("🚨 지원되지 않는 JWT 형식: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.error("🚨 JWT 토큰이 변조되었거나 잘못됨: {}", e.getMessage());
        } catch (SecurityException e) {
            log.error("🚨 JWT 서명이 올바르지 않음: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("🚨 JWT 토큰이 비어있음 또는 잘못됨: {}", e.getMessage());
        }
        return false;
    }

    // ✅ userId 추출
    public String getUserIdFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(secretKey).build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // ✅ 사용자의 인증 정보 생성
    public Authentication getAuthentication(String token, UserDetails userDetails) {
        return new UsernamePasswordAuthenticationToken(userDetails, token, userDetails.getAuthorities());
    }

    // ✅ Google JWT에서 이메일 추출
    public String extractEmail(String idToken) {
        return extractClaim(idToken, "email");
    }

    // ✅ Google JWT에서 이름 추출
    public String extractName(String idToken) {
        return extractClaim(idToken, "name");
    }

    // ✅ Google JWT의 Payload 디코딩 (예외 처리 개선 및 성능 최적화)
    private String extractClaim(String token, String claimKey) {
        try {
            Map<String, Object> payload = decodeJwtPayload(token);
            return payload.getOrDefault(claimKey, "").toString();
        } catch (Exception e) {
            log.error("🚨 Google JWT에서 '{}' 추출 실패: {}", claimKey, e.getMessage());
            return null;
        }
    }

    // ✅ Google JWT의 Payload 디코딩 (잘못된 토큰 형식에 대한 방어 로직 추가)
    private Map<String, Object> decodeJwtPayload(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length < 2) {
                throw new IllegalArgumentException("🚨 JWT 토큰 형식이 올바르지 않음");
            }
            byte[] decodedBytes = Base64.getUrlDecoder().decode(parts[1]);
            String payload = new String(decodedBytes, StandardCharsets.UTF_8);
            return objectMapper.readValue(payload, Map.class);
        } catch (Exception e) {
            log.error("🚨 JWT Payload 파싱 오류: {}", e.getMessage());
            throw new RuntimeException("JWT Payload 파싱 중 오류 발생: " + e.getMessage(), e);
        }
    }
}
