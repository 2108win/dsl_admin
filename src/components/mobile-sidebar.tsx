import { DashboardNav } from "@/components/dashboard-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  navItemsAdmin,
  navItemsUser,
  navItemsUserBlog,
  navItemsUserProduct,
} from "@/constants/data";
import { MenuIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// import { Playlist } from "../data/playlists";

// interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
//   // playlists: Playlist[];
// }

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
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
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="left" className="!px-0">
          <div className="py-4 space-y-4">
            <div className="px-3 py-2">
              <h2 className="px-4 mb-2 text-lg font-semibold tracking-tight">Overview</h2>
              <div className="space-y-1">
                <DashboardNav items={sideBarItems} setOpen={setOpen} role={role} />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
