import React, { useState } from "react";
import styles from "../styles/PartsShop.module.css";
import Layout from "../components/Layout";

const categories = [
  { title: "CPU", subcategories: ["Intel", "AMD"] },
  { title: "GPU", subcategories: ["NVIDIA", "AMD"] },
  { title: "RAM", subcategories: ["DDR4", "DDR5"] },
  { title: "Storage", subcategories: ["SSD", "HDD"] },
];

const getRandomImage = () => {
  const randomId = Math.floor(Math.random() * 1000);
  return `https://picsum.photos/70?random=${randomId}`;
};

const itemsPerPage = 25;

const itemsData = {
  CPU: Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `CPU Item ${i + 1}`,
    price: `$${(Math.random() * 1000).toFixed(2)}`,
    imageUrl: getRandomImage(),
  })),
  GPU: Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `GPU Item ${i + 1}`,
    price: `$${(Math.random() * 1000).toFixed(2)}`,
    imageUrl: getRandomImage(),
  })),
  RAM: Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `RAM Item ${i + 1}`,
    price: `$${(Math.random() * 500).toFixed(2)}`,
    imageUrl: getRandomImage(),
  })),
  Storage: Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Storage Item ${i + 1}`,
    price: `$${(Math.random() * 500).toFixed(2)}`,
    imageUrl: getRandomImage(),
  })),
};

const PartsShop: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.title || "CPU");
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil((itemsData[selectedCategory]?.length || 0) / itemsPerPage);
  const displayedItems =
    itemsData[selectedCategory]?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) || [];

  return (
    <Layout>
      <div className={styles.container}>
        {/* 왼쪽 사이드바 */}
        <div className={styles.sidebar}>
          {categories.map((category, index) => (
            <div key={index} className={styles.category}>
              <h3
                onClick={() => {
                  setSelectedCategory(category.title);
                  setCurrentPage(1);
                }}
              >
                {category.title}
              </h3>
              <ul>
                {category.subcategories.map((sub, subIndex) => (
                  <li key={subIndex}>{sub}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 오른쪽 아이템 목록 및 페이지네이션 */}
        <div className={styles.itemsContainer}>
          <div className={styles.itemsGrid}>
            {displayedItems.map((item) => (
              <div key={item.id} className={styles.itemCard}>
                <img src={item.imageUrl} alt={item.name} />
                <div className={styles.itemInfo}>
                  <p className={styles.itemName}>{item.name}</p>
                  <p className={styles.itemPrice}>{item.price}</p>
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
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PartsShop;
