// src/components/review/ReviewCard.tsx
import React from 'react';
import { Review } from './ReviewBoard';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div
      style={{
        width: '300px',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}
    >
      {/* 상단: 리뷰 내용을 크게 표시 */}
      <div
        style={{
          backgroundColor: '#f9f9f9',
          padding: '1rem',
          fontSize: '1.6rem',
          fontWeight: 'bold',
          borderBottom: '1px solid #ddd'
        }}
      >
        {review.content}
      </div>
      {/* 하단: 프로필, 작성자, 작성일 */}
      <div style={{ display: 'flex', padding: '1rem', alignItems: 'center' }}>
        {review.profile ? (
          <img
            src={review.profile}
            alt={`${review.author} 프로필`}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              objectFit: 'cover',
              marginRight: '1rem'
            }}
          />
        ) : (
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#ccc',
              marginRight: '1rem'
            }}
          ></div>
        )}
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 500 }}>{review.author}</div>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>
            {review.createdAt.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
