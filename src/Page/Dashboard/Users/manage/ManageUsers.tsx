import Layout from "@/Page/Layout/layout";
import BreadCrumb from "@/components/breadcrumb";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { User } from "@/constants/data";
import { useEffect, useState } from "react";
import { userState } from "../userAtom";
import { toast } from "@/components/ui/use-toast";
import { environment } from "@/environments/environments";
import { useRecoilState } from "recoil";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "@/components/tables/users-table/columns";
import { DataTableUser } from "@/components/tables/users-table/data-table-user";

const breadcrumbItems = [
  { title: "User", link: "/dashboard/users" },
  { title: "Manage Users", link: "/dashboard/users/manage" },
];

const apiAuth = environment.serverURL.apiAuth;
const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userS] = useRecoilState(userState);
  const [isLoading, setIsLoading] = useState(false);
  const fetchUsers = async () => {
    setIsLoading(true);
    const apiUrl = `${apiAuth}/getAll`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error fetching users",
      });
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [userS]);
  return (
    <Layout>
      <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            icon="manageUsers"
            title="Manage Users"
            description="Manage Users, set Role,  Edit and Delete Users."
          />
        </div>
        <Separator />
        {isLoading ? (
          <>
            <Skeleton className="w-1/3 h-12"></Skeleton>
            <Skeleton className="h-[400px] w-full mt-4"></Skeleton>
            <Skeleton className="w-1/4 h-10 mt-4"></Skeleton>
          </>
        ) : (
          <DataTableUser searchKey="email" columns={columns} data={users} />
        )}
      </div>
    </Layout>
  );
};
export default ManageUsers;
