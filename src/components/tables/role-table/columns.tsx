import { ColumnDef } from "@tanstack/react-table";
import { RoleTable } from "@/constants/data";
import { CellAction } from "./cell-action";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const columns: ColumnDef<RoleTable>[] = [
  {
    accessorKey: "label",
    header: "Name",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="line-clamp-2 w-[200px]">{row.original.roleName}</p>
          </TooltipTrigger>
          <TooltipContent>
            <p>{row.original.roleName}</p>
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

