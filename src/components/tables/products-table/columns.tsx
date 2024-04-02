import { ColumnDef } from "@tanstack/react-table";
import { Product, StatusProduct } from "@/constants/data";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Trash } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useFetchStatusNameById } from "@/hooks/use-fetch-name-by-id";
import { useRecoilState, useRecoilValue } from "recoil";
import { AlertModal } from "@/components/modal/alert-modal";
import { toast } from "sonner";
import { environment } from "@/environments/environments";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { statusListRecoil } from "@/Page/Categories/categoriesAtom";
import { productState } from "@/Page/Dashboard/Products/productAtom";

const apiProduct = environment.serverURL.apiProduct;

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="truncate max-w-20">{row.original.id}</p>
          </TooltipTrigger>
          <TooltipContent>
            <p>{row.original.id}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "productName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          PRODUCT NAME
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="line-clamp-2">{row.original.productName}</p>
          </TooltipTrigger>
          <TooltipContent>
            <p>{row.original.productName}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "brand",
    header: "BRAND",
  },
  {
    accessorKey: "price",
    header: "PRICE",
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          STATUS
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => RowIdToStatus({ row: row.original.status }),
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions data={row.original} />,
  },
];

function Actions({ data }: { data: Product }) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [productS, setProductS] = useRecoilState(productState);
  const navigation = useNavigate();
  const handleDeleteSelected = async () => {
    setIsLoading(true);
    await fetch(`${apiProduct}/Delete/${data.id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "true") {
          toast.success(`Deleted successfully ${data.productName}`, {
            description: res.message,
          });
          setProductS(!productS);
          setOpen(false);
        } else {
          toast.error("Failed to delete", {
            description: res.message,
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteSelected}
        loading={isLoading}
      />
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  navigation(`/dashboard/products/update/${data.id}`);
                }}
                variant="outline"
                size="icon"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={() => setOpen(true)} variant="destructive" size="icon">
                <Trash className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );
}

function RowIdToStatus({ row }: { row: string }) {
  const status: StatusProduct[] = useRecoilValue(statusListRecoil);
  const statusName = useFetchStatusNameById(row, status);
  return (
    <p className={cn("max-w-32", badgeVariants({ variant: "default" }))}>
      <span className="truncate">{statusName}</span>
    </p>
  );
}
