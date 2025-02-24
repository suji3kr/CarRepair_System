// components/Layout.tsx
import React from "react";
import Header from "./Header";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-[80px]">
        {children}
      </main>
    </div>
  );
};

export default Layout;
