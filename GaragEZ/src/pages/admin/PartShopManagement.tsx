import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Part } from "../../types/part";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from "@mui/material";

const PartShopManagement: React.FC = () => {
  const [products, setProducts] = useState<Part[]>([]);
  const [editedStock, setEditedStock] = useState<{ [key: number]: number | undefined }>({});
  const navigate = useNavigate(); // ✅ 페이지 이동을 위한 useNavigate()

  useEffect(() => {
    (async () => {
      await checkAdmin();
      fetchParts();
    })();
  }, []);

  const checkAdmin = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/check`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status !== 200) {
        throw new Error();
      }
    } catch (error: unknown) {
      console.error("🚨 관리자 접근 오류 발생:", error);
    
      let errorMessage = "🚫 관리자만 접근할 수 있습니다."; // 기본 메시지
    
      // TypeScript에서 안전하게 에러 메시지 가져오기
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
    
      // ✅ Axios 에러 처리 (응답 데이터가 객체일 경우 JSON.stringify 활용)
        if (axios.isAxiosError(error) && error.response?.data) {
          if (typeof error.response.data === "string") {
            errorMessage = error.response.data;
          } else {
            errorMessage = `⚠ 오류: 관리자가 아닙니다. 접근불가능합니다.`;
          }
        }

        alert(`⛔ ${errorMessage}`);
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

  const handleDelete = async (id: number | undefined) => {
    if (id == null) {
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
      window.alert("✅ 삭제 완료되었습니다.");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleUpdateStock = async (id: number | undefined) => {
    if (id == null) {
      alert("🚨 수정할 부품의 ID가 존재하지 않습니다.");
      return;
    }

    const product = products.find((p) => p.id === id);
    if (!product) {
      alert("❌ 해당 부품을 찾을 수 없습니다.");
      return;
    }

    const newStock = editedStock[id] ?? product.stock;
    if (isNaN(newStock) || newStock < 0) {
      alert("🚨 재고는 0 이상이어야 합니다.");
      return;
    }

    const confirmUpdate = window.confirm("🛠 정말 수정하시겠습니까?");
    if (!confirmUpdate) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/partshop/${id}`,
        {
          name: product.name, // ✅ 기존 name 값 유지 (null 방지)
          category: product.category, // ✅ 기존 category 값 유지
          price: product.price, // ✅ 기존 price 값 유지
          stock: newStock, // ✅ 새로운 stock 값 반영
        },
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );

      setProducts(products.map((p) => (p.id === id ? { ...p, stock: newStock } : p)));
      setEditedStock((prev) => {
        const updatedStock = { ...prev };
        delete updatedStock[id]; // ✅ undefined 대신 delete 사용
        return updatedStock;
      });
      window.alert("✅ 수정 완료되었습니다.");
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  return (
    <div>
      <h2>🔧 관리자 전용 - 부품샵 관리</h2>
      <p /><br />
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
                    onChange={(e) => {
                      const newStock = Number(e.target.value);
                      if (!isNaN(newStock) && newStock >= 0) {
                        setEditedStock((prev) => ({ ...prev, [product.id!]: newStock }));
                      }
                    }}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => handleUpdateStock(product.id)}
                    disabled={editedStock[product.id!] === undefined} // ✅ undefined 확인
                  >
                    수정
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(product.id)}
                    style={{ marginLeft: "5px" }}
                  >
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
