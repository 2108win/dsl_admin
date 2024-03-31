import { DashboardNav } from "@/components/dashboard-nav";
import {
  navItemsAdmin,
  navItemsUser,
  navItemsUserBlog,
  navItemsUserProduct,
} from "@/constants/data";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [role, setRole] = useState<string>("ADMIN");

  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setRole(localStorage.getItem("role") as string);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const sideBarItems =
    role === "User"
      ? navItemsUser
      : role === "UserBlog"
      ? navItemsUserBlog
      : role === "UserProduct"
      ? navItemsUserProduct
      : navItemsAdmin;

  return (
    <nav className="relative hidden h-screen pt-16 border-r lg:block w-72">
      <div className="py-4 space-y-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="px-4 mb-2 text-xl font-semibold tracking-tight">Overview</h2>
            <DashboardNav items={sideBarItems} role={role} />
          </div>
        </div>
      </div>
    </nav>
  );
}
