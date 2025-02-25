import React, { useState } from "react";
import Layout from "../components/Layout";
import styles from "../styles/ContactForm.module.css"; // CSS 모듈 import

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    Name: "",
    carType: "",
    model: "",
    carDetails: "",
    email: "",
    phoneNumber: "",
    message: "",
    additionalNotes: "",
  });

  // 입력 값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    alert("Form submitted successfully!");
  };

  return (
    <Layout>
      <div className={styles.container}>
        {/* 배너 */}
        <div className={styles.banner}>
          <h1>믿을 수 있는 정비</h1>
          <h2>GaragEZ</h2>
        </div>

        {/* 폼 영역 */}
        <form className={styles.contactForm} onSubmit={handleSubmit}>
          <h2>Contact me</h2>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>이름</label>
              <input type="text" name="Name" value={formData.Name} onChange={handleChange} required />
            </div>
           
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>어떤 종류의 차인가요?</label>
              <input type="text" name="carType" value={formData.carType} onChange={handleChange} required />
            </div>
            <div className={styles.inputGroup}>
              <label>모델명</label>
              <input type="text" name="model" value={formData.model} onChange={handleChange} required />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>차량연계</label>
            <input type="text" name="carDetails" value={formData.carDetails} onChange={handleChange} />
          </div>

          <div className={styles.inputGroup}>
            <label>이메일 주소</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className={styles.inputGroup}>
            <label>전화번호</label>
            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
          </div>

          <div className={styles.inputGroup}>
            <label>기타 기재사항</label>
            <textarea name="message" value={formData.message} onChange={handleChange} required />
          </div>

          <div className={styles.inputGroup}>
            <label>참고할 사항</label>
            <textarea name="additionalNotes" value={formData.additionalNotes} onChange={handleChange} />
          </div>

          <button type="submit" className={styles.submitButton}>Submit</button>
        </form>
      </div>
    </Layout>
  );
};

export default ContactForm;
