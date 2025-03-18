// src/pages/admin/PartShopManagement.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const PartShopManagement: React.FC = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8094/api/admin/partshop", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setProducts(res.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <div>
      <h2>부품샵 관리</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - {product.price}원 ({product.stock}개)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PartShopManagement;
