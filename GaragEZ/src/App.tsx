// App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MainPage from "./components/MainPage";
import ChatBot from "./components/ChatBot";


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <>
      {!isLanding && <Header />}
      <main className={isLanding ? "" : "pt-20"}>
        {children}
      </main>
    </>
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
          <Route path="/chat-bot" element={<ChatBot />} /> 
          {/* TODO: 나중에 chatbot을 레이아웃에 fab(Floating Action Button)로 옮기기 */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
