// src/MainPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MainPage.css';

interface Review {
  id: number;
  content: string;
  createdAt: string;
  // 백엔드에서 user 객체 내에 username(혹은 아이디) 반환한다고 가정
  user: {
    id: number;
    username: string;
  };
}

const MainPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    axios.get<Review[]>('http://localhost:8094/api/reviews')
      .then(response => {
        setReviews(response.data);
      })
      .catch(error => {
        console.error('리뷰를 불러오는 중 오류 발생:', error);
      });
  }, []);

  return (
    <div className="main-container font-sans">
      {/* Hero Section */}
      <section className="hero-section">
        {/* Hero content 여기에 추가 */}
      </section>

      {/* Navigation Icons */}
      <nav className="nav-icons">
        {["타이어", "엔진오일", "배터리", "악세사리", "튜닝", "세차", "차량용품", "이벤트"].map((item, idx) => (
          <button key={idx} className="nav-button">
            <div className="icon-placeholder"></div>
            <span>{item}</span>
          </button>
        ))}
      </nav>

      {/* 배너자리 */}
      <section className="banner-section">
        <img src="/special-event-banner.jpg" alt="이벤트 배너" className="banner-img" />
      </section>

      {/* Section Heading */}
      <section className="section-heading">
        <h2>Section heading</h2>
        <p className="subheading">Subheading</p>
        <p className="subheading">Subheading</p>
        <p className="subheading">Subheading</p>
        <div className="button-group">
          <button className="primary-button">Button</button>
          <button className="secondary-button">Secondary button</button>
        </div>
      </section>

      {/* Event & ItemShop Section */}
      <section className="event-itemshop">
        <div className="event">
          <img src="/event-image.jpg" alt="Event" className="section-img" />
          <h3>Event</h3>
          <p className="section-subheading">Subheading</p>
        </div>
        <div className="itemshop">
          <img src="/itemshop-image.jpg" alt="ItemShop" className="section-img" />
          <h3>ItemShop</h3>
          <p className="section-subheading">Subheading</p>
        </div>
      </section>

      {/* 차고지 리뷰 */}
      <section className="reviews">
        <h2>차고지 리뷰</h2>
        <div className="review-cards" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {reviews.length > 0 ? (
            reviews.map(review => (
              <div key={review.id} className="review-card" style={{
                width: '300px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <p className="review-text" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                  "{review.content}"
                </p>
                <div className="review-author" style={{ fontWeight: 500 }}>
                  {review.user.username}
                </div>
                <div className="review-date" style={{ fontSize: '0.9rem', color: '#666' }}>
                  {new Date(review.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            <p>작성된 리뷰가 없습니다.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default MainPage;
