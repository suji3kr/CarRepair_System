import React, { useEffect, useState } from "react";
import PortOne from "@portone/browser-sdk/v2";
import styles from "../styles/Cart.module.css";
import Layout from "../components/Layout";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  checked?: boolean;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
  const [paymentStatus, setPaymentStatus] = useState({ status: "IDLE", message: "" });

  // ✅ 장바구니 데이터 불러오기
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
  }, []);

  // ✅ 체크박스 변경 핸들러
  const handleCheckboxChange = (id: number) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );

    setCartItems(updatedItems);
    setSelectedItems(updatedItems.filter((item) => item.checked));
  };

  // ✅ 전체 선택 / 해제 기능
  const handleSelectAll = () => {
    const allChecked = cartItems.every((item) => item.checked);
    const updatedItems = cartItems.map((item) => ({ ...item, checked: !allChecked }));

    setCartItems(updatedItems);
    setSelectedItems(!allChecked ? updatedItems : []);
  };

  // ✅ 상품 삭제 기능
  const handleDelete = (id: number) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
  };

  // ✅ 수량 증가 (선택된 항목 업데이트 반영)
  const increaseQuantity = (id: number) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );

    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    setSelectedItems(updatedItems.filter((item) => item.checked));
  };

  // ✅ 수량 감소 (선택된 항목 업데이트 반영)
  const decreaseQuantity = (id: number) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    );

    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    setSelectedItems(updatedItems.filter((item) => item.checked));
  };

  // ✅ 랜덤 결제 ID 생성
  function randomId() {
    return [...crypto.getRandomValues(new Uint32Array(2))]
      .map((word) => word.toString(16).padStart(8, "0"))
      .join("");
  }

  // Cart.tsx
interface PaymentResponse {
  message?: string;
  [key: string]: any; // 추가 필드 허용
}

const handlePayment = async (isAll: boolean) => {
  const items = isAll ? cartItems : selectedItems;

  if (items.length === 0) {
    alert("결제할 상품이 없습니다.");
    return;
  }

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderName = items.map((item) => item.name).join(", ");

  setPaymentStatus({ status: "PENDING", message: "" });

  const paymentId = randomId();
  const payment = await PortOne.requestPayment({
    storeId: "store-c04a460a-d3a1-4d5b-a758-620a0019d398",
    channelKey: "channel-key-9b50a96f-1e67-41c2-81b3-1600e73d2a31",
    paymentId,
    orderName: orderName.length > 50 ? orderName.slice(0, 50) + "..." : orderName,
    totalAmount,
    currency: "KRW",
    payMethod: "CARD",
    customData: {
      items: items.map((item) => ({ id: item.id, name: item.name, quantity: item.quantity })),
    },
  });

  console.log("PortOne Payment Response:", payment);
  if (payment.code !== undefined) {
    alert(`결제 실패: ${payment.message}`);
    return;
  }

  const paymentData = {
    paymentId: payment.paymentId,
    totalAmount,
    items: items.map((item) => ({ id: item.id, name: item.name, quantity: item.quantity })),
  };
  console.log("Request Data:", paymentData);

  try {
    const completeResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    });

    const responseText = await completeResponse.text();
    console.log("Raw Response:", responseText);

    let responseData: PaymentResponse | string;
    try {
      responseData = JSON.parse(responseText) as PaymentResponse;
    } catch (e) {
      responseData = responseText; // JSON 파싱 실패 시 텍스트로 처리
    }

    console.log("Parsed Response:", responseData);

    if (completeResponse.ok) {
      alert("결제가 완료되었습니다.");
      setCartItems([]);
      localStorage.removeItem("cart");
    } else {
      const errorMessage = typeof responseData === "object" && responseData.message ? responseData.message : responseData;
      alert(`결제 검증 실패: ${errorMessage}`);
      console.error("Payment Verification Error:", responseData);
    }
  } catch (error) {
    alert("결제 요청 중 오류가 발생했습니다.");
    console.error("Fetch Error:", error);
  }
};
    // ✅ 총 가격 계산 함수
    const calculateTotal = (items: CartItem[]) =>
      items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Layout>
      <div className={styles.cartContainer}>
        <h2 className={styles.cartTitle}>장바구니</h2>
        <hr className={styles.divider} />

        <div className={styles.cartContent}>
          {cartItems.length === 0 ? (
            <p className={styles.emptyCart}>장바구니가 비어 있습니다.</p>
          ) : (
            <>
              {/* ✅ 전체 선택 버튼 */}
              <div className={styles.selectAllContainer}>
                <input type="checkbox" onChange={handleSelectAll} checked={cartItems.every((item) => item.checked)} />
                <label>전체 선택</label>
              </div>

              <div className={styles.cartList}>
                {cartItems.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <input
                      type="checkbox"
                      checked={item.checked || false}
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                    <p>{item.name}</p>
                    <p>{item.price.toLocaleString()}원</p>

                    <div className={styles.quantityControls}>
                      <button onClick={() => decreaseQuantity(item.id)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increaseQuantity(item.id)}>+</button>
                    </div>

                    <button className={styles.deleteButton} onClick={() => handleDelete(item.id)}>
                      삭제
                    </button>
                  </div>
                ))}
              </div>
              {/* ✅ 총 가격 표시 */}
              <br></br>
              <br></br>
         <div className={styles.priceSummary}>
          <h3>총 결제 금액</h3>
          <p>선택한 상품 합계: <strong>{calculateTotal(selectedItems).toLocaleString()}원</strong></p>
          <p>전체 상품 합계: <strong>{calculateTotal(cartItems).toLocaleString()}원</strong></p>
        </div>
            </>
          )}
          
        </div>
         

        {/* ✅ 주문 버튼 */}
        <div className={styles.orderButtons}>
          <button
            className={styles.selectedOrderButton}
            disabled={selectedItems.length === 0}
            onClick={() => handlePayment(false)}
          >
            선택상품주문
          </button>
          <button
            className={styles.allOrderButton}
            disabled={cartItems.length === 0}
            onClick={() => handlePayment(true)}
          >
            전체상품주문
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;


