// import { DrawerDialogBlog } from "@/components/forms/blog-form";
import { productState } from "@/Page/Dashboard/Products/productAtom";
import ProductForm from "@/components/forms/product-form";
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
import { Product } from "@/constants/data";
import { environment } from "@/environments/environments";
import { MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import { useRecoilState } from "recoil";

const apiProduct = environment.serverURL.apiProduct;

interface CellActionProps {
  data: Product;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  // const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const [productS, setProductS] = useRecoilState(productState);
  const [open, setOpen] = useState(false);
  const onConfirm = async () => {
    await handleDelete();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 1000);
  };
  const handleDelete = async () => {
    await fetch(`${apiProduct}/Delete/${data.id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((res) => {
        toast({
          variant: res.status === "true" ? "default" : "destructive",
          title: "Delete Product",
          description: res.message,
          duration: 5000,
        });
      })
      .finally(() => {
        setProductS(!productS);
      });
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

          <DropdownMenuItem asChild>
            <ProductForm action="edit" data={data} />
          </DropdownMenuItem>
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
