import { forwardRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BreadCrumb from "@/components/breadcrumb";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Role } from "@/constants/data";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Loader2 } from "lucide-react";
import Header from "@/components/layout/header";
import { environment } from "@/environments/environments";
import { Label } from "@/components/ui/label";

const apiAuth = environment.serverURL.apiAuth;
const apiRole = environment.serverURL.apiRole;

const userFormSchema = z.object({
  email: z.string().min(3),
  username: z.string().min(3),
  fullName: z.string().min(3),
  role: z.string().min(1),
  password: z.string().min(0),
  confirmPassword: z.string().min(0),
});

type UserForm = z.infer<typeof userFormSchema>;

const UpdateUserById = forwardRef(() => {
  const { id } = useParams();
  const [roles, setRoles] = useState<Role[]>([]);
  const [imageMassage, setImageMassage] = useState("");
  const [avatarImage, setAvatarImage] = useState<File>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const navigation = useNavigate();

  const breadcrumbItems = [
    { title: "Manage Users", link: "/dashboard/users/manage" },
    { title: `Edit ${id}`, link: `/dashboard/users/update/${id}` },
  ];

  const API_URL = `${apiAuth}/updateUser/${id}`;

  const defaultValues: UserForm = {
    email: "",
    username: "",
    fullName: "",
    role: "",
    password: "",
    confirmPassword: "",
  };
  const form = useForm<UserForm>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
  });

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${apiAuth}/getOne/${id}`);
        const data = await res.json();
        form.setValue("email", data.email);
        form.setValue("username", data.username);
        form.setValue("fullName", data.fullName);
        form.setValue("role", data.role);

        const avatarData = convertBase64ToFile(data.avatar, `${data.fullName}.png`);
        setAvatarImage(avatarData);
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to fetch user");
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  useEffect(() => {
    fetch(`${apiRole}/getList`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setRoles(data))
      .catch((error) => {
        toast.error("Failed to fetch roles");
        console.error("Error:", error);
      });
  }, []);
  const convertBase64ToFile = (base64String: string, fileName: string): File => {
    const byteCharacters = atob(base64String);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: "application/octet-stream" });
    return new File([blob], fileName);
  };

  useEffect(() => {
    if (avatarImage) {
      setImageMassage("");
    }
  }, [avatarImage]);

  const handleUploadAvatarImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setImageMassage("Image size must be less than 3mb");
      return;
    }
    setAvatarImage(file);
  };

  const onSubmitUser = async (data: UserForm) => {
    console.log("🚀 ~ onSubmitUser ~ data:", data);
    if (data.password !== "" || data.confirmPassword !== "") {
      if (data.password.length < 8) {
        toast.warning("Password must be at least 8 characters");
        form.setFocus("password");
        form.setError("password", { message: "Password must be at least 8 characters" });
        return;
      }
      if (data.password !== data.confirmPassword) {
        toast.warning("Password and confirm password must be the same");
        form.setFocus("password");
        form.setError("password", { message: "Password and confirm password must be the same" });
        return;
      } else {
        const body = {
          email: data.email,
          password: data.password,
        };
        try {
          const res = await fetch(`${apiAuth}/updatePassword`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });
          const data = await res.json();
          if (data.status === "true") {
            toast.success("Password updated successfully");
          }
        } catch (error) {
          toast.error("Failed to update password");
          console.error("Error:", error);
        }
      }
    }
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("username", data.username);
    formData.append("fullName", data.fullName);
    formData.append("role", data.role);
    formData.append("imageFile", avatarImage as File);
    try {
      setIsLoadingEdit(true);
      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.status === "true") {
        toast.success(data.message, {
          description: "You can manage users in the manage users page.",
          action: {
            label: "Go to Manage Users",
            onClick: () => navigation("/dashboard/users/manage"),
          },
        });
      }
    } catch (error) {
      toast.error("Failed to update user");
      console.error("Error:", error);
    } finally {
      setIsLoadingEdit(false);
    }
  };

  const renderFormField = (
    name: string,
    label: string,
    type: string = "text",
    isDisabled?: boolean
  ) => (
    <FormField
      control={form.control}
      name={name as keyof UserForm}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>{label}</FormLabel>
            <FormMessage />
          </div>
          <FormControl>
            <Input placeholder={`Enter ${label}`} {...field} type={type} disabled={isDisabled} />
          </FormControl>
        </FormItem>
      )}
    />
  );
  const renderFormFieldSelect = (name: string, label: string, options: Role[]) => (
    <FormField
      control={form.control}
      name={name as keyof UserForm}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>{label}</FormLabel>
            <FormMessage />
          </div>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={label} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.roleName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );

  return (
    <>
      <Header />
      <div className="relative flex-1 w-full h-full p-4 mx-auto mt-16 space-y-4 max-w-7xl md:p-8">
        <Form {...form}>
          <form className="h-full space-y-5" onSubmit={form.handleSubmit(onSubmitUser)}>
            <div className="sticky z-10 w-full space-y-5 bg-background">
              <BreadCrumb items={breadcrumbItems} />
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigation("/dashboard/users/manage")}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                {isLoading ? (
                  <Skeleton className="w-40 h-10" />
                ) : (
                  <div className="flex items-start justify-between w-full">
                    <Heading
                      title={`Update User ${form.getValues("fullName")}`}
                      description="Update product information and images."
                    />
                    <Button type="submit" size="lg" disabled={isLoadingEdit}>
                      {isLoadingEdit ? (
                        <span className="flex">
                          <Loader2 className="animate-spin mr-2" /> Saving...
                        </span>
                      ) : (
                        <span>Save</span>
                      )}
                    </Button>
                  </div>
                )}
              </div>
              <Separator />
            </div>
            <div className="flex max-w-sm gap-4">
              <div className="flex flex-col w-full gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="picture">Avatar</Label>
                  <span className="text-sm font-semibold text-red-500">{imageMassage}</span>
                </div>
                <Input
                  id="picture"
                  type="file"
                  accept="image/*"
                  onChange={handleUploadAvatarImage}
                />
              </div>
              <Avatar className="w-16 h-16 border-2 border-red-400">
                <AvatarImage src={avatarImage && URL.createObjectURL(avatarImage)} />
                <AvatarFallback>AVATAR</AvatarFallback>
              </Avatar>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {renderFormField("email", "Email")}
              {renderFormField("username", "Username")}
              {renderFormField("fullName", "Full Name")}
              {isLoading ? (
                <div className="flex flex-col gap-2">
                  <Label>Role</Label>
                  <Skeleton className="w-full h-10"></Skeleton>
                </div>
              ) : (
                renderFormFieldSelect("role", "Role", roles)
              )}
              {renderFormField("password", "Password", "password")}
              {renderFormField("confirmPassword", "Confirm Password", "password")}
            </div>
          </form>
        </Form>
      </div>
    </>
  );
});

export default UpdateUserById;
