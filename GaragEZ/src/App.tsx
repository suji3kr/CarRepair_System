import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google"; 
import { AuthProvider } from "./components/AuthContext";
import { ChatBotProvider } from "./context/ChatBotContext"; // ✅ 챗봇 전역 상태 추가
import ChatBotPopup from "./components/ChatBotPopup"; // ✅ 전역 챗봇 모달 추가
import Header from "./components/Header";
import Sidebar from "./components/Sidebar"; // ✅ 사이드바 추가
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import About from "./pages/About";
import MainPage from "./pages/MainPage";
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
import AdminRoutes from "./routes/AdminRoutes"; // ✅ 관리자 페이지 추가

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
        <ChatBotProvider> {/* ✅ 챗봇 전역 상태 추가 */}
          <BrowserRouter>
            <Sidebar /> {/* ✅ 사이드바 추가 */}
            <ChatBotPopup /> {/* ✅ 전역 챗봇 모달 추가 */}
            <Routes>
              {/* ✅ 일반 페이지 라우팅 */}
              <Route path="/" element={<Landing />} />
              <Route path="/*" element={<LayoutWrapper />} />

              {/* ✅ 관리자 페이지 라우팅 추가 */}
              <Route path="/admin/*" element={<AdminRoutes />} />
            </Routes>
          </BrowserRouter>
        </ChatBotProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

const LayoutWrapper: React.FC = () => {
  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        <Route path="/main" element={<MainPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/event" element={<Event />} />
        <Route path="/partshop" element={<PartsShop />} />
        <Route path="/map" element={<Map />} />
        <Route path="/part/:id" element={<PartDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/menu1/team" element={<Team />} />
        <Route path="/menu1/CompanyHistory" element={<CompanyHistory />} />
        <Route path="/storelist" element={<StoreList />} />
        <Route path="/pastevents" element={<PastEvents />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/storereview" element={<StoreReviewPage />} />
        <Route path="/reservations" element={<ReservationPage />} />
        <Route path="/interior" element={<ReservationPage />} />
      </Routes>
    </Layout>
  );
};

export default App;
