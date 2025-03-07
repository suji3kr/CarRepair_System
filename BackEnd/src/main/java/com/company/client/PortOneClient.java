package com.company.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class PortOneClient {

    private final OkHttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final String portOneApiUrl;
    private final String SECRET_KEY;

    public PortOneClient(
            @Value("${portone.api.url}") String portOneApiUrl,
            @Value("${portone.secret_key}")  String SECRET_KEY
    ) {
        this.httpClient = new OkHttpClient();
        this.objectMapper = new ObjectMapper();
        this.portOneApiUrl = portOneApiUrl;
        this.SECRET_KEY = SECRET_KEY;
    }

    public JsonNode getPaymentDetails(String paymentId) throws IOException {
        String url = portOneApiUrl + "/payments/" + paymentId;

        Request request = new Request.Builder()
                .url(url)
                .addHeader("Authorization", "PortOne " + SECRET_KEY)
                .get()
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("PortOne API 호출 실패: " + response.code());
            }

            String responseBody = response.body().string();
            return objectMapper.readTree(responseBody);
        }
    }
}