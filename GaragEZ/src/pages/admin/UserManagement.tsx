import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User } from "../../types/user";
import "../../styles/UserManagement.css"; // ✅ 스타일 추가

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await checkAdmin();
      fetchUsers();
    })();
  }, []);

  // ✅ 관리자 체크 기능 추가
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
          errorMessage = `⚠ 오류: 관리자가 아닙니다. 접근 불가능합니다.`;
        }
      }

      alert(`⛔ ${errorMessage}`);
      navigate("/home");
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get<User[]>(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setUsers(response.data);
    } catch (err) {
      console.error("🚨 회원 데이터 불러오기 실패:", err);
      setError("회원 정보를 불러오는 중 오류가 발생했습니다.");
    }
  };

  // ✅ 회원 삭제 기능
  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("이 회원을 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (err) {
      console.error("🚨 회원 삭제 실패:", err);
      alert("회원 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="user-management">
      <h2>👥 회원 관리</h2>
      {error ? (
        <p className="error-message">{error}</p>
      ) : users.length === 0 ? (
        <p>등록된 회원이 없습니다.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>아이디</th>
              <th>이름</th>
              <th>이메일</th>
              <th>전화번호</th>
              <th>권한</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.userId}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(user.id)}>
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserManagement;
