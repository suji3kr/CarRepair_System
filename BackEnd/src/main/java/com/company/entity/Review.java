package com.company.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // user 필드를 직렬화할 때, user 엔티티의 reviews 컬렉션은 무시
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"reviews"})
    private User user;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;


    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

}
