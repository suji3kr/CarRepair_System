package com.company.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtTokenFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;

    // 인증이 필요 없는 경로 목록
    private static final List<String> EXCLUDED_PATHS = Arrays.asList(
            "/api/reservations",
            "/api/reservations/",
            "/api/reservations/user/",
            "/api/auth/",
            "/api/users/",
            "/api/signup/",
            "/v3/",
            "/swagger-ui/",
            "/api/vehicles/",
            "/api/payment/",
            "/api/parts/",
            "/api/cars/",
            "/images/",
            "/api/store/",
            "/api/storereviews/",
            "/api/chat/"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // 제외된 경로인지 확인
        if (EXCLUDED_PATHS.stream().anyMatch(path::startsWith)) {
            log.info("🔹 인증 제외 경로: [{}] {}", request.getMethod(), path);
            chain.doFilter(request, response);
            return;
        }

        String token = getTokenFromRequest(request);

        logRequestDetails(request, token);

        if (token != null && jwtTokenProvider.validateToken(token)) {
            String userId = jwtTokenProvider.getUserIdFromToken(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(userId);

            if (userDetails != null) {
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(auth);
                log.info("✅ 사용자 인증 완료: {}", userId);
            } else {
                log.warn("🚨 사용자 정보를 찾을 수 없음: {}", userId);
            }
        } else {
            log.warn("🚨 JWT 토큰이 유효하지 않음 또는 없음");
        }
        chain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        return (bearerToken != null && bearerToken.startsWith("Bearer ")) ? bearerToken.substring(7) : null;
    }

    private void logRequestDetails(HttpServletRequest request, String token) {
        log.info("🔹 요청 정보: [{}] {}", request.getMethod(), request.getRequestURI());
        log.info("🔹 JWT 토큰: {}", token != null ? "존재함" : "없음");
    }
}