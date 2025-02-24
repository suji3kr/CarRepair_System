// src/pages/ReviewPage.tsx
import React from 'react';
import ReviewBoard from '../components/review/ReviewBoard';

const ReviewPage: React.FC = () => {
  return (
    <div style={{ padding: '1rem' }}>
      <h1>리뷰 게시판</h1>
      <ReviewBoard />
    </div>
  );
};

export default ReviewPage;
