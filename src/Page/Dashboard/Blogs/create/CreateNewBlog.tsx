
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
  const [formValue, setFormValue] = useState({
    title: "",
    name: "",
    normalizedName: "",
    content: "",
    DesImage: null,
    Description: '',
    imageUrl: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const idEmployee = localStorage.getItem("idEmployee");
    const name = localStorage.getItem("name");
    const { title, content, DesImage, Description } = formValue;
    // Assuming DesImage is a file input, you need to handle it appropriately
    const formData = new FormData();
    formData.append("title", title);
    formData.append("idEmployee", idEmployee ? idEmployee : "");
    formData.append("content", content);
    formData.append("name", name ? name : "");
    formData.append("normalizedName", name ? name : "");
    formData.append("DesImage", DesImage ? DesImage : "");
    formData.append("description", Description);

    try {
      const response = await fetch(`${apiBlog}/addBlog`, {
        method: "POST",
        body: formData,
      });
      const responData = await response.json();
      console.log('responData: ', responData);
      if (response.ok || responData.status === "true") {
        toast.success("Blog created successfully", {
          description: "You can manage your blogs in the manage blogs page.",
          action: {
            label: "Go to manage blogs",
            onClick: () => navigation("/dashboard/blogs/manage"),
          },
        });
      }
      else {
        toast.error("Failed to create blog");
      }
    } catch (error) {
      console.error("Error add new blog: ", error);
      toast.error("Failed to create blog");
    } finally {
      setIsLoading(false);
      setFormValue({
        title: "",
        content: "",
        name: "",
        normalizedName: "",
        DesImage: null,
        imageUrl: "",
        Description: ""
      });
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormValue({ ...formValue, DesImage: e.target.files[0] as any, imageUrl: URL.createObjectURL(e.target.files[0]) });
    }
  };

  return (
    <Layout>
      <div className="flex-1 h-full p-4 pt-6 space-y-4 md:p-8 overflow-auto">
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
              value={formValue.title}
              onChange={handleFormChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="title">Description</Label>
            <Input
              type="text"
              name="Description"
              id="Description"
              value={formValue.Description}
              onChange={handleFormChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="DesImage">Description Image</Label>
            <Input
              type="file"
              name="DesImage"
              id="DesImage"
              onChange={handleImageChange}
            />
            {formValue.imageUrl !== '' ?
              <img className="rounded-lg max-w-full aspect-video md:aspect-[5/2] object-cover shadow-lg border" alt="preview image" src={formValue.imageUrl} /> : <></>
            }
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <div className="relative flex w-full">
              <ReactQuill
                theme="snow"
                value={formValue.content}
                onChange={(content: string) =>
                  setFormValue({ ...formValue, content })
                }
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

