import { Heading } from "@/components/ui/heading";
import Layout from "../Layout/layout";
import BreadCrumb from "@/components/breadcrumb";
import { Separator } from "@/components/ui/separator";
import StatusForm from "@/components/forms/status-form";
import SizeProductForm from "@/components/forms/size-product-form";
import { ScrollArea } from "@/components/ui/scroll-area";

const breadcrumbItems = [{ title: "Categories", link: "/dashboard/categories" }];
const CategoriesPage = () => {
  return (
    <Layout>
      <div className="flex-1 h-full p-4 pt-6 space-y-4 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            icon="categories"
            title="Categories"
            description="Manage Categories, Edit and Delete Categories."
          />
        </div>
        <Separator />
        <ScrollArea className="h-[85%] p-5 pt-0 -m-4 ">
          <div className="grid h-full grid-cols-1 gap-5 md:grid-cols-2">
            <StatusForm />
            <SizeProductForm />
          </div>
        </ScrollArea>
      </div>
    </Layout>
  );
};

export default CategoriesPage;
