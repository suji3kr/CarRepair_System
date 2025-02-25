import React, { useState, FormEvent } from 'react';
import ReviewCard from './ReviewCard';

// Review 인터페이스: 각 리뷰 데이터 타입 정의
export interface Review {
  id: number;
  author: string;
  content: string;
  profile: string; // 프로필 이미지 URL
  createdAt: Date;
}

const ReviewBoard: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [author, setAuthor] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [profile, setProfile] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newReview: Review = {
      id: Date.now(),
      author,
      content,
      profile,
      createdAt: new Date(),
    };
    setReviews([newReview, ...reviews]);
    // 입력 필드 초기화
    setAuthor('');
    setContent('');
    setProfile('');
  };

  return (
    <div>
      <h2>리뷰 작성</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="author">작성자: </label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="profile">프로필 이미지 URL: </label>
          <input
            type="text"
            id="profile"
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
            placeholder="https://example.com/profile.jpg"
          />
        </div>
        <div>
          <label htmlFor="content">내용: </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit">리뷰 추가</button>
      </form>

      <h2>작성된 리뷰</h2>
      {reviews.length === 0 ? (
        <p>작성된 리뷰가 없습니다.</p>
      ) : (
        // 가로 정렬을 위한 flex 컨테이너
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewBoard;
