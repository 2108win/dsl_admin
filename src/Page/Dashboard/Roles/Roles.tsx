import Layout from "@/Page/Layout/layout"
import BreadCrumb from "@/components/breadcrumb";
import { useEffect, useState } from "react";
import { environment } from "@/environments/environments";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import ModalCus from "./cusModal";
import RoleContentModal from "./RoleContentModal";
import { DataTableRole } from "@/components/tables/role-table/role-table";
import { CardContent } from "@/components/ui/card";
import { columns } from "@/components/tables/role-table/columns";
const apiRole = environment.serverURL.apiRole;
const RoleList = () => {
  const breadcrumbItems = [{ title: "Roles", link: "/dashboard/roles" }];
  const [isLoading, setIsLoading] = useState(false);
  const [resetData, setResetData] = useState(false);
  const [roles, setRoles] = useState([]);
  const [openDialog, setOpenDiaLog] = useState(false);
  const fetchRoles = async () => {
    setIsLoading(true);
    const apiUrl = `${apiRole}/getList?type=server`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log("data: ", data);
      setRoles(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      // Handle errors appropriately, e.g., display an error message
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchRoles();
  }, [resetData])
  const handleOpenDialog = () => {
    setOpenDiaLog(!openDialog);
  }
  return (
    <Layout>
      <div className="flex-1 h-full p-4 pt-6 space-y-4 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            icon="roles"
            title={`Roles (${roles.length})`}
            description="Manage roles (Client side table functionalities.)"
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
          <div >
            <ModalCus contentBtn="Add role" open={openDialog} handleOpen={handleOpenDialog} childContent={<RoleContentModal resetData={resetData} setResetData={setResetData} setOpenDiaLog={setOpenDiaLog} />} />
            <div className="mt-4 w-full">
              <CardContent>
                <DataTableRole columns={columns} data={roles} />
              </CardContent>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
export default RoleList;
