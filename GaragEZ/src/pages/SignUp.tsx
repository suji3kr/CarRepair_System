import { useRef, useState } from "react";
import Layout from "../components/Layout";
import styles from "../styles/SignUp.module.css"; // CSS Modules 사용
import { FormData } from "../types/Signup";
import agreement from '../text/agreement.txt?raw';
import axios from "axios"; // axios 추가

const API_URL = "http://localhost:8094/api/users/signup"; // Spring Boot API 엔드포인트 (필요에 따라 수정)

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    user_id: "",
    password: "",
    name: "",
    email: "",
    phone: "",
    carMake: "",
    carModel: "",
    carNumber: "",
    year: "",
    vin: "",
    coOwner: false,
    coOwnerName: "",
    coOwnerPhone: "",
    termsAgreed: false,
  });

  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const termsRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 스크롤 이벤트 감지
  const handleScroll = () => {
    if (termsRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = termsRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setIsScrolledToBottom(true);
      }
    }
  };

  // Spring Boot API로 회원가입 데이터 전송
  const signUp = async (data: FormData) => {
    try {
      const response = await axios.post(API_URL, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("회원가입 성공:", response.data); // 응답 확인
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("회원가입 실패:", error.response?.data || error.message);
      } else {
        console.error("알 수 없는 에러:", error);
      }
      throw error;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsAgreed) {
      alert("약관에 동의해야 합니다.");
      return;
    }
  
    try {
      await signUp(formData);
      console.log("회원가입 정보:", formData);
      alert("회원가입이 완료되었습니다!");
      // window.location.href = "/login"; // 리다이렉션 추가 가능
    } catch (error) {
      alert("회원가입 중 오류가 발생했습니다: " + (error.response?.data?.message || "서버 오류"));
    }
  };

  return (
    <Layout>
      <div className={styles.signupContainer}>
        <h2 className={styles.signupTitle}>회원가입</h2>
        <p className={styles.signupDescription}>방문해주셔서 감사합니다.</p>

        <form onSubmit={handleSubmit} className={styles.signupForm}>
          <div className={styles.signupFormGroup}>
            <label>아이디</label>
            <input type="text" name="user_id" value={formData.user_id} onChange={handleChange} required />
          </div>

          <div className={styles.signupFormGroup}>
            <label>비밀번호</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className={styles.signupFormGroup}>
            <label>이름</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className={styles.signupFormGroup}>
            <label>이메일</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className={styles.signupFormGroup}>
            <label>휴대전화</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className={styles.signupFormGroup}>
            <label>차량정보</label>
            <select 
              name="carMake" // carMake로 수정 (carModel과 중복 방지)
              value={formData.carMake} 
              onChange={handleChange} 
              required
            >
              <option value="" disabled>브랜드를 선택하세요</option>
              <option value="Toyota">Toyota</option>
              <option value="Honda">Honda</option>
              <option value="Ford">Ford</option>
              <option value="Hyundai">Hyundai</option>
            </select>
            <input type="text" name="carModel" value={formData.carModel} onChange={handleChange} placeholder="차 모델" required />
            <input type="text" name="carNumber" value={formData.carNumber} onChange={handleChange} placeholder="차량 번호" required />
            <input type="text" name="year" value={formData.year} onChange={handleChange} placeholder="연식" required />
            <input type="text" name="vin" value={formData.vin} onChange={handleChange} placeholder="차대 번호" required />
          </div>

          <div className={styles.signupTerms}>
            <label>
              <input
                type="checkbox"
                name="coOwner"
                checked={formData.coOwner}
                onChange={handleChange}
              />
              공동 소유주 여부
            </label>

            {/* 공동 소유주 입력 칸 */}
            {formData.coOwner && (
              <div className={styles.coOwnerFields}>
                <label>
                  <br />
                  공동 소유주 이름:
                  <input
                    type="text"
                    name="coOwnerName"
                    value={formData.coOwnerName}
                    onChange={handleChange}
                    placeholder="이름을 입력하세요"
                  />
                </label>
                <label>
                  공동 소유주 전화번호:
                  <input
                    type="text"
                    name="coOwnerPhone"
                    value={formData.coOwnerPhone}
                    onChange={handleChange}
                    placeholder="전화번호를 입력하세요"
                  />
                </label>
              </div>
            )}
            <br />
            <br />
            <div className={styles.termsContainer} ref={termsRef} onScroll={handleScroll}>
              <h3>이용약관</h3>
              <p>
                <pre>{agreement}</pre>
              </p>
            </div>

            {/* 약관 동의 체크박스 */}
            <label className={styles.termsLabel}>
              <input
                type="checkbox"
                name="termsAgreed"
                checked={formData.termsAgreed}
                onChange={handleChange}
                disabled={!isScrolledToBottom} // 스크롤이 끝까지 내려가야 활성화
                required
              />
              약관에 동의합니다.
            </label>
          </div>

          <div className={styles.signupFormActions}>
            <button type="submit" className={styles.signupButton}>회원가입</button>
            <button type="reset" className={styles.signupButton} onClick={() => setFormData({ ...formData, termsAgreed: false })}>다시 작성</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default SignUp;