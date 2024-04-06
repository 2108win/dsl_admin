import { sizeProductState } from "@/Page/Categories/categoriesAtom";
// import DrawerDialogBlog from "@/components/forms/blog-form";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { SizeProduct } from "@/constants/data";
import { environment } from "@/environments/environments";
import { MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

const apiSizeProduct = environment.serverURL.apiSizeProduct; // Assuming this is the correct API endpoint
interface CellActionProps {
  data: SizeProduct;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  // const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [sizeProductS, setSizeProductS] = useRecoilState(sizeProductState);
  const onConfirm = async () => {
    await handleDelete();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
      setSizeProductS(!sizeProductS);
    }, 1000);
  };
  const handleDelete = async () => {
    try {
      const response = await fetch(`${apiSizeProduct}/Delete/${data.id}`, {
        method: "DELETE",
      });
      // Handle response here
      const result = await response.json();
      if (result.size === "true") {
        toast({
          variant: result.size === "true" ? "default" : "destructive",
          title: "Delete Size",
          description: result.message,
        });
      }
    } catch (error) {
      // Handle error here
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          {/* <DropdownMenuItem asChild>
            <DrawerDialogBlog action="edit" data={data} />
          </DropdownMenuItem> */}
          {/* <DropdownMenuItem
            asChild
            onClick={() => {
              navigation(`/dashboard/blogs/${data.id}`);
            }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="justify-start w-full font-normal cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </DropdownMenuItem> */}
          <DropdownMenuItem asChild onClick={() => setOpen(true)}>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start w-full font-normal cursor-pointer"
            >
              <Trash className="w-4 h-4 mr-2" /> Delete
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
