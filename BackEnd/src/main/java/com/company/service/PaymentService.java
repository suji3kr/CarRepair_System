package com.company.service;

import com.company.entity.Payment;
import com.company.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    // 전체 결제 내역 조회
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // ID로 결제 내역 조회
    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    // 결제 생성
    public Payment createPayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    // 결제 업데이트 (예시: 상태만 업데이트)
    public Payment updatePayment(Long id, Payment updatedPayment) {
        return paymentRepository.findById(id).map(payment -> {
            payment.setPaymentStatus(updatedPayment.getPaymentStatus());
            // 필요 시 다른 필드도 업데이트
            return paymentRepository.save(payment);
        }).orElse(null);
    }

    // 결제 삭제
    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }
}
