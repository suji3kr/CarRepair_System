// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./components/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import About from "./pages/About";
import MainPage from "./pages/MainPage";
import ChatBot from "./pages/ChatBot";
import ContactForm from "./pages/ContactForm";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PartsShop from "./pages/PartsShop";
import Event from "./pages/Event";
import Map from "./pages/Map";
import PartDetail from "./pages/PartDetail";
import Cart from "./pages/Cart";
import CompanyHistory from "./menu1/CompanyHistory";
import StoreList from "./pages/StoreList";
import Team from "./menu1/Team";
import PastEvents from "./pages/PastEvents";
<<<<<<< HEAD
import LiveChat from "./components/LiveChat"; // 실시간 라이브챗 컴포넌트
=======
import Cars from "./pages/Cars";
>>>>>>> 129f8272dda37779efb0978641d43badaabbe794

// Layout: Header, Footer, 메인 콘텐츠, 그리고 Landing 페이지에서만 LiveChat 표시
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isLanding = location.pathname === "/"; // Landing 페이지에서는 Header를 숨김

  return (
    <div className="layout-container">
      {!isLanding && <Header />}
      <div style={{ display: "flex", minHeight: "calc(100vh - 80px)" }}>
        {/* 메인 콘텐츠 영역 */}
        <main className={isLanding ? "" : "pt-20"} style={{ flex: 1, padding: "1rem" }}>
          {children}
        </main>
        {/* Landing 페이지에서만 사이드바 영역에 LiveChat 표시 */}
        {isLanding && (
          <aside
            style={{
              width: "320px",
              borderLeft: "1px solid #ddd",
              padding: "1rem",
              background: "#f9f9f9",
            }}
          >
            <LiveChat />
          </aside>
        )}
      </div>
      <Footer />
    </div>
  );
};

// 모든 라우트를 Layout 내부에서 관리하는 컴포넌트
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<ContactForm />} />
      <Route path="/chat-bot" element={<ChatBot />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/event" element={<Event />} />
      <Route path="/partshop" element={<PartsShop />} />
      <Route path="/Map" element={<Map />} />
      <Route path="/part/:id" element={<PartDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/menu1/team" element={<Team />} />
      <Route path="/menu1/CompanyHistory" element={<CompanyHistory />} />
      <Route path="/StoreList" element={<StoreList />} />
      <Route path="/PastEvents" element={<PastEvents />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <AppRoutes />
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

<<<<<<< HEAD
=======
// ✅ 모든 페이지를 `Layout`과 함께 렌더링하는 컴포넌트
const LayoutWrapper: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/main" element={<MainPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/chat-bot" element={<ChatBot />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/event" element={<Event />} />
        <Route path="/partshop" element={<PartsShop />} />
        <Route path="/Map" element={<Map />} />
        <Route path="/part/:id" element={<PartDetail />} /> {/* 상세 페이지 추가 */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/menu1/team" element={<Team />} />
        <Route path="/menu1/CompanyHistory" element={<CompanyHistory />} />
        <Route path="/StoreList" element={<StoreList />} />
        <Route path="/PastEvents" element={<PastEvents />} />
        <Route path="/Cars" element={<Cars />} />
        


      </Routes>
    </Layout>
  );
};

>>>>>>> 129f8272dda37779efb0978641d43badaabbe794
export default App;
