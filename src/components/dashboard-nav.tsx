import { Icons } from "@/components/icons";
import {
  navItemsAdmin,
  navItemsUser,
  navItemsUserBlog,
  navItemsUserProduct,
} from "@/constants/data";
import { cn } from "@/lib/utils";
import { NavItem, NavItemWithChildren } from "@/types";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  role?: string;
}

export function DashboardNav({ items, setOpen, role }: DashboardNavProps) {
  const path = window.location.pathname;
  const navigate = useNavigate();
  useEffect(() => {
    const urlsRoleAccess = [] as string[];
    console.log("🚀 ~ useEffect ~ urlsRoleAccess:", urlsRoleAccess);
    if (role === "User") {
      navItemsUser.forEach((item) => {
        if (item.href) {
          urlsRoleAccess.push(item.href);
        }
        if (item.items) {
          item.items.forEach((subItem) => {
            if (subItem.href) {
              urlsRoleAccess.push(subItem.href);
            }
          });
        }
      });
      if (!urlsRoleAccess.includes(path)) {
        navigate(urlsRoleAccess[0]);
      }
    } else if (role === "UserBlog") {
      navItemsUserBlog.forEach((item) => {
        if (item.href) {
          urlsRoleAccess.push(item.href);
        }
        if (item.items) {
          item.items.forEach((subItem) => {
            if (subItem.href) {
              urlsRoleAccess.push(subItem.href);
            }
          });
        }
      });
      if (!urlsRoleAccess.includes(path)) {
        navigate(urlsRoleAccess[0]);
      }
    } else if (role === "UserProduct") {
      navItemsUserProduct.forEach((item) => {
        if (item.href) {
          urlsRoleAccess.push(item.href);
        }
        if (item.items) {
          item.items.forEach((subItem) => {
            if (subItem.href) {
              urlsRoleAccess.push(subItem.href);
            }
          });
        }
      });
      if (!urlsRoleAccess.includes(path)) {
        navigate(urlsRoleAccess[0]);
      }
    } else {
      navItemsAdmin.forEach((item) => {
        if (item.href) {
          urlsRoleAccess.push(item.href);
        }
        if (item.items) {
          item.items.forEach((subItem) => {
            if (subItem.href) {
              urlsRoleAccess.push(subItem.href);
            }
          });
        }
      });
      if (!urlsRoleAccess.includes(path)) {
        navigate(urlsRoleAccess[0]);
      }
    }
  }, [items, role, navigate, path]);
  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      {items.map((item: NavItemWithChildren, index: number) => {
        const Icon = Icons[item.icon || "arrowRight"];
        return item.href && item.items ? (
          <div
            key={index}
            onClick={() => {
              if (setOpen) setOpen(false);
            }}
          >
            <Link
              to={item.disabled ? "/" : item.items[0]?.href || "#"}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium",
                path === item.href ? "bg-accent" : "transparent",
                item.items.length &&
                  "text-accent-foreground/70 hover:bg-accent hover:text-accent-foreground/70 cursor-pointer"
              )}
            >
              <Icon className="w-4 h-4 mr-2" />
              <span>{item.title}</span>
            </Link>
            <div className="ml-4 border-l-2">
              {item.items.map((subItem, index) => {
                const Icon = Icons[subItem.icon || "arrowRight"];
                return (
                  <Link
                    key={index}
                    to={subItem.disabled ? "/" : subItem.href || "#"}
                    onClick={() => {
                      if (setOpen) setOpen(false);
                    }}
                  >
                    <span
                      className={cn(
                        "mt-2 group flex items-center rounded-md px-3 py-2 ml-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        path === subItem.href ? "bg-accent" : "transparent",
                        subItem.disabled && "cursor-not-allowed opacity-80"
                      )}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      <span>{subItem.title}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : (
          <Link
            key={index}
            to={item.disabled ? "/" : item.href || "#"}
            onClick={() => {
              if (setOpen) setOpen(false);
            }}
          >
            <span
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                path === item.href ? "bg-accent" : "transparent",
                item.disabled && "cursor-not-allowed opacity-80"
              )}
            >
              <Icon className="w-4 h-4 mr-2" />
              <span>{item.title}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
