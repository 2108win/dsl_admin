import Layout from "@/Page/Layout/layout";
import BreadCrumb from "@/components/breadcrumb";

import ProductForm from "@/components/forms/product-form";
import { ScrollArea } from "@/components/ui/scroll-area";

const breadcrumbItems = [
  { title: "Products", link: "/dashboard/products" },
  { title: "Create New Product", link: "/dashboard/products/create" },
];
const CreateNewProduct = () => {
  return (
    <Layout>
      <div className="flex-1 h-full p-4 pt-6 space-y-4 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <ScrollArea className="p-5 pt-0 -m-4 h-[100%]">
          <ProductForm action="create" />
        </ScrollArea>
      </div>
    </Layout>
  );
};
export default CreateNewProduct;
