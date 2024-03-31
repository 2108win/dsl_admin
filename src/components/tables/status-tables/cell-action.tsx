import { statusProductState } from "@/Page/Categories/categoriesAtom";
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
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import { Product, StatusProduct } from "@/constants/data";
import { environment } from "@/environments/environments";
import { MoreHorizontal, Trash } from "lucide-react";
import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

const apiStatusProduct = environment.serverURL.apiStatus;
const apiProduct = environment.serverURL.apiProduct;

interface CellActionProps {
  data: StatusProduct;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  // const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [productData, setProductData] = useState<Product[]>([]);
  const [statusProductS, setStatusProductS] = useRecoilState(statusProductState);

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(`${apiProduct}/getList`).then((res) => res.json());
      setProductData(response);
    };
    fetchProduct();
  }, []);
  const onConfirm = async () => {
    if (productData.find((product) => product.status === data.id)) {
      toast({
        variant: "destructive",
        title: "Delete Status",
        description: "This status is being used by a product",
      });
      setOpen(false);
      return;
    }
    await handleDelete();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
      setStatusProductS(!statusProductS);
    }, 1000);
  };
  const handleDelete = async () => {
    try {
      const response = await fetch(`${apiStatusProduct}/Delete/${data.id}`, {
        method: "DELETE",
      });
      // Handle response here
      const result = await response.json();
      if (result.status === "true") {
        toast({
          variant: result.status === "true" ? "default" : "destructive",
          title: "Delete Status",
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
      <Toaster />
    </>
  );
};
