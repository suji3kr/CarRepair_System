import React, { useState } from "react";
import { createPart } from "../services/partService";
import { Part } from "../types/part";

const PartForm: React.FC = () => {
  const [part, setPart] = useState<Part>({
    name: "",
    category: "",
    price: 0,
    stock: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPart({ ...part, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPart = await createPart(part);
    if (newPart) {
      console.log("부품 추가 성공:", newPart);
    } else {
      console.error("부품 추가 실패");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={part.name}
        onChange={handleInputChange}
        placeholder="부품 이름"
        required
      />
      <input
        type="text"
        name="category"
        value={part.category}
        onChange={handleInputChange}
        placeholder="부품 카테고리"
        required
      />
      <input
        type="number"
        name="price"
        value={part.price}
        onChange={handleInputChange}
        placeholder="부품 가격"
        required
      />
      <input
        type="number"
        name="stock"
        value={part.stock}
        onChange={handleInputChange}
        placeholder="부품 재고"
        required
      />
      <button type="submit">부품 추가</button>
    </form>
  );
};

export default PartForm;
