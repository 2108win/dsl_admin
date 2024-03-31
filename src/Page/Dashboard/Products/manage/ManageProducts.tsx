import Layout from "@/Page/Layout/layout";
import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/products-table/columns";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { Product } from "@/constants/data";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { productState } from "../productAtom";
import { DataTableProduct } from "@/components/tables/products-table/data-table-product";
import { environment } from "@/environments/environments";

const apiProduct = environment.serverURL.apiProduct;

const breadcrumbItems = [
  { title: "Products", link: "/dashboard/products" },
  { title: "Manage Products", link: "/dashboard/products/create" },
];

const ManageProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productS] = useRecoilState(productState);
  const [isLoading, setIsLoading] = useState(false);
  const fetchProducts = async () => {
    setIsLoading(true);
    const apiUrl = `${apiProduct}/getList`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error fetching products",
      });
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
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
        </div>
        <Separator />
        {isLoading ? (
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
