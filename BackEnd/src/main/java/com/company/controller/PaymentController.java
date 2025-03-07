package com.company.controller;

import com.company.dto.ApiResponse;
import com.company.dto.PaymentCompleteRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
        import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    @Value("${portone.secret_key}")
    private String SECRET_KEY;

    @PostMapping("/complete")
    public ResponseEntity<ApiResponse> completePayment(@Valid @RequestBody PaymentCompleteRequest request) {
        try {
            boolean isValid = verifyPayment(request);
            if (isValid) {
                return ResponseEntity.ok(new ApiResponse("결제 검증 성공"));
            } else {
                String errorDetail = "";
                if (request.paymentId() == null || request.paymentId().isEmpty()) {
                    errorDetail = "paymentId가 누락되었거나 비어 있습니다.";
                } else if (request.totalAmount() <= 0) {
                    errorDetail = "totalAmount가 0 이하입니다.";
                } else if (request.items() == null || request.items().isEmpty()) {
                    errorDetail = "items가 누락되었거나 비어 있습니다.";
                } else {
                    errorDetail = "결제 데이터 검증 실패 (PortOne 상태 불일치)";
                }
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse("결제 검증 실패: " + errorDetail));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("서버 오류: " + e.getMessage()));
        }
    }

    private boolean verifyPayment(PaymentCompleteRequest request) throws Exception {
        if (request.paymentId() == null || request.paymentId().isEmpty()) {
            return false;
        }
        if (request.totalAmount() <= 0) {
            return false;
        }
        if (request.items() == null || request.items().isEmpty()) {
            return false;
        }

        // PortOne API 호출 (예시)
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest apiRequest = HttpRequest.newBuilder()
                .uri(URI.create("https://api.portone.io/payments/" + request.paymentId()))
                .header("Authorization", "PortOne " + SECRET_KEY) // 실제 API 키 필요
                .GET()
                .build();

        HttpResponse<String> response = client.send(apiRequest, HttpResponse.BodyHandlers.ofString());
        String responseBody = response.body();
        System.out.println("PortOne Response: " + responseBody);

        // 응답 파싱 (예: JSON에서 "status"와 "amount" 추출, 실제 구조는 PortOne 문서 참조)
        boolean isPaid = responseBody.contains("\"status\":\"PAID\"");
        boolean amountMatches = responseBody.contains("\"paid\":" + request.totalAmount());
        return isPaid && amountMatches;
    }
}