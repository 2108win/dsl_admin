import { ColumnDef } from "@tanstack/react-table";
import { Role, User } from "@/constants/data";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { badgeVariants } from "@/components/ui/badge";
import { useFetchRoleNameById } from "@/hooks/use-fetch-name-by-id";
import { useRecoilValue } from "recoil";
import { roleListState } from "@/Page/Dashboard/Users/userAtom";
import { useNavigate } from "react-router-dom";

export const columns: ColumnDef<User>[] = [
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
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          EMAIL
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="line-clamp-2">{row.original.email}</p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{row.original.email}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ROLE
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => RowIdToRole({ row: row.original.role }),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <Actions data={row.original} />;
    },
  },
];

function Actions({ data }: { data: User }) {
  const navigation = useNavigate();
  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => {
                navigation(`/dashboard/users/update/${data.id}`);
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
    </div>
  );
}

function RowIdToRole({ row }: { row: string }) {
  const roles: Role[] = useRecoilValue(roleListState);
  const roleName = useFetchRoleNameById(row, roles);
  return (
    <p
      className={cn(
        badgeVariants({
          variant:
            roleName === undefined
              ? "destructive"
              : roleName === "User"
              ? "outline"
              : roleName === "Admin"
              ? "default"
              : "secondary",
        })
      )}
    >
      {roleName || "undefined"}
    </p>
  );
}
