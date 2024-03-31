import { ColumnDef } from "@tanstack/react-table";
import { SizeProduct } from "@/constants/data";
import { CellAction } from "./cell-action";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const columns: ColumnDef<SizeProduct>[] = [
  {
    accessorKey: "nameSize",
    header: "Name",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="line-clamp-2">{row.original.nameSize}</p>
          </TooltipTrigger>
          <TooltipContent>
            <p>{row.original.nameSize}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "width",
    header: "Width",
  },
  {
    accessorKey: "height",
    header: "Height",
  },
  {
    accessorKey: "length",
    header: "Length",
  },
  {
    accessorKey: "weight",
    header: "Weight",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
