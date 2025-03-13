import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Car.module.css";
import Layout from "../components/Layout";
import { Skeleton } from "@mui/material";

// Car 인터페이스 정의 (백엔드와 일치)
interface Car {
  id: number;
  carModel: string;
  image_url: string;
  carMake: string;
}

const fetchCars = async (carMake: string): Promise<Car[]> => {
  const response = await fetch(`http://localhost:8094/api/cars?car_make=${carMake}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch cars: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.cars || [];
};

const categories = ["현대", "기아", "쉐보레", "쌍용"];

const Cars: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("현대");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCars = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchCars(selectedCategory);
        setCars(data);
      } catch (err: any) {
        setError(`차량 데이터를 불러오는 데 실패했습니다: ${err.message}`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCars();
  }, [selectedCategory]);

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
    setCurrentPage(1);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handleCarClick = (car: Car) => {
    navigate("/contact", {
      state: {
        carMake: car.carMake,
        carId: car.id.toString(),
      },
    });
  };

  const totalPages = Math.max(1, Math.ceil(cars.length / 10));
  const displayedItems = Array.isArray(cars) ? cars.slice((currentPage - 1) * 10, currentPage * 8) : [];

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.partMenu}>
          {categories.map((category, index) => (
            <div
              key={index}
              className={`${styles.category} ${selectedCategory === category ? styles.active : ""}`}
              onClick={() => handleCategoryChange(category)}
            >
              <h3>{category}</h3>
            </div>
          ))}
        </div>

        <div className={styles.itemsContainer}>
          <div className={styles.itemsGrid}>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className={styles.itemCard}>
                  <Skeleton variant="rectangular" width={120} height={120} />
                  <div className={styles.itemInfo}>
                    <Skeleton width="80%" height={20} />
                    <Skeleton width="60%" height={20} />
                  </div>
                </div>
              ))
            ) : error ? (
              <p className={styles.error}>{error}</p>
            ) : displayedItems.length > 0 ? (
              displayedItems.map((car) => (
                <div
                  key={car.id}
                  className={styles.itemCard}
                  onClick={() => handleCarClick(car)} // 차량 클릭 시 폼으로 이동
                >
                  <img
                    src={`/images/${car.image_url}`}
                    alt={car.carModel}
                    onError={(e) => (e.currentTarget.src = "/images/default.jpg")}
                  />
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName} title={car.carModel}>
                      {car.carModel.length > 14 ? `${car.carModel.slice(0, 14)}...` : car.carModel}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>해당 카테고리에 차량이 없습니다.</p>
            )}
          </div>

          <div className={styles.pagination}>
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              이전
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cars;