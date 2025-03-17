// src/pages/PartDetail.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { Skeleton } from "@mui/material";
import styles from "../styles/PartDetail.module.css";
import { fetchPartById } from "../services/partService";

type Part = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
};

const PartDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [part, setPart] = useState<Part | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      fetchPartById(Number(id))
        .then((data) => {
          setPart(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching part:", error);
          setIsLoading(false);
        });
    }
  }, [id]);

  // 총 가격 계산
  const totalPrice = part ? part.price * quantity : 0;

  // 수량 증가/감소 함수
  const increaseQuantity = () => {
    if (part && quantity < part.stock) setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  // 장바구니에 추가 (LocalStorage 활용)
  const addToCart = () => {
    if (!part) return;
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = existingCart.findIndex((item: Part & { quantity: number }) => item.id === part.id);
    if (existingItemIndex !== -1) {
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      existingCart.push({ ...part, quantity });
    }
    localStorage.setItem("cart", JSON.stringify(existingCart));
    alert("장바구니 담기 성공★");
    navigate("/cart");
  };

  // 결제 요청 (예시: 아직 구현 중이라 alert로 대체)
  const handlePayment = async () => {
    if (!part) return;
    // 결제 로직을 추가하세요. 예: PortOne 결제 요청 등
    alert("결제 기능은 아직 구현 중입니다.");
  };

  return (
    <Layout>
      <div className={styles.container}>
        {/* 상품 이미지 영역: 로컬 이미지 사용 */}
        <div className={styles.imageContainer}>
          {isLoading ? (
            <Skeleton variant="rectangular" width={400} height={300} />
          ) : (
            <img
              src={`/images/${part?.imageUrl}`}
              alt={part?.name}
              className={styles.productImage}
            />
          )}
        </div>

        {/* 상품 정보 영역 */}
        <div className={styles.productInfo}>
          {isLoading ? (
            <>
              <Skeleton width="80%" height={30} />
              <Skeleton width="60%" height={20} />
              <Skeleton width="50%" height={20} />
              <Skeleton width="40%" height={20} />
            </>
          ) : (
            <>
              <h2>{part?.name}</h2>
              <p className={styles.category}>카테고리: {part?.category}</p>
              <p className={styles.stock}>재고: {part?.stock}개</p>
              <p className={styles.price}>
                가격: <strong>{part?.price}원</strong>
              </p>
            </>
          )}

          {/* 수량 조절 */}
          <div className={styles.quantityContainer}>
            <button onClick={decreaseQuantity} disabled={quantity === 1}>-</button>
            <span>{quantity}</span>
            <button onClick={increaseQuantity} disabled={part ? part.stock === quantity : false}>+</button>
          </div>

          {/* 총 가격 표시 */}
          <div className={styles.totalPriceContainer}>
            <span className={styles.totalLabel}>총 상품금액</span>
            {isLoading ? (
              <Skeleton width={80} height={30} />
            ) : (
              <span className={styles.totalPrice}>{totalPrice.toLocaleString()}원</span>
            )}
          </div>

          {/* 버튼 영역 */}
          <div className={styles.buttonContainer}>
            <button className={styles.cartButton} onClick={addToCart}>장바구니</button>
            <button className={styles.buyButton} onClick={handlePayment}>구매하기</button>
          </div>
        </div>
      </div>

      {/* 상세 정보 섹션 */}
      <div className={styles.detailSection}>
        <h3>상품 상세 정보</h3>
        {isLoading ? (
          <Skeleton variant="rectangular" width="100%" height={150} />
        ) : (
          <p>상품에 대한 상세 설명을 여기에 추가하세요.</p>
        )}
      </div>
    </Layout>
  );
};

export default PartDetail;
