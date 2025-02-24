// pages/Contact.tsx
import React from "react";
import Layout from "../components/Layout";

const Contact: React.FC = () => {
    return (
    <Layout>
        <h1>문의하기</h1>
        <p>문의사항이 있으시면 아래 이메일로 연락 주세요.</p>
        <p>📧 contact@company.com</p>
    </Layout>
    );
};

export default Contact;
