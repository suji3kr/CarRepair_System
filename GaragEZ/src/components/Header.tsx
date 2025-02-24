// components/Header.tsx
import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-black bg-opacity-40 backdrop-blur-md text-white z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between py-3 px-8">
        {/* 로고 영역 */}
        <div className="text-2xl font-bold">
          <Link to="/">GARAGEZ</Link>
        </div>

        {/* 메뉴 영역 */}
        <div className="flex gap-8 text-lg font-medium">
          <Link to="/" className="hover:text-gray-300 transition">홈</Link>
          <Link to="/about" className="hover:text-gray-300 transition">소개</Link>
          <Link to="/contact" className="hover:text-gray-300 transition">문의</Link>
          <Link to="/review" className="hover:text-gray-300 transition">리뷰</Link>
        </div>

        {/* 검색 아이콘 */}
        <div className="text-xl">
          <button>
            🔍
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
