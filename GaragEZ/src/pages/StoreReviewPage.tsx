import React, { useEffect, useState, useMemo } from "react";
import Layout from "../components/Layout";
import styles from "../styles/StoreReview.module.css";
import { Rating } from "@mui/material"; // MUI Rating 컴포넌트 import

interface StoreReview {
  id: number;
  storeName: string;
  content: string;
  rating: number;
  createdAt: string;
}

const StoreReviewPage: React.FC = () => {
  const [reviews, setReviews] = useState<StoreReview[]>([]);
  const [error, setError] = useState("");
  const [storeNameInput, setStoreNameInput] = useState("차고지 스타필드점"); // 기본 가게명
  const [contentInput, setContentInput] = useState("");
  const [ratingInput, setRatingInput] = useState<number | null>(5); // 기본 별점 5점

  // 리뷰 목록 불러오기
  const fetchReviews = async () => {
    try {
      setError("");
      const response = await fetch("http://localhost:8094/api/storereviews");
      if (!response.ok) {
        throw new Error("리뷰를 불러오는데 실패했습니다.");
      }
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("리뷰를 불러오는 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // storeName 기준으로 리뷰 그룹화
  const groupedReviews = useMemo(() => {
    return reviews.reduce((acc: Record<string, StoreReview[]>, review) => {
      if (!acc[review.storeName]) {
        acc[review.storeName] = [];
      }
      acc[review.storeName].push(review);
      return acc;
    }, {});
  }, [reviews]);

  // 새 리뷰 작성 핸들러
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newReview = {
        storeName: storeNameInput.trim(),
        content: contentInput.trim(),
        rating: ratingInput || 0, // 만약 null이면 0 처리
      };
      if (!newReview.storeName || !newReview.content) {
        alert("가게명과 리뷰 내용을 입력해주세요.");
        return;
      }
      const response = await fetch("http://localhost:8094/api/storereviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });
      if (!response.ok) {
        throw new Error("리뷰 등록 실패");
      }
      await fetchReviews(); // 등록 후 목록 갱신
      // 폼 초기화
      setStoreNameInput("차고지 스타필드점");
      setContentInput("");
      setRatingInput(5);
    } catch (err) {
      console.error(err);
      alert("리뷰 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>가게별 리뷰</h1>
        {error && <p className={styles.error}>{error}</p>}

        {/* 리뷰 목록 표시 */}
        {reviews.length === 0 && !error ? (
          <p>등록된 리뷰가 없습니다.</p>
        ) : (
          Object.entries(groupedReviews).map(([storeName, storeReviews]) => {
            // 평균 평점 계산 (소숫점까지)
            const averageRating =
              storeReviews.reduce((sum, r) => sum + r.rating, 0) /
              storeReviews.length;
            return (
              <div key={storeName} className={styles.storeReviewSection}>
                <div className={styles.storeHeader}>
                  <h2 className={styles.storeName}>{storeName}</h2>
                  <div className={styles.storeAverage}>
                    <Rating value={averageRating} readOnly size="small" precision={0.5} />
                    <span>{averageRating.toFixed(1)}점</span>
                  </div>
                </div>
                <ul className={styles.reviewList}>
                  {storeReviews.map((review) => (
                    <li key={review.id} className={styles.reviewItem}>
                      <p className={styles.reviewContent}>{review.content}</p>
                      <div className={styles.reviewRating}>
                        <Rating value={review.rating} readOnly size="small" precision={0.5} />
                        <span>{review.rating}점</span>
                      </div>
                      <span className={styles.reviewDate}>
                        {new Date(review.createdAt).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })
        )}

        {/* 리뷰 등록 폼 (하단) */}
        <div className={styles.reviewFormWrapper}>
          <h2>새 리뷰 작성하기</h2>
          <form onSubmit={handleSubmitReview} className={styles.reviewForm}>
            <label>
              가게명:
              <select
                value={storeNameInput}
                onChange={(e) => setStoreNameInput(e.target.value)}
              >
                <option value="차고지 스타필드점">차고지 스타필드점</option>
                <option value="차고지 용인중앙지점">차고지 용인중앙지점</option>
                <option value="차고지 서울점">차고지 서울점</option>
                <option value="차고지 부산점">차고지 부산점</option>
                <option value="차고지 제주점">차고지 제주점</option>
              </select>
            </label>
            <label>
              리뷰 내용:
              <textarea
                value={contentInput}
                onChange={(e) => setContentInput(e.target.value)}
                rows={4}
              />
            </label>
            <label>
              평점:
              <Rating
                name="rating"
                value={ratingInput}
                onChange={(_event, newValue) => setRatingInput(newValue)}
                precision={0.5}
              />
            </label>
            <button type="submit">리뷰 등록</button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default StoreReviewPage;
