import { cn } from "@/lib/utils";
import logo from "../../assets/svg/logo.svg";
import { ModeToggle } from "./ThemeToggle/mode-toggle";
import { UserNav } from "./user-nav";
import { MobileSidebar } from "../mobile-sidebar";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-20 border-b supports-backdrop-blur:bg-background/60 bg-background/95 backdrop-blur">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="hidden lg:block">
          <Link to="/dashboard">
            <img src={logo} alt="" className="w-12 transition-all hover:drop-shadow-lg" />
          </Link>
        </div>
        <div className={cn("block lg:!hidden")}>
          <MobileSidebar />
        </div>
        <div className="flex items-center gap-2">
          <UserNav />
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};
export default Header;
