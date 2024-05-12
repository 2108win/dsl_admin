import { DashboardNav } from "@/components/dashboard-nav";
import { environment } from "@/environments/environments";
import useFetch from "@/hooks/service";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const roleFromLocal = localStorage.getItem("role");
  const [sideBarItems, setSideBarItems] = useState<any>([]);
  const { data, error, loading } = useFetch(
    {
      url: `${environment.serverURL.apiRole}/getOne/${roleFromLocal}`,
      params: roleFromLocal
    }
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      if (error) {
        console.log("error: ", error);
      }
      if (data) {
        console.log('data get route from role: ', data);
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
