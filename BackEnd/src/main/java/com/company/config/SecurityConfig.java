package com.company.config;

import com.company.security.JwtTokenFilter;
import com.company.security.JwtTokenProvider;
import com.company.security.CustomAuthenticationEntryPoint;
import com.company.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.web.header.writers.StaticHeadersWriter;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)  // ✅ @PreAuthorize 활성화
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService userDetailsService;
    private final CustomAuthenticationEntryPoint authenticationEntryPoint;

    public SecurityConfig(JwtTokenProvider jwtTokenProvider, CustomUserDetailsService userDetailsService,
                          CustomAuthenticationEntryPoint authenticationEntryPoint) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
        this.authenticationEntryPoint = authenticationEntryPoint;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // ✅ CORS 설정
                .csrf(AbstractHttpConfigurer::disable) // ✅ CSRF 보호 비활성화
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // ✅ JWT 기반 세션 없음
                .authorizeHttpRequests(auth -> auth
                        // ✅ Swagger 접근 제한
//                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").hasRole("ADMIN")

                        // ✅ 관리자 API는 ADMIN 권한 필요
                        .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")

                        // ✅ 허용된 API 경로들 (로그인, 회원가입, 기타 공개 API)
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/users/**",
                                "/api/signup/**",
                                "/v3/**",
                                "/swagger-ui/**",
                                "/api/vehicles/**",
                                "/api/payment/**",
                                "/api/parts/**",
                                "/api/cars/**",
                                "/images/**",
                                "/api/store/**",
                                "/api/storereviews/**",
                                "/api/chat/**",
                                "/api/reservations/**"
                        ).permitAll()

                        // ✅ 나머지 요청은 로그인 필요
                        .anyRequest().authenticated()
                )
                .exceptionHandling(exception ->
                        exception.authenticationEntryPoint(authenticationEntryPoint)
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(new JwtTokenFilter(jwtTokenProvider, userDetailsService),
                        UsernamePasswordAuthenticationFilter.class)
                .headers(headers -> headers
                        .addHeaderWriter(new StaticHeadersWriter("Cross-Origin-Opener-Policy", "same-origin-allow-popups"))
                        .addHeaderWriter(new StaticHeadersWriter("Cross-Origin-Embedder-Policy", "require-corp"))
                        .addHeaderWriter(new StaticHeadersWriter("Cross-Origin-Resource-Policy", "cross-origin"))
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000","http://garagez.s3-website.ap-northeast-2.amazonaws.com"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Cache-Control", "Content-Type"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }


}
