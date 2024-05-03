import { DataTableRoute } from "@/components/tables/route-table/route-table";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { environment } from "@/environments/environments";
// import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { columns } from "@/components/tables/route-table/columns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { roleSubmit, RouteTable } from "@/constants/data";
// const apiRole = environment.serverURL.apiRole;
const apiRoute = environment.serverURL.apiRoute;

type RoleContentModalProps = {
  resetData: boolean;
  setResetData: (resetData: boolean) => void;
  setOpenDiaLog: (openDiaLog: boolean) => void;
};
const RoleContentModal: React.FC<RoleContentModalProps> = ({
  // resetData,
  // setResetData,
  setOpenDiaLog,
}) => {
  const [dataSubmit, setDataSubmit] = useState<roleSubmit>({
    RoleName: "",
    RoutersId: [],
  });
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const handelChangeInput = (fieldName: string, value: string) => {
    setDataSubmit((prevData: roleSubmit) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };
  const handelSubmit = async (data: roleSubmit) => {
    setOpenDiaLog(true);
    console.log("data: ", data);
    // try {
    //   const response = await fetch(apiRole, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(data),
    //   });
    //   if (response.ok) {
    //     toast({
    //       title: "Status added",
    //       description: "The status has been added successfully",
    //     });
    //     setResetData(!resetData);
    //   } else {
    //     toast({
    //       variant: "destructive",
    //       title: "Error",
    //       description: "An error occurred while adding the status",
    //     });
    //   }
    // } catch (error) {
    //   console.error("Error adding status:", error);
    // } finally {
    //   setResetData(resetData);
    // }
    handleDialogClose();
  };
  const getListRoute = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiRoute}/getList`);
      const data = await response.json();
      setRoutes(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setIsLoading(true);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while getting the route list",
      });
      // Handle errors appropriately, e.g., display an error message
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getListRoute();
  }, []);
  const handleDialogClose = () => {
    setOpenDiaLog(false);
  };
  const handleGetValueSelected = (value: RouteTable) => {
    setDataSubmit((prevData: roleSubmit) => ({
      // Sử dụng hàm setState với callback function để tránh lỗi trong trường hợp truy cập trực tiếp vào state
      ...prevData,
      RoutersId: [...prevData.RoutersId, value.id], // Thêm id mới vào mảng RoutersId
    }));
  };

  return (
    <>
      {/* <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
        Make changes to your profile here. Click save when you're done.
      </Dialog.Description> */}
      <fieldset className="mb-[15px] flex flex-col gap-5">
        <label className="text-violet11 text-[15px]" htmlFor="name">
          Role Name
        </label>
        <Input onChange={(e) => handelChangeInput("roleName", e.target.value)} id="name" />
      </fieldset>
      <div>
        {isLoading ? (
          <>
            <Skeleton className="w-1/3 h-12"></Skeleton>
            <Skeleton className="h-[400px] w-full mt-4"></Skeleton>
            <Skeleton className="w-1/4 h-10 mt-4"></Skeleton>
          </>
        ) : (
          <DataTableRoute
            handleGetValueSelected={(value: RouteTable) => handleGetValueSelected(value)}
            columns={columns}
            data={routes}
          />
        )}
      </div>
      <div className="mt-[25px] flex justify-end">
        <Button
          onClick={() => handelSubmit(dataSubmit)}
          className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
        >
          Save
        </Button>
      </div>
      {/* <Dialog.Close asChild>
        <button
          className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
          aria-label="Close"
          onClick={handleDialogClose}
        >
          X
        </button>
      </Dialog.Close> */}
    </>
  );
};
export default RoleContentModal;
