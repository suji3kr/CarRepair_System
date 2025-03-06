import React, { useState } from "react";
import Layout from "../components/Layout";
import styles from "../styles/ContactForm.module.css"; // CSS 모듈 import

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    carType: "",
    model: "",
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
      <div className={styles.contactContainer}>
        {/* 기존 배너 유지 */}
        <div className={styles.contactBanner}></div>

        {/* 폼 영역 */}
        <form className={styles.contactForm} onSubmit={handleSubmit}>
          <h2>문의하기</h2>

          <div className={styles.contactInputGroup}>
            <label>이름</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className={styles.contactInputGroup}>
            <label>모델명</label>
            <input type="text" name="model" value={formData.model} onChange={handleChange} required />
          </div>


          <div className={styles.contactInputGroup}>
            <label>이메일 주소</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className={styles.contactInputGroup}>
            <label>전화번호</label>
            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
          </div>

          <div className={styles.contactInputGroup}>
            <label>기재사항</label>
            <textarea name="message" value={formData.message} onChange={handleChange} required />
          </div>

          <button type="submit" className={styles.contactSubmitButton}>제출하기</button>
        </form>
      </div>
    </Layout>
  );
};

export default ContactForm;
