import { ColumnDef } from "@tanstack/react-table";
import { StatusProduct } from "@/constants/data";
import { CellAction } from "./cell-action";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const columns: ColumnDef<StatusProduct>[] = [
  {
    accessorKey: "nameStatus",
    header: "Name",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="line-clamp-2 w-[200px]">{row.original.nameStatus}</p>
          </TooltipTrigger>
          <TooltipContent>
            <p>{row.original.nameStatus}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
