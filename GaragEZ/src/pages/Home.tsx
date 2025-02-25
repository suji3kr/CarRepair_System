// pages/Home.tsx
import React from "react";
import Layout from "../components/Layout";

const Home: React.FC = () => {
    return (
    <Layout>
        <h1>환영합니다!</h1>
        <img src="/images/hankook-logo.png" alt="" style={{ width: "100%" }} />
        <img src="/images/mechanic.jpg" alt="" style={{ width: "100%" }} />
        <img src="/images/consult.jpg" alt="" style={{ width: "100%" }} />
        <img src="/images/repair.jpg" alt="" style={{ width: "100%" }} />
    </Layout>
    );
};

export default Home;