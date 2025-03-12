import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import styles from "../styles/Profile.module.css";
import axios from "axios";

const API_URL = "http://localhost:8094/api/users/me"; // 현재 로그인한 사용자 정보 조회 API

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{
    userId: string;
    name: string;
    email: string;
    phone: string;
    carMake?: string;
    carModel?: string;
    carNumber?: string;
    year?: string;
    vin?: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
      } catch (error) {
        console.error("프로필 정보를 불러오는 중 오류 발생:", error);
        alert("프로필 정보를 불러오지 못했습니다.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");

    alert("로그아웃되었습니다.");
    navigate("/login");
  };

  if (loading) {
    return <p className={styles.loading}>프로필 정보를 불러오는 중...</p>;
  }

  if (!user) {
    return <p className={styles.error}>프로필 정보를 불러올 수 없습니다.</p>;
  }

  return (
    <Layout>
      <div className={styles.profileContainer}>
        <h2 className={styles.profileTitle}>내 프로필</h2>

        <div className={styles.profileSection}>
          <label>아이디</label>
          <input type="text" value={user.userId} readOnly />
        </div>

        <div className={styles.profileSection}>
          <label>이름</label>
          <input type="text" value={user.name} readOnly />
        </div>

        <div className={styles.profileSection}>
          <label>이메일</label>
          <input type="email" value={user.email} readOnly />
        </div>

        <div className={styles.profileSection}>
          <label>휴대전화</label>
          <input type="tel" value={user.phone} readOnly />
        </div>

        <h3 className={styles.profileSubtitle}>차량 정보</h3>

        <div className={styles.profileSection}>
          <label>제조사</label>
          <input type="text" value={user.carMake || "미등록"} readOnly />
        </div>

        <div className={styles.profileSection}>
          <label>모델</label>
          <input type="text" value={user.carModel || "미등록"} readOnly />
        </div>

        <div className={styles.profileSection}>
          <label>차량 번호</label>
          <input type="text" value={user.carNumber || "미등록"} readOnly />
        </div>

        <div className={styles.profileSection}>
          <label>연식</label>
          <input type="text" value={user.year || "미등록"} readOnly />
        </div>

        <div className={styles.profileSection}>
          <label>차대번호 (VIN)</label>
          <input type="text" value={user.vin || "미등록"} readOnly />
        </div>

        <button className={styles.logoutButton} onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </Layout>
  );
};

export default Profile;
