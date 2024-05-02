import { ColumnDef } from "@tanstack/react-table";
import { Blog } from "@/constants/data";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Edit, ExternalLink, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertModal } from "@/components/modal/alert-modal";
import { useState } from "react";
import { toast } from "sonner";
import { environment } from "@/environments/environments";
import { blogState } from "@/Page/Dashboard/Blogs/blogAtom";
import { useRecoilState } from "recoil";

const apiBlog = environment.serverURL.apiBlog;

export const columns: ColumnDef<Blog>[] = [
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
    accessorKey: "imageURL",
    header: "IMAGE",
    cell: ({ row }) => (
      <img src={row.original.imageUrl} alt="Blog Image" className="w-12 h-12 rounded" />
    ),
  },
  {
    accessorKey: "title",
    header: "TITLE",
  },
  {
    accessorKey: "description",
    header: "DESCRIPTION",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions data={row.original} />,
  },
];

function Actions({ data }: { data: Blog }) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [blogS, setBlogS] = useRecoilState(blogState);
  const navigation = useNavigate();
  const handleDeleteSelected = async () => {
    setIsLoading(true);
    await fetch(`${apiBlog}/Delete/${data.id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === true) {
          toast.success(`Deleted successfully ${data.title}`, {
            description: res.message,
          });
          setBlogS(!blogS);
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
                  navigation(`/dashboard/blogs/update/${data.id}`);
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
              <Button
                onClick={() => {
                  setOpen(true);
                }}
                variant="destructive"
                size="icon"
              >
                <Trash className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => navigation(`/dashboard/blogs/${data.id}`)}
                variant="outline"
                size="icon"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Preview</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );
}
