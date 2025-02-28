import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google"; // Google OAuth 추가
import Header from "./components/Header";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import About from "./pages/About";
import MainPage from "./pages/MainPage";
import ChatBot from "./pages/ChatBot";
import ContactForm from "./pages/ContactForm";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PartsShop from "./pages/PartsShop";


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <div className="layout-container">
      {!isLanding && <Header />}
      <main className={isLanding ? "" : "pt-20"}>{children}</main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="*" element={<LayoutWrapper />} />
          </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

// ✅ 모든 페이지를 `Layout`과 함께 렌더링하는 컴포넌트
const LayoutWrapper: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/menu1" element={<MainPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/chat-bot" element={<ChatBot />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/partshop" element={<PartsShop />} />
      </Routes>
    </Layout>
  );
};

export default App;
