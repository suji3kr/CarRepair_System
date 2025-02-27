import { useState } from "react";
import Layout from "../components/Layout";
import styles from "../styles/SignUp.module.css"; // CSS Modules 사용

// Spring Boot로 보낼 회원가입 데이터 타입 정의
interface FormData {
  userId: string;
  password: string;
  name: string;
  email: string;
  telecom: string;
  phone: string;
  carModel: string;
  carNumber: string;
  coOwner: boolean;
  termsAgreed: boolean;
}

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    userId: "",
    password: "",
    name: "",
    email: "",
    telecom: "",
    phone: "",
    carModel: "",
    carNumber: "",
    coOwner: false,
    termsAgreed: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
            <input type="text" name="carModel" value={formData.carModel} onChange={handleChange} placeholder="차종" required />
            <input type="text" name="carNumber" value={formData.carNumber} onChange={handleChange} placeholder="차량 번호" required />
           </div>
            
          

          <div className={styles.signupTerms}>
          <label>
              <input type="checkbox" name="coOwner" checked={formData.coOwner} onChange={handleChange} /> 공동 소유주 여부
            </label>
            <br></br>
            <br></br>
            <label>
              <input type="checkbox" name="termsAgreed" checked={formData.termsAgreed} onChange={handleChange} required /> 약관에 동의합니다.
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
