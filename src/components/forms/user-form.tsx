import { forwardRef, useEffect, useRef, useState } from "react";
import { environment } from "@/environments/environments";
import { Role, User } from "@/constants/data";
import { userState } from "@/Page/Dashboard/Users/userAtom";
import { useRecoilState } from "recoil";
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
import { Edit, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "../ui/separator";
import useMediaQuery from "@/hooks/use-media-query";
import { toast } from "../ui/use-toast";
import { Heading } from "../ui/heading";
import { Label } from "../ui/label";

const apiAuth = environment.serverURL.apiAuth;
const apiRole = apiAuth + "/role";
const apiUser = apiAuth + "/user";

const userFormSchema = z.object({
  Email: z.string().min(3),
  Username: z.string().min(3),
  FullName: z.string().min(3),
  Password: z.string().min(8),
  ConfirmPassword: z.string().min(8),
  Role: z.string().min(1),
});

type UserForm = z.infer<typeof userFormSchema>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UserForm = forwardRef(({ action, data }: { action: string; data?: User["id"] }, ref) => {
  const [userS, setUserS] = useRecoilState(userState);
  const [roles, setRoles] = useState<Role[]>([]);
  const [open, setOpen] = useState(false);
  const [imageMassage, setImageMassage] = useState("");
  const [avatarImage, setAvatarImage] = useState<File>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);

  const userFormRef = useRef(null);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const API_URL = data ? `${apiAuth}/update/user/${data}` : `${apiAuth}/register`;
  useEffect(() => {
    const fetchData = async () => {
      if (data) {
        try {
          const res = await fetch(`${apiUser}/${data}`);
          const userData = await res.json();

          form.setValue("Email", userData.email);
          form.setValue("Username", userData.userName);
          form.setValue("FullName", userData.fullName);
          form.setValue("Role", userData.role);
          form.setValue("Password", userData.passwordHash);
          form.setValue("ConfirmPassword", userData.passwordHash);

          const avatarData = convertBase64ToFile(userData.avatar, `${userData.fullName}.png`);
          setAvatarImage(avatarData);
        } catch (err) {
          console.error(err);
          // Show toast or notification for error
          toast({
            title: "Error",
            description: "Failed to fetch user data ",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [data]);

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
    fetch(`${apiRole}/getAll`)
      .then((res) => res.json())
      .then((data) => setRoles(data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

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
      toast({
        title: "Error",
        description: "Image is required",
        variant: "destructive",
      });
      return;
    }
    const formData = new FormData();
    formData.append("ImageFile", avatarImage);
    formData.append("email", form.getValues().Email);
    formData.append("username", form.getValues().Username);
    formData.append("fullName", form.getValues().FullName);
    formData.append("password", form.getValues().Password);
    formData.append("confirmPassword", form.getValues().ConfirmPassword);
    if (action === "edit") {
      formData.append("role", form.getValues().Role);
    }
    if (form.getValues().Password !== form.getValues().ConfirmPassword) {
      form.setFocus("Password");
      toast({
        title: "Error",
        description: "Password and Confirm Password must be the same",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsLoading(true);
      await fetch(API_URL, {
        method: "POST",
        body: formData,
      }).then((res) => {
        if (res.ok) {
          toast({
            title: action === "create" ? "User created" : "User updated",
            description: `User ${form.getValues().FullName} has been ${
              action === "create" ? "created" : "updated"
            }`,
          });
          form.reset();
        } else {
          toast({
            title: "Error",
            description: "Something went wrong",
            variant: "destructive",
          });
        }
      });
    } catch (error) {
      console.error("Error submitting user:", error);
    } finally {
      setIsLoadingEdit(false);
      setIsLoading(false);
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

  if (action === "edit" && data) {
    if (isLoading) {
      return (
        <Button variant="ghost" size="sm" className="justify-start w-full p-2 font-normal">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Edit...
        </Button>
      );
    }
    if (isDesktop) {
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="justify-start w-full p-2 font-normal">
              <Edit className="w-4 h-4 mr-2" /> Edit
            </Button>
          </DialogTrigger>
          <DialogContent ref={userFormRef} className="min-w-[80%]">
            <DialogHeader>
              <DialogTitle>{`User ${form.getValues().FullName}`}</DialogTitle>
              <DialogDescription>{`Edit user ${data}`}</DialogDescription>
            </DialogHeader>
            <Separator />
            {/* <BlogForm action={action} data={data} /> */}
            <Form {...form}>
              <form
                className="grid items-start h-full grid-cols-1 gap-4 md:grid-cols-2"
                onSubmit={form.handleSubmit(onSubmitUser)}
              >
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
                    <AvatarFallback>{form.getValues("FullName")}</AvatarFallback>
                  </Avatar>
                </div>
                {renderFormField("Email", "Email")}
                {renderFormField("Username", "Username")}
                {renderFormField("FullName", "Full Name")}
                {renderFormFieldSelect("Role", "Role", roles)}
                {renderFormField("Password", "Password", "password", true)}
                {renderFormField("ConfirmPassword", "Confirm Password", "password", true)}
                <Button
                  className="w-full col-span-2 mt-auto"
                  type="submit"
                  size="lg"
                  disabled={isLoadingEdit}
                >
                  {isLoadingEdit ? (
                    <span>
                      <Loader2 className="animate-spin" /> Saving...
                    </span>
                  ) : (
                    "Save"
                  )}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      );
    }
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="sm" className="justify-start w-full p-2 font-normal">
            <Edit className="w-4 h-4 mr-2" /> Edit
          </Button>
        </DrawerTrigger>
        <DrawerContent ref={userFormRef}>
          <DrawerHeader>
            <DrawerTitle>{`User ${form.getValues().FullName}`}</DrawerTitle>
            <DrawerDescription>{`Edit user ${data}`}</DrawerDescription>
          </DrawerHeader>
          <Separator />
          <Form {...form}>
            <form
              className="grid items-start h-full grid-cols-1 gap-4 md:grid-cols-2"
              onSubmit={form.handleSubmit(onSubmitUser)}
            >
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
                  <AvatarFallback>{form.getValues("FullName")}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col gap-4 p-4">
                {renderFormField("Email", "Email")}
                {renderFormField("Username", "Username")}
                {renderFormField("FullName", "Full Name")}
                {renderFormFieldSelect("Role", "Role", roles)}
                {renderFormField("Password", "Password", "password", true)}
                {renderFormField("ConfirmPassword", "Confirm Password", "password", true)}
              </div>
              <DrawerFooter>
                <Button
                  className="w-full col-span-2 mt-auto"
                  type="submit"
                  size="lg"
                  disabled={isLoadingEdit}
                >
                  {isLoadingEdit ? (
                    <span>
                      <Loader2 className="animate-spin" /> Saving...
                    </span>
                  ) : (
                    "Save"
                  )}
                </Button>
              </DrawerFooter>
            </form>
          </Form>
        </DrawerContent>
      </Drawer>
    );
  }
  return (
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
            <Input id="picture" type="file" accept="image/*" onChange={handleUploadAvatarImage} />
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
  );
});

export default UserForm;
