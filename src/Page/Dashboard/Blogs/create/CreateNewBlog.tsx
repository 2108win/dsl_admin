import BreadCrumb from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toolbarOptions } from "@/constants/quillBar";
import { environment } from "@/environments/environments";
import Layout from "@/Page/Layout/layout";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "react-quill/dist/quill.snow.css";

const apiBlog = environment.serverURL.apiBlog;

const breadcrumbItems = [
  { title: "Blogs", link: "/dashboard/blogs" },
  { title: "Create New Blog", link: "/dashboard/blogs/create" },
];

const CreateNewBlog = () => {
  const [formValue, setFormValue] = useState({ title: "", content: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const idEmployee = localStorage.getItem("idEmployee");
    const title = formValue.title;
    const content = formValue.content;
    const postData = { title, idEmployee, content };
    await fetch(`${apiBlog}/addBlog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((res) => {
        if (res.ok) {
          toast.success("Blog created successfully", {
            description: "You can manage your blogs in the manage blogs page.",
            action: {
              label: "Go to manage blogs",
              onClick: () => navigation("/dashboard/blogs/manage"),
            },
          });
        } else {
          toast.error("Failed to create blog");
        }
      })
      .catch((err) => {
        console.error("Error add new blog: ", err);
      })
      .finally(() => {
        setIsLoading(false);
        setFormValue({ title: "", content: "" });
      });
  };
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  return (
    <Layout>
      <div className="flex-1 h-full p-4 pt-6 space-y-4 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <Heading
          icon="createBlog"
          title="Create New Blog"
          description="Create a new blog post. Fill in the form and click save."
        />
        <Separator />
        <form onSubmit={handleSubmit} className="grid items-start gap-4 px-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              name="title"
              id="title"
              defaultValue={formValue.title}
              onChange={handleFormChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <div className="relative flex w-full">
              <ReactQuill
                theme="snow"
                value={formValue.content}
                onChange={(content) => setFormValue({ ...formValue, content })}
                modules={{ toolbar: toolbarOptions }}
              />
            </div>
          </div>
          <Button type="submit" className="mt-4">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              "On-air 🚀 "
            )}
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default CreateNewBlog;
