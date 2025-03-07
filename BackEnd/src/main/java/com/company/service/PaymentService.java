package com.company.service;

import com.company.dto.PaymentCompleteRequest;

public interface PaymentService {
    boolean verifyPayment(PaymentCompleteRequest request) throws Exception;
}