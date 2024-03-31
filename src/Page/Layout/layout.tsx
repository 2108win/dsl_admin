import React from "react";
import Header from "@/components/layout/header";
import Sidebar from "@/components/sidebar";
import { Toaster } from "@/components/ui/sonner";

interface LayoutProps {
  children: React.ReactNode; // Add the children property
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="w-full pt-16">{children}</main>
        <Toaster />
      </div>
    </>
  );
};

export default Layout;
