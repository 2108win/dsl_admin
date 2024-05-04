import Layout from "@/Page/Layout/layout";
import BreadCrumb from "@/components/breadcrumb";
import { useEffect, useState } from "react";
import { environment } from "@/environments/environments";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Role, Routers } from "@/constants/data";
import { cn } from "@/lib/utils";
import { CheckboxReactHookFormMultiple } from "./CheckBoxRouters";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, TrashIcon, X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertModal } from "@/components/modal/alert-modal";
import { useRecoilState } from "recoil";
import { roleState } from "./roleAtom";
const apiRole = environment.serverURL.apiRole;
const apiRouter = environment.serverURL.apiRoute;
const RoleList = () => {
  const breadcrumbItems = [{ title: "Roles", link: "/dashboard/roles" }];
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [roleData, setRoleData] = useState<Role>({} as Role);
  const [openRole, setOpenRole] = useState(false);
  const [routers, setRouters] = useState<Routers[]>([]);
  const [listRouterId, setListRouterId] = useState<Routers["id"][]>([]);
  const [isAddNew, setIsAddNew] = useState(false);
  const [roleAtoms, setRoleAtoms] = useRecoilState(roleState);

  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoading(true);
      const apiUrl = `${apiRole}/getList?type=server`;
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        // Handle errors appropriately, e.g., display an error message
      } finally {
        setIsLoading(false);
      }
    };
    const fetchRouters = async () => {
      setIsLoading(true);
      const apiUrl = `${apiRouter}/getList`;
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setRouters(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        // Handle errors appropriately, e.g., display an error message
      } finally {
        setIsLoading(false);
      }
    };
    setRoleData({} as Role);
    fetchRoles();
    fetchRouters();
    setIsAddNew(false);
    setOpenRole(false);
  }, [roleAtoms]);
  // const handleOpenDialog = () => {
  //   setOpenDiaLog(!openDialog);
  // };
  const handleActiveRole = (routerId: Routers["id"][], roleData: Role) => {
    setIsAddNew(false);
    setRoleData(roleData);
    setOpenRole(true);
    setListRouterId(routerId);
  };
  const handleDeleteRole = (id: string) => {
    const apiUrl = `${apiRole}/delete/${id}`;
    fetch(apiUrl, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success(`Delete role ${data.roleName} successfully`);
        setOpen(false);
        setRoleAtoms(!roleAtoms);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Delete role failed");
      });
  };
  const handleAddNewRole = () => {
    setOpenRole(true);
    setIsAddNew(true);
    setRoleData({} as Role);
    setListRouterId([]);
  };

  const handleButtonRouter = () => {
    setRoleData({} as Role);
    setOpenRole(false);
    setIsAddNew(false);
  };

  const handleChangeRole = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoleData({ ...roleData, roleName: e.target.value });
  };
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
          <div className="flex gap-4">
            <div className="flex flex-col flex-1 max-w-xs">
              <h3 className="mb-4 text-2xl font-bold">Role</h3>
              {roles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-gray-500">No roles found</p>

                  {isAddNew && (
                    <Input
                      name="roleName"
                      placeholder="Add new role"
                      className="w-full mt-4"
                      required
                      autoComplete="off"
                      value={roleData.roleName}
                      onChange={(e) => handleChangeRole(e)}
                    />
                  )}
                  {!isAddNew && (
                    <Button className="mt-4" onClick={handleAddNewRole}>
                      <PlusIcon className="w-4 h-4" />
                      Add new
                    </Button>
                  )}
                </div>
              ) : (
                roles.map((role) => (
                  <div key={role.id}>
                    <div className="flex items-center gap-2 p-2 border-b rounded-lg shadow-md cursor-pointer hover:bg-gray-100/10">
                      <div
                        className={cn(
                          "p-2 flex items-center w-full gap-2 rounded-lg transition-all duration-500",
                          {
                            "bg-gray-100/10": openRole && role.id === roleData.id,
                          }
                        )}
                        onClick={() => {
                          handleActiveRole(role.routersId, role);
                        }}
                      >
                        <AlertModal
                          loading={isLoading}
                          isOpen={open}
                          onClose={() => setOpen(false)}
                          onConfirm={() => {
                            handleDeleteRole(role.id);
                          }}
                        />
                        <p className="mr-auto font-bold">{role.roleName}</p>
                        {role.roleName != "ADMIN" && (
                          <Button
                            variant="destructive"
                            size="icon"
                            className="flex-shrink-0"
                            onClick={() => {
                              setOpen(true);
                            }}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      {openRole && role.id === roleData.id ? (
                        <Button
                          variant={"outline"}
                          size="icon"
                          className="z-10 flex-shrink-0"
                          onClick={handleButtonRouter}
                        >
                          <ChevronLeftIcon className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          variant={"outline"}
                          size="icon"
                          className="z-10 flex-shrink-0"
                          onClick={() => {
                            handleActiveRole(role.routersId, role);
                          }}
                        >
                          <ChevronRightIcon className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
              {isAddNew && (
                <div className="flex mt-4">
                  <div className="flex flex-col gap-3">
                    <Input
                      name="roleName"
                      placeholder="Add new role"
                      className="w-full"
                      required
                      type="text"
                      autoComplete="off"
                      autoFocus
                      value={roleData.roleName}
                      onChange={(e) => {
                        handleChangeRole(e);
                      }}
                    />
                    <Label>Input new ROLE name and go to routers</Label>
                  </div>
                  <Button
                    variant={"outline"}
                    size="icon"
                    className="z-10 flex-shrink-0 ml-2"
                    onClick={handleButtonRouter}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              {!isAddNew && (
                <Button className="mt-4 w-fit" onClick={handleAddNewRole}>
                  <PlusIcon className="w-4 h-4" />
                  Add new
                </Button>
              )}
            </div>
            {openRole && (
              <div className="flex gap-4">
                <Separator orientation="vertical" />
                <div className="flex flex-col">
                  <h3 className="mb-4 text-2xl font-bold">Routers</h3>
                  <CheckboxReactHookFormMultiple
                    role={roleData}
                    routers={routers}
                    listCheck={listRouterId}
                    isAddNew={isAddNew}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};
export default RoleList;
