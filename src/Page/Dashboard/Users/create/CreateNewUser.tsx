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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { Edit, Loader2 } from "lucide-react";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
// import { Role } from "@/constants/data";
import { toast } from "sonner";
import { useRecoilState } from "recoil";
import { userState } from "../userAtom";
import { useNavigate } from "react-router-dom";
import { environment } from "@/environments/environments";

const breadcrumbItems = [
  { title: "User", link: "/dashboard/users" },
  { title: "Create New User", link: "/dashboard/users/create" },
];

const apiAuth = environment.serverURL.apiAuth;

const userFormSchema = z.object({
  Email: z.string().min(3),
  Username: z.string().min(3),
  FullName: z.string().min(3),
  Password: z.string().min(8),
  ConfirmPassword: z.string().min(8),
  Role: z.string().min(1),
});

type UserForm = z.infer<typeof userFormSchema>;

const CreateNewUser = () => {
  const [userS, setUserS] = useRecoilState(userState);
  // const [roles, setRoles] = useState<Role[]>([]);
  const [imageMassage, setImageMassage] = useState("");
  const [avatarImage, setAvatarImage] = useState<File>();
  // const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigate();
  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (data) {
  //       try {
  //         const res = await fetch(`${apiUser}/${data}`);
  //         const userData = await res.json();

  //         form.setValue("Email", userData.email);
  //         form.setValue("Username", userData.userName);
  //         form.setValue("FullName", userData.fullName);
  //         form.setValue("Role", userData.role);
  //         form.setValue("Password", userData.passwordHash);
  //         form.setValue("ConfirmPassword", userData.passwordHash);

  //         const avatarData = convertBase64ToFile(userData.avatar, `${userData.fullName}.png`);
  //         setAvatarImage(avatarData);
  //       } catch (err) {
  //         console.error(err);
  //         // Show toast or notification for error
  //         toast({
  //           title: "Error",
  //           description: "Failed to fetch user data ",
  //           variant: "destructive",
  //         });
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     }
  //   };

  //   fetchData();
  // }, [data]);

  // const convertBase64ToFile = (base64String: string, fileName: string): File => {
  //   const byteCharacters = atob(base64String);
  //   const byteArrays = [];

  //   for (let offset = 0; offset < byteCharacters.length; offset += 512) {
  //     const slice = byteCharacters.slice(offset, offset + 512);

  //     const byteNumbers = new Array(slice.length);
  //     for (let i = 0; i < slice.length; i++) {
  //       byteNumbers[i] = slice.charCodeAt(i);
  //     }

  //     const byteArray = new Uint8Array(byteNumbers);
  //     byteArrays.push(byteArray);
  //   }

  //   const blob = new Blob(byteArrays, { type: "application/octet-stream" });
  //   return new File([blob], fileName);
  // };

  useEffect(() => {
    if (avatarImage) {
      setImageMassage("");
    }
  }, [avatarImage]);
  const handleUploadAvatarImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      setImageMassage("Image size must be less than 1mb");
      return;
    }
    setAvatarImage(file);
  };
  const defaultValues = {
    Email: "",
    Username: "",
    FullName: "",
    Password: "",
    ConfirmPassword: "",
    Role: "USER",
  };
  const form = useForm<UserForm>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
  });

  const onSubmitUser = async () => {
    if (!avatarImage) {
      setImageMassage("Image is required");
      toast.warning("Image is required");
      return;
    }
    const formData = new FormData();
    formData.append("ImageFile", avatarImage);
    formData.append("email", form.getValues().Email);
    formData.append("username", form.getValues().Username);
    formData.append("fullName", form.getValues().FullName);
    formData.append("password", form.getValues().Password);
    formData.append("confirmPassword", form.getValues().ConfirmPassword);
    formData.append("role", form.getValues().Role);
    if (form.getValues().Password !== form.getValues().ConfirmPassword) {
      form.setFocus("Password");
      toast.error("Password and Confirm Password must be the same");
      return;
    }
    try {
      // setIsLoading(true);
      await fetch(`${apiAuth}/register`, {
        method: "POST",
        body: formData,
      }).then((res) => {
        if (res.ok) {
          toast.success("User  created successfully", {
            description: "You can manage your users in the manage users page.",
            action: {
              label: "Go to Manage Users",
              onClick: () => navigation("/dashboard/users/manage"),
            },
          });
          form.reset();
        } else {
          toast.error("Failed to create user. Please try again.");
        }
      });
    } catch (error) {
      console.error("Error submitting user:", error);
    } finally {
      // setIsLoading(false);
      setUserS(!userS);
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
  // const renderFormFieldSelect = (name: string, label: string, options: Role[]) => (
  //   <FormField
  //     control={form.control}
  //     name={name as keyof UserForm}
  //     render={({ field }) => (
  //       <FormItem>
  //         <div className="flex items-center justify-between">
  //           <FormLabel>{label}</FormLabel>
  //           <FormMessage />
  //         </div>
  //         <Select onValueChange={field.onChange} defaultValue={field.value}>
  //           <FormControl>
  //             <SelectTrigger>
  //               <SelectValue placeholder={label} />
  //             </SelectTrigger>
  //           </FormControl>
  //           <SelectContent>
  //             {options.map((option) => (
  //               <SelectItem key={option.id} value={option.id}>
  //                 {option.roleName}
  //               </SelectItem>
  //             ))}
  //           </SelectContent>
  //         </Select>
  //       </FormItem>
  //     )}
  //   />
  // );
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
                <Button type="submit" size="lg">
                  Save
                </Button>
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
              {renderFormField("Email", "Email")}
              {renderFormField("Username", "Username")}
              {renderFormField("FullName", "Full Name")}
              {/* {renderFormFieldSelect("Role", "Role", roles)} */}
              {renderFormField("Password", "Password", "password")}
              {renderFormField("ConfirmPassword", "Confirm Password", "password")}
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
};
export default CreateNewUser;
