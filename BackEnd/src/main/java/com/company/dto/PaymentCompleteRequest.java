package com.company.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record PaymentCompleteRequest(
        @NotEmpty(message = "paymentId는 필수입니다.")
        String paymentId,

        @Min(value = 1, message = "totalAmount는 1 이상이어야 합니다.")
        long totalAmount,

        @NotNull(message = "items는 필수입니다.")
        List<Item> items
) {
    public record Item(
            @Min(value = 1, message = "id는 1 이상이어야 합니다.")
            long id,

            @NotEmpty(message = "name은 필수입니다.")
            String name,

            @Min(value = 1, message = "quantity는 1 이상이어야 합니다.")
            int quantity
    ) {}
}