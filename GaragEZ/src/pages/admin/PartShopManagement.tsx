import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Part } from "../../types/part";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from "@mui/material";
import "../../styles/partManagement.css"; // ✅ CSS 추가

const PartShopManagement: React.FC = () => {
  const [products, setProducts] = useState<Part[]>([]);
  const [editedStock, setEditedStock] = useState<{ [key: number]: number | undefined }>({});
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await checkAdmin();
      fetchParts();
    })();
  }, []);

  const checkAdmin = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/check`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("🚨 관리자 접근 오류 발생:", error);
      alert("⛔ 관리자 권한이 없습니다.");
      navigate("/home");
    }
  };

  const fetchParts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get<Part[]>(`${import.meta.env.VITE_API_URL}/api/admin/partshop`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) {
      alert("🚨 삭제할 부품의 ID가 존재하지 않습니다.");
      return;
    }

    const confirmDelete = window.confirm("🔴 정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/partshop/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(products.filter((product) => product.id !== id));
      alert("✅ 삭제 완료되었습니다.");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleUpdateStock = async (id?: number) => {
    if (!id) {
      alert("🚨 수정할 부품의 ID가 존재하지 않습니다.");
      return;
    }

    const product = products.find((p) => p.id === id);
    if (!product) {
      alert("❌ 해당 부품을 찾을 수 없습니다.");
      return;
    }

    const newStock = editedStock[id] ?? product.stock; // ✅ 기존 값 유지

    if (isNaN(newStock) || newStock < 0) {
      alert("🚨 재고는 0 이상이어야 합니다.");
      return;
    }

    const confirmUpdate = window.confirm("🛠 정말 수정하시겠습니까?");
    if (!confirmUpdate) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/partshop/${id}/stock`, // ✅ API 경로 수정
        { stock: newStock }, // ✅ 기존 데이터 유지 필요 없음
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );

      setProducts(products.map((p) => (p.id === id ? { ...p, stock: newStock } : p)));
      setEditedStock((prev) => {
        const updatedStock = { ...prev };
        delete updatedStock[id]; // ✅ undefined 대신 delete 사용
        return updatedStock;
      });
      alert("✅ 수정 완료되었습니다.");
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  return (
    <div className="partlist">
      <h2>🔧 관리자 전용 - 부품샵 관리</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>부품명</TableCell>
              <TableCell>카테고리</TableCell>
              <TableCell>가격</TableCell>
              <TableCell>재고</TableCell>
              <TableCell>관리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.price}원</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={editedStock[product.id!] ?? product.stock}
                    onChange={(e) => setEditedStock({ ...editedStock, [product.id!]: Number(e.target.value) })}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="secondary" onClick={() => handleUpdateStock(product.id)}>
                    수정
                  </Button>
                  <Button variant="contained" color="error" onClick={() => handleDelete(product.id)}>
                    삭제
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PartShopManagement;
