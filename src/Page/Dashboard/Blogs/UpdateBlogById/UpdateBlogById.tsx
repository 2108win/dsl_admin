import BreadCrumb from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toolbarOptions } from "@/constants/quillBar";
import { environment } from "@/environments/environments";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/layout/header";
import { toast, Toaster } from "sonner";

const apiBlog = environment.serverURL.apiBlog;

const UpdateBlogByIdPage = () => {
  const { id } = useParams();
  const [formValue, setFormValue] = useState({ title: "", content: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFetch, setIsLoadingFetch] = useState(false);
  const navigation = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const postData = {
      Title: formValue.title,
      Content: formValue.content,
      Id: id,
      IdEmployee: localStorage.getItem("idEmployee"),
    };
    await fetch(`${apiBlog}/update/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          toast.success("Blog updated successfully", {
            description: "You can manage your blogs in the manage blogs page.",
            action: {
              label: "Go to manage blogs",
              onClick: () => navigation("/dashboard/blogs/manage"),
            },
          });
          setFormValue({ title: "", content: "" });
        } else {
          toast.error("Failed to update blog");
        }
      })
      .catch((err) => {
        console.error("Error updating blog: ", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoadingFetch(true);
      const apiUrl = `${apiBlog}/getBlog/${id}`;
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setFormValue(data);
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setIsLoadingFetch(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };
  const breadcrumbItems = [
    { title: "Manage Blogs", link: "/dashboard/blogs/manage" },
    { title: `Edit ${id}`, link: `/dashboard/blogs/update/${id}` },
  ];
  return (
    <>
      <Header />
      <div className="flex-1 w-full h-full max-w-5xl p-4 mx-auto mt-16 space-y-4 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigation("/dashboard/blogs/manage")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Heading
            title={`Update Blog ${formValue.title}`}
            description="Update the blog post. Fill in the form and click save."
          />
        </div>
        <Separator />
        <form onSubmit={handleSubmit} className="grid items-start gap-4 px-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            {isLoadingFetch ? (
              <Skeleton className="w-full h-10" />
            ) : (
              <Input
                id="title"
                name="title"
                type="text"
                value={formValue.title}
                onChange={handleFormChange}
                placeholder="Enter blog title"
                disabled={isLoading}
              />
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <div className="relative flex w-full">
              {isLoadingFetch ? (
                <Skeleton className="w-full h-96" />
              ) : (
                <ReactQuill
                  readOnly={isLoading}
                  theme="snow"
                  value={formValue.content}
                  onChange={(value) => setFormValue({ ...formValue, content: value })}
                  modules={{ toolbar: toolbarOptions }}
                  placeholder="Enter blog content"
                />
              )}
            </div>
          </div>
          <Button type="submit">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              "Save Changes!"
            )}
          </Button>
        </form>
      </div>
      <Toaster />
    </>
  );
};

export default UpdateBlogByIdPage;
