import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../Page/Login/login";
import DashboardPage from "../Page/Dashboard/Dashboard";
import NotFound from "../Page/Error/not-found";
import BlogsPage from "@/Page/Dashboard/Blogs/Blogs";
import BlogByIdPage from "@/Page/Dashboard/Blogs/BlogById/BlogById";
import CreateNewProduct from "@/Page/Dashboard/Products/create/CreateNewProduct";
import ManageProducts from "@/Page/Dashboard/Products/manage/ManageProducts";
import CreateNewUser from "@/Page/Dashboard/Users/create/CreateNewUser";
import ManageUsers from "@/Page/Dashboard/Users/manage/ManageUsers";
import RegisterPage from "@/Page/Register/Register";
import SettingsPage from "@/Page/Settings/settings";
import { ProductPage } from "@/Page/Dashboard/Products/Products";
import CategoriesPage from "@/Page/Categories/categories";
import CreateNewBlog from "@/Page/Dashboard/Blogs/create/CreateNewBlog";
import ManageBlogsPage from "@/Page/Dashboard/Blogs/manage/ManageBlogs";
import UpdateBlogByIdPage from "@/Page/Dashboard/Blogs/UpdateBlogById/UpdateBlogById";
import UpdateProductByIdPage from "@/Page/Dashboard/Products/UpdateProductById/UpdateProductById";
import UpdateUserById from "@/Page/Dashboard/Users/UpdateUserById/UpdateUserById";
import RoleList from "@/Page/Dashboard/Roles/Roles";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <NotFound />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
    errorElement: <NotFound />,
  },
  {
    path: "/",
    element: <LoginPage />,
    errorElement: <NotFound />,
    children: [{}],
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
    errorElement: <NotFound />,
    children: [{}],
  },
  // blogs
  {
    path: "/dashboard/blogs",
    element: <BlogsPage />,
    errorElement: <NotFound />,
    children: [{}],
  },
  {
    path: "/dashboard/blogs/manage",
    element: <ManageBlogsPage />,
    errorElement: <NotFound />,
    children: [{}],
  },
  {
    path: "/dashboard/blogs/create",
    element: <CreateNewBlog />,
    errorElement: <NotFound />,
    children: [{}],
  },
  {
    path: "/dashboard/blogs/:id",
    element: <BlogByIdPage />,
    errorElement: <NotFound />,
    children: [{}],
  },
  {
    path: "/dashboard/blogs/update/:id",
    element: <UpdateBlogByIdPage />,
    errorElement: <NotFound />,
    children: [{}],
  },
  {
    path: "/dashboard/products",
    element: <ProductPage />,
    errorElement: <NotFound />,
    children: [{}],
  },
  {
    path: "/dashboard/products/create",
    element: <CreateNewProduct />,
    errorElement: <NotFound />,
    children: [{}],
  },
  {
    path: "/dashboard/products/update/:id",
    element: <UpdateProductByIdPage />,
    errorElement: <NotFound />,
    children: [{}],
  },
  {
    path: "/dashboard/products/manage",
    element: <ManageProducts />,
    errorElement: <NotFound />,
    children: [{}],
  },
  {
    path: "/dashboard/users",
    element: <ManageUsers />,
    errorElement: <NotFound />,
    children: [{}],
  },
  {
    path: "/dashboard/users/update/:id",
    element: <UpdateUserById />,
    errorElement: <NotFound />,
    children: [{}],
  },
  {
    path: "/dashboard/users/create",
    element: <CreateNewUser />,
    errorElement: <NotFound />,
    children: [{}],
  },
  {
    path: "/dashboard/users/manage",
    element: <ManageUsers />,
    errorElement: <NotFound />,
    children: [{}],
  },
  {
    path: "/settings",
    element: <SettingsPage />,
    errorElement: <NotFound />,
    children: [{}],
  },
  {
    path: "/dashboard/categories",
    element: <CategoriesPage />,
    errorElement: <NotFound />,
    children: [{}],
  },
  {
    path: "/dashboard/roles",
    element: <RoleList />,
    errorElement: <NotFound />,
    children: [{}],
  },
]);
