import { NavItemWithChildren } from "@/types";

export type User = {
  id: string;
  username: string;
  normalizedUserName: string;
  fullName: string;
  email: string;
  password: string;
  passwordHash: string;
  phoneNumber: string;
  twoFactorEnabled: boolean;
  avatar: string;
  role: Role["id"];
};

export type RoleTable = {
  id: string;
  roleName: string;
};
export type RouteTable = {
  id: string;
  label: string;
}
export type Blog = {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
};

export type Product = {
  id: string;
  productName: string;
  brand: string;
  model: string;
  power: string;
  adapter: string;
  timeIsBattery: string;
  timeIsUse: string;
  manySpeaker: string;
  manyBass: string;
  treble: string;
  connectWireless: string;
  connectMicroWireless: string;
  connectOther: string;
  portWiredMicro: string;
  length: string;
  width: string;
  height: string;
  weight: string;
  material: string;
  colorImg: string;
  frequency: string;
  price: string;
  status: StatusProduct["id"];
  images: Image["id"][];
  description: string;
};
export type Image = {
  id: string;
};
export type Role = {
  id: string;
  roleName: string;
}
export type StatusProduct = {
  id: string;
  nameStatus: string;
  createdAt: string;
};

export type SizeProduct = {
  id: string;
  nameSize: string;
  length: string;
  width: string;
  height: string;
  weight: string;
  createdAt: string;
};

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export const navItemsAdmin: NavItemWithChildren[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "Blogs",
    href: "/dashboard/blogs",
    icon: "blogs",
    label: "blogs",
    routerChilds: [
      {
        title: "Manage Blogs",
        href: "/dashboard/blogs/manage",
        icon: "manageBlog",
        label: "manageBlog",
      },
      {
        title: "Create New",
        href: "/dashboard/blogs/create",
        icon: "createBlog",
        label: "createBlog",
      },
    ],
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: "products",
    label: "products",
    routerChilds: [
      {
        title: "Manage Products",
        href: "/dashboard/products/manage",
        icon: "manageProducts",
        label: "manageProducts",
      },
      {
        title: "Create New",
        href: "/dashboard/products/create",
        icon: "createProduct",
        label: "createProduct",
      },
    ],
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: "users",
    label: "users",
    routerChilds: [
      {
        title: "Manage Users",
        href: "/dashboard/users/manage",
        icon: "manageUsers",
        label: "manageUsers",
      },
      {
        title: "Create User",
        href: "/dashboard/users/create",
        icon: "createUser",
        label: "createUser",
      },
    ],
  },
  {
    title: "Categories",
    href: "/dashboard/categories",
    icon: "categories",
    label: "categories",
  },
];

export const navItemsUser: NavItemWithChildren[] = [
  {
    title: "Blogs",
    href: "/dashboard/blogs",
    icon: "blogs",
    label: "blogs",
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: "products",
    label: "products",
    routerChilds: [
      {
        title: "Manage Products",
        href: "/dashboard/products/manage",
        icon: "manageProducts",
        label: "manageProducts",
      },
      {
        title: "Create New",
        href: "/dashboard/products/create",
        icon: "createProduct",
        label: "createProduct",
      },
    ],
  },
];

export const navItemsUserBlog: NavItemWithChildren[] = [
  {
    title: "Blogs",
    href: "/dashboard/blogs",
    icon: "blogs",
    label: "blogs",
  },
];

export const navItemsUserProduct: NavItemWithChildren[] = [
  {
    title: "Products",
    href: "/dashboard/products",
    icon: "products",
    label: "products",
    routerChilds: [
      {
        title: "Manage Products",
        href: "/dashboard/products/manage",
        icon: "manageProducts",
        label: "manageProducts",
      },
      {
        title: "Create New",
        href: "/dashboard/products/create",
        icon: "createProduct",
        label: "createProduct",
      },
    ],
  },
];
