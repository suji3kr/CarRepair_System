// src/components/review/ReviewBoard.tsx
import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import ReviewCard from './ReviewCard';

// Review 인터페이스: 백엔드에서 반환하는 데이터 구조에 맞춤 (createdAt은 ISO 문자열)
export interface Review {
  id: number;
  content: string;
  profile: string;   // 프로필 이미지 URL
  // 백엔드에서 조인된 사용자 정보로부터 username 또는 name을 받아올 수 있음
  user: {
    id: number;
    username: string;
    name: string;
  };
  createdAt: string;
}

const ReviewBoard: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [author, setAuthor] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [profile, setProfile] = useState<string>('');

  // 백엔드에서 리뷰 가져오기
  const fetchReviews = async () => {
    try {
      const response = await axios.get<Review[]>('http://localhost:8094/api/reviews');
      setReviews(response.data);
    } catch (error) {
      console.error('리뷰 가져오기 에러:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // 리뷰 생성 (새 리뷰를 백엔드에 POST)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 새로운 리뷰 객체 (백엔드 API에 맞춰 user 정보는 간단히 구성)
    const newReview = {
      content,
      profile,
      user: { id: 0, username: author, name: author } // 프론트엔드에서 작성한 author를 username으로 사용 (실제 구현 시 로그인 정보 사용)
    };

    try {
      const response = await axios.post<Review>('http://localhost:8094/api/reviews', newReview);
      // API가 생성된 리뷰를 반환한다고 가정하면, 새 리뷰를 목록에 추가
      setReviews([response.data, ...reviews]);
      setAuthor('');
      setContent('');
      setProfile('');
    } catch (error) {
      console.error('리뷰 생성 에러:', error);
    }
  };

  return (
    <div>
      <h2>리뷰 작성</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="author">작성자 (아이디): </label>
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
