// src/pages/admin/PartShopManagement.tsx
import React, { useEffect, useState } from "react";

const PartShopManagement: React.FC = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/partshop`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <div>
      <h2>부품샵 관리</h2>
      <ul>
        {products.map((product, index) => (
          <li key={index}>{product.name} - {product.price}원</li>
        ))}
      </ul>
    </div>
  );
};

export default PartShopManagement;
