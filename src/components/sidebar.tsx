import { DashboardNav } from "@/components/dashboard-nav";
import { environment } from "@/environments/environments";
import useFetch from "@/hooks/service";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [role, setRole] = useState<string>("ADMIN");
  const [sideBarItems, setSideBarItems] = useState<any>([]);
  const { data, error, loading } = useFetch(
    `${environment.serverURL.apiRole}/getOne/${role}`,
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      const decode: any = jwtDecode(localStorage.getItem("token") as any);
      setRole(localStorage.getItem("role") as string);
      if (error) {
        console.log("error: ", error);
      }
      if (data) {
        setSideBarItems(data.routers);
      }
    } else {
      navigate("/login");
    }
  }, [navigate, data, loading]);

  return (
    <nav className="relative hidden h-screen pt-16 border-r lg:block w-72">
      <div className="py-4 space-y-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {/* */}
            {loading ? (
              <>
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-10 h-10 animate-pulse bg-slate-200 rounded-full"></div>
                </div>
              </>
            ) : (
              <>
                <h2 className="px-4 mb-2 text-xl font-semibold tracking-tight">
                  Overview
                </h2>
                <DashboardNav items={sideBarItems} />
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
