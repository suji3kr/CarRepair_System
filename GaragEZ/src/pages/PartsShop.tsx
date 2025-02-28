import React, { useState, useEffect } from "react";
import styles from "../styles/PartsShop.module.css";
import Layout from "../components/Layout";
import { fetchParts } from "../services/partService"; // API 호출 함수 가져오기
import { Skeleton } from "@mui/material";

type Part = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
};

const categories = ["CPU", "GPU", "RAM", "Storage"]; // Spring Boot에서 제공하는 카테고리

const PartsShop: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("CPU");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [parts, setParts] = useState<Part[]>([]);

  // 🚀 API에서 부품 데이터 가져오기
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
  }, []);

  // 선택한 카테고리의 부품 필터링
  const filteredParts = parts.filter((part) => part.category === selectedCategory);
  const totalPages = Math.ceil(filteredParts.length / 25);
  const displayedItems = filteredParts.slice((currentPage - 1) * 25, currentPage * 25);

  return (
    <Layout>
      <div className={styles.container}>
        {/* 왼쪽 사이드바 */}
        <div className={styles.sidebar}>
          {categories.map((category, index) => (
            <div key={index} className={styles.category}>
              <h3
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
              >
                {category}
              </h3>
            </div>
          ))}
        </div>

        {/* 오른쪽 아이템 목록 및 페이지네이션 */}
        <div className={styles.itemsContainer}>
          <div className={styles.itemsGrid}>
            {isLoading
              ? Array.from({ length: 10 }).map((_, index) => (
                  <div key={index} className={styles.itemCard}>
                    <Skeleton variant="rectangular" width={70} height={70} />
                    <div className={styles.itemInfo}>
                      <Skeleton width="80%" height={20} />
                      <Skeleton width="60%" height={20} />
                    </div>
                  </div>
                ))
              : displayedItems.map((part) => (
                  <div key={part.id} className={styles.itemCard}>
                    <div className={styles.itemInfo}>
                      <p className={styles.itemName}>{part.name}</p>
                      <p className={styles.itemCategory}>{part.category}</p>
                      <p className={styles.itemPrice}>${part.price}</p>
                      <p className={styles.itemStock}>재고: {part.stock}</p>
                    </div>
                  </div>
                ))}
          </div>

          {/* 페이지네이션 */}
          <div className={styles.pagination}>
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
              이전
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>
              다음
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PartsShop;
