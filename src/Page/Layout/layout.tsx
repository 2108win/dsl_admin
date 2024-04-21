import React, { useMemo } from "react";
import Header from "@/components/layout/header";
import Sidebar from "@/components/sidebar";
import { useRecoilValue } from "recoil";
import { ReloadSideBar } from "@/components/atom/atom";

interface LayoutProps {
  children: React.ReactNode; // Add the children property
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const reloadSidebarAtom = useRecoilValue(ReloadSideBar);
  const sideBarMemo = useMemo(() => {
    console.log("reloadSidebarAtom: ", reloadSidebarAtom);
    return <Sidebar />;
  }, [reloadSidebarAtom]);
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        {sideBarMemo}
        <main className="w-full pt-16">{children}</main>
      </div>
    </>
  );
};

export default Layout;
