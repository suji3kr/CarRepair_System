// components/PartsShop.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/PartsShop.module.css";
import Layout from "../components/Layout";
import { fetchParts } from "../services/partService";
import { Skeleton } from "@mui/material";
import { Part } from "../types/part";

const categories = ["엔진오일", "타이어", "와이퍼", "기타"];

const PartsShop: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("엔진오일");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [parts, setParts] = useState<Part[]>([]);

  useEffect(() => {
    setIsLoading(true);
    fetchParts()
      .then((data) => {
        setParts(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching parts:", error);
        setIsLoading(false);
      });
    }, [selectedCategory]);  // selectedCategory가 변경될 때마다 다시 호출

  const handlePageChange = (newPage: number) => {
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  };
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // 페이지 초기화
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const filteredParts = parts.filter((part) => part.category === selectedCategory);
  const totalPages = Math.max(1, Math.ceil(filteredParts.length / 25));
  const displayedItems = filteredParts.slice((currentPage - 1) * 25, currentPage * 25);

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.partMenu}>
          {categories.map((category, index) => (
            <div key={index} className={styles.category} onClick={() => handleCategoryChange(category)}>
              <h3>{category}</h3>
            </div>
          ))}
        </div>

        <div className={styles.itemsContainer}>
          <div className={styles.itemsGrid}>
            {isLoading
              ? Array.from({ length: 10 }).map((_, index) => (
                  <div key={index} className={styles.itemCard}>
                    <Skeleton variant="rectangular" width={120} height={120} />
                    <div className={styles.itemInfo}>
                      <Skeleton width="80%" height={20} />
                      <Skeleton width="60%" height={20} />
                    </div>
                  </div>
                ))
              : displayedItems.length > 0 ? (
                  displayedItems.map((part) => (
                    <div
                      key={part.id}
                      className={styles.itemCard}
                      onClick={() => navigate(`/part/${part.id}`)}
                    >
                      <img
                        src={`/images/${part.imageUrl}`}
                        alt={part.name}
                      />

                      <div className={styles.itemInfo}>
                        <p className={styles.itemName} title={part.name}>
                          {part.name.length > 14 ? `${part.name.slice(0, 14)}...` : part.name}
                        </p>
                        <p className={styles.itemPrice}>
                          {part.price.toLocaleString("ko-KR")}원
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>해당 카테고리에 상품이 없습니다.</p>
                )}
          </div>

          {/* 페이지네이션 */}
          <div className={styles.pagination}>
            <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
              이전
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
              다음
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PartsShop;
