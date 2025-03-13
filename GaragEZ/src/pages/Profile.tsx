// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import styles from "../styles/Profile.module.css";
import { fetchUserProfile, updateUserProfile } from "../services/userService"; // updateUserProfile 추가
import VehicleList from "../components/VehicleList";
import { UserWithVehicles } from "../types/user";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserWithVehicles | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false); // 편집 모드 상태 추가
  const [formData, setFormData] = useState<UserWithVehicles | null>(null); // 수정할 데이터 상태

  useEffect(() => {
    const loadUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      try {
        const userProfile = await fetchUserProfile(token);
        console.log("🚀 사용자 데이터 확인:", userProfile);
        setUser(userProfile);
        setFormData(userProfile); // 초기 formData 설정
      } catch (error) {
        console.error("프로필 정보를 불러오는 중 오류 발생:", error);
        alert("프로필 정보를 불러오지 못했습니다.");
        navigate("/main");
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    alert("로그아웃되었습니다.");
    navigate("/login");
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (editMode && formData) {
      // 편집 모드 종료 시 저장 로직
      saveProfile();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const saveProfile = async () => {
    if (!formData) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const updatedProfile = await updateUserProfile(token, formData); // API 호출로 수정된 데이터 저장
      setUser(updatedProfile); // 성공 시 사용자 데이터 업데이트
      alert("프로필이 성공적으로 수정되었습니다.");
    } catch (error) {
      console.error("프로필 수정 중 오류 발생:", error);
      alert("프로필 수정에 실패했습니다.");
    }
  };

  if (loading) {
    return <p className={styles.loading}>프로필 정보를 불러오는 중...</p>;
  }

  if (!user || !formData) {
    return <p className={styles.error}>프로필 정보를 불러올 수 없습니다.</p>;
  }
  console.log("현재 user 상태:", user);

  return (
    <Layout>
      <div className={styles.profileContainer}>
        <h2 className={styles.profileTitle}>내 프로필</h2>

        <div className={styles.profileSection}>
          <label>아이디</label>
          <input
            type="text"
            name="userId"
            value={formData.userId}
            readOnly
          />
        </div>

        <div className={styles.profileSection}>
          <label>이름</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            readOnly={!editMode}
          />
        </div>

        <div className={styles.profileSection}>
          <label>이메일</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            readOnly={!editMode}
          />
        </div>

        <div className={styles.profileSection}>
          <label>휴대전화</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            readOnly={!editMode}
          />
        </div>

        <VehicleList vehicles={user.vehicles} />

        <div className={styles.buttonContainer}>
          <button className={styles.editButton} onClick={handleEditToggle}>
            {editMode ? "저장" : "수정하기"}
          </button>
          <button className={styles.logoutButton} onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;