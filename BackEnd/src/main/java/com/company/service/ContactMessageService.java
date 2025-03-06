package com.company.service;


import com.company.entity.review.ContactMessage;
import com.company.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContactMessageService {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    // 문의 데이터 저장
    public ContactMessage saveMessage(ContactMessage contactMessage) {
        return contactMessageRepository.save(contactMessage);
    }

    // 전체 문의 내역 조회
    public List<ContactMessage> getAllMessages() {
        return contactMessageRepository.findAll();
    }

    // 특정 문의 조회
    public Optional<ContactMessage> getMessageById(Long id) {
        return contactMessageRepository.findById(id);
    }

    // 문의 삭제
    public void deleteMessage(Long id) {
        contactMessageRepository.deleteById(id);
    }
}
