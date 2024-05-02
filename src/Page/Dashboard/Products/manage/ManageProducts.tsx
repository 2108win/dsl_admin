import Layout from "@/Page/Layout/layout";
import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/products-table/columns";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/constants/data";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { productState } from "../productAtom";
import { DataTableProduct } from "@/components/tables/products-table/data-table-product";
import { environment } from "@/environments/environments";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

const apiProduct = environment.serverURL.apiProduct;

const breadcrumbItems = [
  { title: "Products", link: "/dashboard/products" },
  { title: "Manage Products", link: "/dashboard/products/create" },
];

const ManageProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productS] = useRecoilState(productState);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  const navigation = useNavigate();
  useEffect(() => {
    setIsLoading(true);
    fetch(`${apiProduct}/getList`)
      .then((res) => res.json())
      .then((data) => {
        console.log('data: ', data);
        setProducts(data);
        setIsLoading(false);
        setIsEmpty(data.length == 0);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch products");
        setIsLoading(false);
      });
  }, [productS]);

  return (
    <Layout>
      <div className="flex-1 h-full p-4 pt-6 space-y-4 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            icon="manageProducts"
            title="Manage Products"
            description="Create a new product and add it to the list of products."
          />
          {!isEmpty && (
            <Button
              onClick={() => {
                navigation("/dashboard/products/create");
              }}
            >
              <Plus size={20} /> Add Product
            </Button>
          )}
        </div>
        <Separator />
        {isEmpty ? (
          <div className="flex flex-1 h-[500px] items-center justify-center rounded-lg border border-dashed shadow-sm">
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">You have no products</h3>
              <p className="text-sm text-muted-foreground">Create a new product</p>
              <Button
                onClick={() => {
                  navigation("/dashboard/products/create");
                }}
                className="mt-4"
              >
                Add a new product
              </Button>
            </div>
          </div>
        ) : isLoading ? (
          <>
            <Skeleton className="w-1/3 h-12"></Skeleton>
            <Skeleton className="h-[400px] w-full mt-4"></Skeleton>
            <Skeleton className="w-1/4 h-10 mt-4"></Skeleton>
          </>
        ) : (
          <DataTableProduct searchKey="productName" columns={columns} data={products} />
        )}
      </div>
    </Layout>
  );
};
export default ManageProducts;
