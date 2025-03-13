import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import styles from "../styles/Profile.module.css";
import axios from "axios";
import { UserProfile } from "../types/user"; // ✅ 분리된 타입 가져오기

const API_URL = "http://localhost:8094/api/users/me";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
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
        const response = await axios.get<UserProfile>(API_URL, {
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
          <input type="text" value={user.vehicle?.carMake || "미등록"} readOnly />
        </div>

        <div className={styles.profileSection}>
          <label>모델</label>
          <input type="text" value={user.vehicle?.carModel || "미등록"} readOnly />
        </div>

        <div className={styles.profileSection}>
          <label>차량 번호</label>
          <input type="text" value={user.vehicle?.carNumber || "미등록"} readOnly />
        </div>

        <div className={styles.profileSection}>
          <label>연식</label>
          <input type="text" value={user.vehicle?.year?.toString() || "미등록"} readOnly />
        </div>

        <div className={styles.profileSection}>
          <label>차대번호 (VIN)</label>
          <input type="text" value={user.vehicle?.vin || "미등록"} readOnly />
        </div>

        {/* 공동 소유 정보 추가 */}
        {user.vehicle?.coOwner && (
          <>
            <h3 className={styles.profileSubtitle}>공동 소유 정보</h3>
            <div className={styles.profileSection}>
              <label>공동 소유주 이름</label>
              <input type="text" value={user.vehicle?.coOwnerName || "미등록"} readOnly />
            </div>
            <div className={styles.profileSection}>
              <label>공동 소유주 연락처</label>
              <input type="text" value={user.vehicle?.coOwnerPhone || "미등록"} readOnly />
            </div>
          </>
        )}

        <button className={styles.logoutButton} onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </Layout>
  );
};

export default Profile;
