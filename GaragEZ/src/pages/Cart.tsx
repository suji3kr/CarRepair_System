// import React, { useEffect, useState } from "react";
// import PortOne from "@portone/browser-sdk/v2";
// import styles from "../styles/Cart.module.css";
// import Layout from "../components/Layout";

// interface CartItem {
//   id: number;
//   name: string;
//   price: number;
//   quantity: number;
//   checked?: boolean;
// }

// const Cart: React.FC = () => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
//   const [paymentStatus, setPaymentStatus] = useState({ status: "IDLE", message: "" });

//   // ✅ 장바구니 데이터 불러오기
//   useEffect(() => {
//     const cart = JSON.parse(localStorage.getItem("cart") || "[]");
//     setCartItems(cart);
//   }, []);

//   // ✅ 체크박스 변경 핸들러
//   const handleCheckboxChange = (id: number) => {
//     const updatedItems = cartItems.map((item) =>
//       item.id === id ? { ...item, checked: !item.checked } : item
//     );

//     setCartItems(updatedItems);
//     setSelectedItems(updatedItems.filter((item) => item.checked));
//   };

//   // ✅ 전체 선택 / 해제 기능
//   const handleSelectAll = () => {
//     const allChecked = cartItems.every((item) => item.checked);
//     const updatedItems = cartItems.map((item) => ({ ...item, checked: !allChecked }));

//     setCartItems(updatedItems);
//     setSelectedItems(!allChecked ? updatedItems : []);
//   };

//   // ✅ 상품 삭제 기능
//   const handleDelete = (id: number) => {
//     const updatedItems = cartItems.filter((item) => item.id !== id);
//     setCartItems(updatedItems);
//     localStorage.setItem("cart", JSON.stringify(updatedItems));
//   };

//   // ✅ 수량 증가 (선택된 항목 업데이트 반영)
//   const increaseQuantity = (id: number) => {
//     const updatedItems = cartItems.map((item) =>
//       item.id === id ? { ...item, quantity: item.quantity + 1 } : item
//     );

//     setCartItems(updatedItems);
//     localStorage.setItem("cart", JSON.stringify(updatedItems));
//     setSelectedItems(updatedItems.filter((item) => item.checked));
//   };

//   // ✅ 수량 감소 (선택된 항목 업데이트 반영)
//   const decreaseQuantity = (id: number) => {
//     const updatedItems = cartItems.map((item) =>
//       item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
//     );

//     setCartItems(updatedItems);
//     localStorage.setItem("cart", JSON.stringify(updatedItems));
//     setSelectedItems(updatedItems.filter((item) => item.checked));
//   };

//   // ✅ 랜덤 결제 ID 생성
//   function randomId() {
//     return [...crypto.getRandomValues(new Uint32Array(2))]
//       .map((word) => word.toString(16).padStart(8, "0"))
//       .join("");
//   }

//   // ✅ 결제 처리 함수 (선택한 상품 or 전체 상품)
//   const handlePayment = async (isAll: boolean) => {
//     const items = isAll ? cartItems : selectedItems;

//     if (items.length === 0) {
//       alert("결제할 상품이 없습니다.");
//       return;
//     }

//     const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
//     const orderName = items.map((item) => item.name).join(", ");

    

//     setPaymentStatus({ status: "PENDING", message: "" });

//     const paymentId = randomId();
//     const payment = await PortOne.requestPayment({
//       storeId: "store-c04a460a-d3a1-4d5b-a758-620a0019d398",
//       channelKey: "channel-key-9b50a96f-1e67-41c2-81b3-1600e73d2a31",
//       paymentId,
//       orderName: orderName.length > 50 ? orderName.slice(0, 50) + "..." : orderName, // 상품명 길이 제한
//       totalAmount,
//       currency: "KRW",
//       payMethod: "CARD",
//       customData: {
//         items: items.map((item) => ({ id: item.id, name: item.name, quantity: item.quantity })),
//       },
//     });

//     if (payment.code !== undefined) {
//       alert(`결제 실패: ${payment.message}`);
//       return;
//     }

//  // ✅ 백엔드 결제 검증 요청
//  const completeResponse = await fetch("/api/payment/complete", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ 
//     paymentId: payment.paymentId,
//     totalAmount,
//     items: items.map((item) => ({ id: item.id, name: item.name, quantity: item.quantity }))
//   }),
// });

// const responseData = await completeResponse.text();
// console.log('Payment Verification Response:', responseData);

// if (completeResponse.ok) {
//   alert("결제가 완료되었습니다.");
//   setCartItems([]); // 장바구니 비우기
//   localStorage.removeItem("cart");
// } else {
//   alert(`결제 검증 실패: ${responseData}`);
//   console.error('Payment Verification Error:', responseData);
// }
// };
//     // ✅ 총 가격 계산 함수
//     const calculateTotal = (items: CartItem[]) =>
//       items.reduce((sum, item) => sum + item.price * item.quantity, 0);

//   return (
//     <Layout>
//       <div className={styles.cartContainer}>
//         <h2 className={styles.cartTitle}>장바구니</h2>
//         <hr className={styles.divider} />

//         <div className={styles.cartContent}>
//           {cartItems.length === 0 ? (
//             <p className={styles.emptyCart}>장바구니가 비어 있습니다.</p>
//           ) : (
//             <>
//               {/* ✅ 전체 선택 버튼 */}
//               <div className={styles.selectAllContainer}>
//                 <input type="checkbox" onChange={handleSelectAll} checked={cartItems.every((item) => item.checked)} />
//                 <label>전체 선택</label>
//               </div>

//               <div className={styles.cartList}>
//                 {cartItems.map((item) => (
//                   <div key={item.id} className={styles.cartItem}>
//                     <input
//                       type="checkbox"
//                       checked={item.checked || false}
//                       onChange={() => handleCheckboxChange(item.id)}
//                     />
//                     <p>{item.name}</p>
//                     <p>{item.price.toLocaleString()}원</p>

//                     <div className={styles.quantityControls}>
//                       <button onClick={() => decreaseQuantity(item.id)}>-</button>
//                       <span>{item.quantity}</span>
//                       <button onClick={() => increaseQuantity(item.id)}>+</button>
//                     </div>

//                     <button className={styles.deleteButton} onClick={() => handleDelete(item.id)}>
//                       삭제
//                     </button>
//                   </div>
//                 ))}
//               </div>
//               {/* ✅ 총 가격 표시 */}
//               <br></br>
//               <br></br>
//          <div className={styles.priceSummary}>
//           <h3>총 결제 금액</h3>
//           <p>선택한 상품 합계: <strong>{calculateTotal(selectedItems).toLocaleString()}원</strong></p>
//           <p>전체 상품 합계: <strong>{calculateTotal(cartItems).toLocaleString()}원</strong></p>
//         </div>
//             </>
//           )}
          
//         </div>
         

//         {/* ✅ 주문 버튼 */}
//         <div className={styles.orderButtons}>
//           <button
//             className={styles.selectedOrderButton}
//             disabled={selectedItems.length === 0}
//             onClick={() => handlePayment(false)}
//           >
//             선택상품주문
//           </button>
//           <button
//             className={styles.allOrderButton}
//             disabled={cartItems.length === 0}
//             onClick={() => handlePayment(true)}
//           >
//             전체상품주문
//           </button>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Cart;
//빽단검증용 코드

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

  // 장바구니 데이터 불러오기
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
  }, []);

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (id: number) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );

    setCartItems(updatedItems);
    setSelectedItems(updatedItems.filter((item) => item.checked));
  };

  // 전체 선택 / 해제 기능
  const handleSelectAll = () => {
    const allChecked = cartItems.every((item) => item.checked);
    const updatedItems = cartItems.map((item) => ({ ...item, checked: !allChecked }));

    setCartItems(updatedItems);
    setSelectedItems(!allChecked ? updatedItems : []);
  };

  // 상품 삭제 기능
  const handleDelete = (id: number) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
  };

  // 수량 증가
  const increaseQuantity = (id: number) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );

    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    setSelectedItems(updatedItems.filter((item) => item.checked));
  };

  // 수량 감소
  const decreaseQuantity = (id: number) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    );

    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    setSelectedItems(updatedItems.filter((item) => item.checked));
  };

  // 랜덤 결제 ID 생성
  function randomId() {
    return [...crypto.getRandomValues(new Uint32Array(2))]
      .map((word) => word.toString(16).padStart(8, "0"))
      .join("");
  }

  // 결제 처리 함수 (선택한 상품 or 전체 상품)
  const handlePayment = async (isAll: boolean) => {
    const items = isAll ? cartItems : selectedItems;

    if (items.length === 0) {
      alert("결제할 상품이 없습니다.");
      return;
    }

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderName = items.map((item) => item.name).join(", ");

    setPaymentStatus({ status: "PENDING", message: "" });

    try {
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

      if (payment.code !== undefined) {
        alert(`결제 실패: ${payment.message}`);
        return;
      }

      // 결제 성공 처리
      alert("결제가 완료되었습니다.");
      
      // 결제된 상품 장바구니에서 제거
      const remainingItems = isAll ? [] : cartItems.filter(item => !selectedItems.includes(item));
      
      setCartItems(remainingItems);
      localStorage.setItem("cart", JSON.stringify(remainingItems));
      setSelectedItems([]);

    } catch (error) {
      alert(`결제 중 오류 발생: ${error}`);
    }
  };

  // 총 가격 계산 함수
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
              <div className={styles.selectAllContainer}>
                <input 
                  type="checkbox" 
                  onChange={handleSelectAll} 
                  checked={cartItems.length > 0 && cartItems.every((item) => item.checked)} 
                />
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

              <div className={styles.priceSummary}>
                <br></br>
                <h3>총 결제 금액</h3>
                <p>선택한 상품 합계: <strong>{calculateTotal(selectedItems).toLocaleString()}원</strong></p>
                <p>전체 상품 합계: <strong>{calculateTotal(cartItems).toLocaleString()}원</strong></p>
              </div>
            </>
          )}
        </div>

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