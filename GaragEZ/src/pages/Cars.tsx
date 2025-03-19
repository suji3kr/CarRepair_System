import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Car.module.css";
import Layout from "../components/Layout";
import { Skeleton } from "@mui/material";
import { Car } from "../types/car";



// API fetch function with proper typing and error handling
const fetchCars = async (carMake: string): Promise<Car[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cars?car_make=${carMake}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch cars: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : (data.cars as Car[]) || [];
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unknown error occurred");
  }
};

const categories = ["현대", "기아", "쉐보레", "쌍용"] as const;
type Category = typeof categories[number];

const ITEMS_PER_PAGE = 8;

const Cars: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<Category>("현대");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Memoized fetch function
  const loadCars = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCars(selectedCategory);
      setCars(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(`차량 데이터를 불러오는 데 실패했습니다: ${message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadCars();
  }, [loadCars]);

  const handlePageChange = (newPage: number) => {
    if (newPage !== currentPage && newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  };

  const handleCategoryChange = (category: Category) => {
    if (category !== selectedCategory) {
      setSelectedCategory(category);
      setCurrentPage(1);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  };
  const handleCarClick = (car: Car) => {
    console.log("Navigating to /contact with:", {
      carMake: car.carMake,
      carModel: car.carModel,
      carId: car.carId,
    });
    navigate("/contact", {
      state: {
        carMake: car.carMake,
        carModel: car.carModel,
        carId: car.carId,
      },
    });
  };

  const totalPages = Math.max(1, Math.ceil(cars.length / ITEMS_PER_PAGE));
  const displayedItems = cars.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.partMenu}>
          {categories.map((category) => (
            <div
              key={category}
              className={`${styles.category} ${selectedCategory === category ? styles.active : ""}`}
              onClick={() => handleCategoryChange(category)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === "Enter" && handleCategoryChange(category)}
            >
              <h3>{category}</h3>
            </div>
          ))}
        </div>

        <div className={styles.itemsContainer}>
          <div className={styles.itemsGrid}>
            {isLoading ? (
              Array.from({ length: ITEMS_PER_PAGE }, (_, index) => (
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
                  key={car.carId}
                  className={styles.itemCard}
                  onClick={() => handleCarClick(car)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => e.key === "Enter" && handleCarClick(car)}
                >
                  <img
                    src={`/images/${car.imageUrl}`}
                    alt={car.carModel}
                    onError={(e) => (e.currentTarget.src = "/images/default.jpg")}
                    loading="lazy" // Improve performance
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
              aria-label="Previous page"
            >
              이전
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              aria-label="Next page"
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