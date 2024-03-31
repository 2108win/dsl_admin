import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/constants/data";
import { Checkbox } from "@/components/ui/checkbox";
import { CellAction } from "./cell-action";
import { cn } from "@/lib/utils";
import { badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { environment } from "@/environments/environments";
import { useFetchStatusNameById } from "@/hooks/use-fetch-name-by-id";

const apiStatus = environment.serverURL.apiStatus;
const status = await fetch(`${apiStatus}/getList`).then((res) => res.json());

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
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

function RowIdToStatus({ row }: { row: string }) {
  const statusName = useFetchStatusNameById(row, status);
  return (
    <p className={cn("max-w-32", badgeVariants({ variant: "default" }))}>
      <span className="truncate">{statusName}</span>
    </p>
  );
}
