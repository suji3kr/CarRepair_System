import React, { useEffect, useState } from "react";
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
    const updatedItems = cartItems.map((item) => ({
      ...item,
      checked: !allChecked,
    }));

    setCartItems(updatedItems);
    setSelectedItems(!allChecked ? updatedItems : []);
  };

  // ✅ 상품 삭제 기능
  const handleDelete = (id: number) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
  };

  // ✅ 수량 증가
  const increaseQuantity = (id: number) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );

    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
  };

  // ✅ 수량 감소
  const decreaseQuantity = (id: number) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    );

    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
  };

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
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={cartItems.every((item) => item.checked)}
                />
                <label>전체 선택</label>
              </div>

              <div className={styles.cartList}>
                {cartItems.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    {/* ✅ 개별 체크박스 */}
                    <input
                      type="checkbox"
                      checked={item.checked || false}
                      onChange={() => handleCheckboxChange(item.id)}
                    />

                    <p>{item.name}</p>
                    <p>{item.price.toLocaleString()}원</p>

                    {/* ✅ 수량 조절 */}
                    <div className={styles.quantityControls}>
                      <button onClick={() => decreaseQuantity(item.id)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increaseQuantity(item.id)}>+</button>
                    </div>

                    {/* ✅ 삭제 버튼 */}
                    <button className={styles.deleteButton} onClick={() => handleDelete(item.id)}>
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ✅ 주문 버튼 */}
        <div className={styles.orderButtons}>
          <button
            className={styles.selectedOrderButton}
            disabled={selectedItems.length === 0}
            onClick={() => alert(`${selectedItems.length}개 상품 주문`)}
          >
            선택상품주문
          </button>
          <button
            className={styles.allOrderButton}
            disabled={cartItems.length === 0}
            onClick={() => alert("전체 상품 주문")}
          >
            전체상품주문
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
