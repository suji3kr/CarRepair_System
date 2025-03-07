import { useRef, useState } from "react";
import Layout from "../components/Layout";
import styles from "../styles/SignUp.module.css"; // CSS Modules 사용
import { FormData } from "../types/Signup";
import agreement from '../text/agreement.txt?raw'

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    user_id: "",
    password: "",
    name: "",
    email: "",
    phone: "",
    carModel: "",
    carNumber: "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsAgreed) {
      alert("약관에 동의해야 합니다.");
      return;
    }
    console.log("회원가입 정보:", formData);
    alert("회원가입이 완료되었습니다!");
    // TODO: Spring Boot API로 데이터 전송
  };

  return (
    <Layout>
      <div className={styles.signupContainer}>
        <h2 className={styles.signupTitle}>회원가입</h2>
        <p className={styles.signupDescription}>방문해주셔서 감사합니다.</p>

        <form onSubmit={handleSubmit} className={styles.signupForm}>
          <div className={styles.signupFormGroup}>
            <label>아이디</label>
            <input type="text" name="userId" value={formData.userId} onChange={handleChange} required />
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
            <label>비밀번호</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className={styles.signupFormGroup}>
            <label>휴대전화</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className={styles.signupFormGroup}>
            <label>차량정보</label>
            
            <select 
              name="carModel" g
              value={formData.carModel} 
              onChange={handleChange} 
              required
            >
              <option value="" disabled>차종을 선택하세요</option>
              <option value="Toyota">Toyota</option>
              <option value="Honda">Honda</option>
              <option value="Ford">Ford</option>
              <option value="Hyundai">Hyundai</option>
            </select>
            <input type="text" name="carNumber" value={formData.carNumber} onChange={handleChange} placeholder="차량 번호" required />
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
              <br></br>
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
            <br></br>
            <br></br>
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
