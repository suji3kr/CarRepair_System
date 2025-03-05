// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom"; // URL에서 상품 ID 가져오기
// import PortOne from "@portone/browser-sdk/v2"; // ✅ PortOne 추가
// import { fetchPartById } from "../services/partService";
// import Layout from "../components/Layout";
// import { Skeleton } from "@mui/material"; // ✅ MUI Skeleton 추가
// import styles from "../styles/PartDetail.module.css"; // ✅ 스타일 파일 적용

// type Part = {
//   id: number;
//   name: string;
//   category: string;
//   price: number;
//   stock: number;
// };

// const PartDetail: React.FC = () => {
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>(); // URL에서 상품 ID 가져오기
//   const [part, setPart] = useState<Part | null>(null);
//   const [quantity, setQuantity] = useState<number>(1);
//   const [isLoading, setIsLoading] = useState<boolean>(true);

//   useEffect(() => {
//     if (id) {
//       fetchPartById(Number(id)).then((data) => {
//         setPart(data);
//         setIsLoading(false);
//       });
//     }
//   }, [id]);

//   // ✅ 총 가격 계산
//   const totalPrice = part ? part.price * quantity : 0;

//   // ✅ 수량 증가
//   const increaseQuantity = () => {
//     if (part && quantity < part.stock) setQuantity(quantity + 1);
//   };

//   // ✅ 수량 감소
//   const decreaseQuantity = () => {
//     if (quantity > 1) setQuantity(quantity - 1);
//   };

//   // ✅ 장바구니에 추가 (LocalStorage 활용)
//   const addToCart = () => {
//     if (!part) return;

//     const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
//     const existingItemIndex = existingCart.findIndex((item: Part & { quantity: number }) => item.id === part.id);

//     if (existingItemIndex !== -1) {
//       existingCart[existingItemIndex].quantity += quantity;
//     } else {
//       existingCart.push({ ...part, quantity });
//     }

//     localStorage.setItem("cart", JSON.stringify(existingCart));
//     alert("장바구니 담기 성공★");
//     navigate("/cart");
//   };

//   // ✅ 랜덤 결제 ID 생성
//   function randomId() {
//     return [...crypto.getRandomValues(new Uint32Array(2))]
//       .map((word) => word.toString(16).padStart(8, "0"))
//       .join("");
//   }

//   // ✅ PortOne 결제 요청
//   const handlePayment = async () => {
//     if (!part) return;

//     const paymentId = randomId();
//     const payment = await PortOne.requestPayment({
//       storeId: "store-c04a460a-d3a1-4d5b-a758-620a0019d398",
//       channelKey: "channel-key-9b50a96f-1e67-41c2-81b3-1600e73d2a31",
//       paymentId,
//       orderName: part.name,
//       totalAmount: totalPrice,
//       currency: "KRW",
//       payMethod: "CARD",
//       customData: {
//         id: part.id,
//         name: part.name,
//         quantity,
//       },
//     });

//     if (payment.code !== undefined) {
//       alert(`결제 실패: ${payment.message}`);
//       return;
//     }

//     // ✅ 백엔드 결제 검증 요청
//     const completeResponse = await fetch("/api/payment/complete", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ paymentId: payment.paymentId }),
//     });

//     if (completeResponse.ok) {
//       alert("결제가 완료되었습니다.");
//       navigate("/"); // 결제 완료 후 홈으로 이동
//     } else {
//       alert(`결제 검증 실패: ${await completeResponse.text()}`);
//     }
//   };

//   return (
//     <Layout>
//       <div className={styles.container}>
//         {/* ✅ 상품 이미지 영역 */}
//         <div className={styles.imageContainer}>
//           {isLoading ? (
//             <Skeleton variant="rectangular" width={400} height={300} />
//           ) : (
//             <img
//               src={`https://picsum.photos/400/300?random=${part?.id}`}
//               alt={part?.name}
//             />
//           )}
//         </div>

//         {/* ✅ 상품 정보 영역 */}
//         <div className={styles.productInfo}>
//           {isLoading ? (
//             <>
//               <Skeleton width="80%" height={30} />
//               <Skeleton width="60%" height={20} />
//               <Skeleton width="50%" height={20} />
//               <Skeleton width="40%" height={20} />
//             </>
//           ) : (
//             <>
//               <h2>{part?.name}</h2>
//               <p className={styles.category}>카테고리: {part?.category}</p>
//               <p className={styles.stock}>재고: {part?.stock}개</p>
//               <p className={styles.price}>
//                 가격: <strong>{part?.price}원</strong>
//               </p>
//             </>
//           )}

//           {/* ✅ 수량 조절 */}
//           <div className={styles.quantityContainer}>
//             <button onClick={decreaseQuantity} disabled={quantity === 1}>-</button>
//             <span>{quantity}</span>
//             <button onClick={increaseQuantity} disabled={part?.stock === quantity}>+</button>
//           </div>

//           {/* ✅ 총 가격 */}
//           <div className={styles.totalPriceContainer}>
//             <span className={styles.totalLabel}>총 상품금액</span>
//             {isLoading ? (
//               <Skeleton width={80} height={30} />
//             ) : (
//               <span className={styles.totalPrice}>{totalPrice.toLocaleString()}원</span>
//             )}
//           </div>

//           {/* ✅ 버튼 영역 */}
//           <div className={styles.buttonContainer}>
//             {isLoading ? (
//               <>
//                 <Skeleton width="40%" height={50} />
//                 <Skeleton width="40%" height={50} />
//               </>
//             ) : (
//               <>
//                 <button className={styles.cartButton} onClick={addToCart}>장바구니</button>
//                 <button className={styles.buyButton} onClick={handlePayment}>
//                   구매하기
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ✅ 상세 정보 추가 (아래쪽 여백) */}
//       <div className={styles.detailSection}>
//         <h3>상품 상세 정보</h3>
//         {isLoading ? (
//           <Skeleton variant="rectangular" width="100%" height={150} />
//         ) : (
//           <p>여기에 상품의 상세 설명을 추가하세요.</p>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default PartDetail;
//위에꺼는 빽 검증 코드

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PortOne from "@portone/browser-sdk/v2";
import { fetchPartById } from "../services/partService";
import Layout from "../components/Layout";
import { Skeleton } from "@mui/material";
import styles from "../styles/PartDetail.module.css";

type Part = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
};

const PartDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [part, setPart] = useState<Part | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      fetchPartById(Number(id)).then((data) => {
        setPart(data);
        setIsLoading(false);
      });
    }
  }, [id]);

  // 총 가격 계산
  const totalPrice = part ? part.price * quantity : 0;

  // 수량 증가
  const increaseQuantity = () => {
    if (part && quantity < part.stock) setQuantity(quantity + 1);
  };

  // 수량 감소
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

  // 랜덤 결제 ID 생성
  function randomId() {
    return [...crypto.getRandomValues(new Uint32Array(2))]
      .map((word) => word.toString(16).padStart(8, "0"))
      .join("");
  }

  // PortOne 결제 요청
  const handlePayment = async () => {
    if (!part) return;

    try {
      const paymentId = randomId();
      const payment = await PortOne.requestPayment({
        storeId: "store-c04a460a-d3a1-4d5b-a758-620a0019d398",
        channelKey: "channel-key-9b50a96f-1e67-41c2-81b3-1600e73d2a31",
        paymentId,
        orderName: part.name,
        totalAmount: totalPrice,
        currency: "KRW",
        payMethod: "CARD",
        customData: {
          id: part.id,
          name: part.name,
          quantity,
        },
      });

      if (payment.code !== undefined) {
        alert(`결제 실패: ${payment.message}`);
        return;
      }

      // 결제 성공 처리
      alert("결제가 완료되었습니다.");
      navigate("/partshop"); // 결제 완료 후 홈으로 이동

    } catch (error) {
      alert(`결제 중 오류 발생: ${error}`);
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        {/* 상품 이미지 영역 */}
        <div className={styles.imageContainer}>
          {isLoading ? (
            <Skeleton variant="rectangular" width={400} height={300} />
          ) : (
            <img
              src={`https://picsum.photos/400/300?random=${part?.id}`}
              alt={part?.name}
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
            <button onClick={increaseQuantity} disabled={part?.stock === quantity}>+</button>
          </div>

          {/* 총 가격 */}
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
            {isLoading ? (
              <>
                <Skeleton width="40%" height={50} />
                <Skeleton width="40%" height={50} />
              </>
            ) : (
              <>
                <button className={styles.cartButton} onClick={addToCart}>장바구니</button>
                <button className={styles.buyButton} onClick={handlePayment}>
                  구매하기
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 상세 정보 추가 (아래쪽 여백) */}
      <div className={styles.detailSection}>
        <h3>상품 상세 정보</h3>
        {isLoading ? (
          <Skeleton variant="rectangular" width="100%" height={150} />
        ) : (
          <p>여기에 상품의 상세 설명을 추가하세요.</p>
        )}
      </div>
    </Layout>
  );
};

export default PartDetail;