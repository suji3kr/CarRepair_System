import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google"; // Google OAuth 추가
import { AuthProvider } from "./components/AuthContext"; // AuthContext 불러오기
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
import Event from "./pages/Event";
import Map from "./pages/Map";
import PartDetail from "./pages/PartDetail";
import Cart from "./pages/Cart";
import CompanyHistory from "./menu1/CompanyHistory";
import StoreList from "./pages/StoreList";
import Team from "./menu1/Team";
import PastEvents from "./pages/PastEvents";
import Cars from "./pages/Cars";
import Profile from "./pages/Profile";
import StoreReviewPage from "./pages/StoreReviewPage";
import ScrollToTop from "./components/scrollToTop";
import ReservationPage from "./pages/ReservationPage";



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
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} /> {/* ✅ Landing 페이지 (Header 없음) */}
            <Route path="*" element={<LayoutWrapper />} /> {/* ✅ 다른 모든 페이지는 Layout 적용 */}
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

// ✅ 모든 페이지를 `Layout`과 함께 렌더링하는 컴포넌트
const LayoutWrapper: React.FC = () => {
  return (
    <Layout>
      <ScrollToTop />
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
        <Route path="/profile" element={<Profile />} />
        <Route path="/storereview" element={<StoreReviewPage />} />
        <Route path="/reservations" element={<ReservationPage />} />



      </Routes>
    </Layout>
  );
};

export default App;
