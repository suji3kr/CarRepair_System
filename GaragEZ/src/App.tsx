import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MainPage from "./pages/MainPage";
import ChatBot from "./components/ChatBot";
import ContactForm from "./pages/ContactForm";
import Login from "./pages/Login";

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
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/menu1" element={<MainPage />} />  
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/menu3" element={<ContactForm />} />
          <Route path="/chat-bot" element={<ChatBot />} /> 
          <Route path="/login" element={<Login />} /> 
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
