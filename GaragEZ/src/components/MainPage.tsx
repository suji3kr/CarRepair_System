import React from 'react';
import './MainPage.css';

const MainPage: React.FC = () => {
  return (
    <div className="main-container font-sans">
      {/* Hero Section */}
      <section className="hero-section">

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
        <div className="review-cards">
          {["A terrific place of praise", "A fantastic bit of feedback", "A genuinely glowing review"].map((review, idx) => (
            <div key={idx} className="review-card">
              <p className="review-text">"{review}"</p>
              <div className="review-author">Name</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MainPage;
