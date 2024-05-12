import Layout from "@/Page/Layout/layout";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { environment } from "@/environments/environments";
import { Role } from "@/constants/data";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
const breadcrumbItems = [
  { title: "User", link: "/dashboard/users" },
  { title: "Create New User", link: "/dashboard/users/create" },
];

const apiAuth = environment.serverURL.apiAuth;
const apiRole = environment.serverURL.apiRole;

const userFormSchema = z.object({
  email: z.string().min(3),
  username: z.string().min(3),
  fullName: z.string().min(3),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  role: z.string().min(1),
});

type UserForm = z.infer<typeof userFormSchema>;

const CreateNewUser = () => {
  // const [userS, setUserS] = useRecoilState(userState);
  const [roles, setRoles] = useState<Role[]>([]);
  // const [imageMassage, setImageMassage] = useState("");
  // const [avatarImage, setAvatarImage] = useState<File>();
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigate();

  const defaultValues: UserForm = {
    email: "",
    username: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    role: "",
  };
  const form = useForm<UserForm>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
  });

  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${apiRole}/getList`);
        if (!res.ok) {
          toast.error("Failed to fetch roles");
        }
        const data = await res.json();
        setRoles(data);
        const dataRoleId = data.find((role: Role) => role.roleName === "USER");
        form.setValue("role", dataRoleId.id);
      } catch (error) {
        toast.error("Failed to fetch roles");
        console.error("Error fetching roles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const onSubmitUser = async () => {
    // if (!avatarImage) {
    //   setImageMassage("Image is required");
    //   toast.warning("Image is required");
    //   return;
    // }
    // formData.append("ImageFile", avatarImage);
    if (form.getValues().password !== form.getValues().confirmPassword) {
      form.setFocus("password");
      toast.warning("Password and Confirm Password must be the same");
      return;
    }
    setIsLoading(true);
    try {
      const dataRegister = {
        email: form.getValues().email,
        username: form.getValues().username,
        fullName: form.getValues().fullName,
        password: form.getValues().password,
        role: form.getValues().role,
      };
      console.log("🚀 ~ onSubmitUser ~ dataRegister:", dataRegister);

      const response = await fetch(`${apiAuth}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataRegister),
      });
      if (response.ok) {
        // const resData = await response.json();
        toast.success("User has been created", {
          description: `Register successfully ${dataRegister.username}`,
          action: {
            label: "Go to manage users",
            onClick: () => {
              navigation("/dashboard/users/manage");
            },
          },
        });
      } else {
        const resDataText = await response.text();
        toast.error("Register failed", {
          description: resDataText,
        });
      }
    } catch (error) {
      console.error("Error register:", error);
    } finally {
      setIsLoading(false);
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
          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
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
    <Layout>
      <div className="flex-1 h-full p-4 pt-6 space-y-4 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        {/* <UserForm action="create" /> */}
        <Form {...form}>
          <form className="h-full space-y-5" onSubmit={form.handleSubmit(onSubmitUser)}>
            <div className="sticky top-0 left-0 right-0 z-10 space-y-5 bg-background">
              <div className="flex items-start justify-between">
                <Heading
                  icon="createUser"
                  title="Create New User"
                  description="Create a new User and add it to the list of users."
                />
                <Button type="submit" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex">
                      <Loader2 className="animate-spin mr-2" />
                      Loading...
                    </span>
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
              <Separator />
            </div>
            {/* <div className="flex max-w-sm gap-4">
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
            </div> */}
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
    </Layout>
  );
};
export default CreateNewUser;
