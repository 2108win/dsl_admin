import BreadCrumb from "@/components/breadcrumb";
import Header from "@/components/layout/header";
import DOMPurify from "dompurify";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { environment } from "@/environments/environments";

const apiBlog = environment.serverURL.apiBlog;

interface Blog {
  id: string;
  title: string;
  content: string;
}
const BlogByIdPage = () => {
  const { id } = useParams();
  console.log("🚀 ~ BlogByIdPage ~ id:", id);
  const [blog, setBlog] = useState<Blog>({
    id: "",
    title: "",
    content: "",
  });
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const breadcrumbItems = [
    { title: "Blogs", link: "/dashboard/blogs" },
    { title: id as string, link: "/dashboard/blogs/:id" },
  ];

  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true);
      const apiUrl = `${apiBlog}/getBlog/${id}`;
      try {
        const response = await fetch(apiUrl);
        const data: Blog = await response.json();
        setBlog(data);
        setContent(DOMPurify.sanitize(data.content));
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="pt-16">
          <div className="p-4 space-y-4 md:p-8">
            <Skeleton className="w-1/3 h-10" />
            <div className="pt-6 space-y-6">
              <Skeleton className="w-1/2 h-20 mx-auto text-center"></Skeleton>
              <Skeleton className="w-full h-[60px]"></Skeleton>
              <Skeleton className="w-[90%] h-[60px]"></Skeleton>
              <Skeleton className="w-full h-[60px]"></Skeleton>
              <Skeleton className="w-[80%] h-[60px]"></Skeleton>
              <Skeleton className="w-[50%] h-[60px]"></Skeleton>
            </div>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <Header />
      <div className="pt-16">
        <div className="p-4 space-y-4 md:p-8">
          <BreadCrumb items={breadcrumbItems} />
          <div className="pt-6 space-y-6">
            <h1 className="text-3xl font-black text-center">{blog.title}</h1>
            <span
              className="block mx-auto max-w-7xl [&>*]:leading-7 [&>p]:font-normal [&>p]:text-lg [&>p]:text-green-500 [&>p>img]:aspect-video [&>p>img]:border-2 [&>p>img]:border-gray-300 [&>p>img]:rounded-md [&>p>img]:drop-shadow-lg [&>p>img]:object-cover [&>p>img]:max-w-4xl [&>p>img]:mx-auto [&>p>img]:my-4"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default BlogByIdPage;
