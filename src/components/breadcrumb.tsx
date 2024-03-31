import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type BreadCrumbType = {
  title: string;
  link: string;
};

type BreadCrumbPropsType = {
  items: BreadCrumbType[];
};

export default function BreadCrumb({ items }: BreadCrumbPropsType) {
  return (
    <>
      {/* <div className="flex items-center mb-4 space-x-1 text-sm text-muted-foreground">
        <Link to="/dashboard" className="overflow-hidden text-ellipsis whitespace-nowrap">
          Dashboard
        </Link>
        {items?.map((item: BreadCrumbType, index: number) => (
          <React.Fragment key={item.title}>
            <ChevronRight className="w-4 h-4" />
            <Link
              to={item.link || "#"}
              className={cn(
                "font-medium",
                index === items.length - 1
                  ? "text-foreground pointer-events-none"
                  : "text-muted-foreground"
              )}
            >
              {item.title}
            </Link>
          </React.Fragment>
        ))}
      </div> */}
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {/* <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="#">Products</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Product</BreadcrumbPage>
          </BreadcrumbItem> */}
          {items?.map((item: BreadCrumbType, index: number) =>
            index < items.length - 1 ? (
              <BreadcrumbItem key={item.link}>
                <BreadcrumbLink asChild>
                  <Link to={item.link || "#"}>{item.title}</Link>
                </BreadcrumbLink>
                <BreadcrumbSeparator />
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem key={item.link}>
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              </BreadcrumbItem>
            )
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
