import BreadCrumb from "@/components/breadcrumb";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { columns } from "@/components/tables/blog-tables/columns";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableBlog } from "@/components/tables/blog-tables/data-blog-table";
import { environment } from "@/environments/environments";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import Layout from "@/Page/Layout/layout";
import { blogState } from "../blogAtom";

const apiBlog = environment.serverURL.apiBlog;

const breadcrumbItems = [{ title: "Blog", link: "/dashboard/blog" }];

const ManageBlogsPage = () => {
  const navigation = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [blogS] = useRecoilState(blogState);

  // Function to fetch blogs using fetch API
  const fetchBlogs = async () => {
    setIsLoading(true);
    const apiUrl = `${apiBlog}/getList`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      // Handle errors appropriately, e.g., display an error message
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [blogS]);

  return (
    <Layout>
      <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            icon="blogs"
            title={`Blogs (${blogs.length})`}
            description="Manage blogs (Client side table functionalities.)"
          />
          <Button
            onClick={() => {
              navigation("/dashboard/blogs/create");
            }}
            className="text-xs md:text-sm"
          >
            <Plus className="w-4 h-4 mr-2" /> Add New
          </Button>
        </div>
        <Separator />
        {isLoading ? (
          <>
            <Skeleton className="w-1/3 h-12"></Skeleton>
            <Skeleton className="h-[400px] w-full mt-4"></Skeleton>
            <Skeleton className="w-1/4 h-10 mt-4"></Skeleton>
          </>
        ) : (
          <DataTableBlog searchKey="title" columns={columns} data={blogs} />
        )}
      </div>
    </Layout>
  );
};

export default ManageBlogsPage;
