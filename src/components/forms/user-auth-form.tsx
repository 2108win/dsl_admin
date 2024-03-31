import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { decodedToken } from "@/types";
import { useToast } from "../ui/use-toast";
import { environment } from "@/environments/environments";
import { sha256 } from "js-sha256";

const apiAuth = environment.serverURL.apiAuth;

const formSchemaLogin = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

// password must be at least 8 characters long, and must contain at least one uppercase letter, one lowercase letter, one number, and one special character

const formSchemaRegister = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters long" }),
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters long" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

type UserFormValueLogin = z.infer<typeof formSchemaLogin>;
type UserFormValueRegister = z.infer<typeof formSchemaRegister>;

export default function UserAuthForm({ type }: { type: "login" | "register" }) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // const searchParams = useSearchParams();
  // const callbackUrl = searchParams.get("callbackUrl");
  // const [loading, setLoading] = useState(false);

  const formLogin = useForm<UserFormValueLogin>({
    resolver: zodResolver(formSchemaLogin),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const formRegister = useForm<UserFormValueRegister>({
    resolver: zodResolver(formSchemaRegister),
    defaultValues: {
      email: "",
      username: "",
      fullName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmitLogin = async (data: UserFormValueLogin) => {
    toast({
      description: "Logging in ...",
    });
    const passwordSha256 = sha256(data.password);
    const dataLogin = {
      email: data.email,
      password: passwordSha256,
    };
    // console.log("🚀 ~ onSubmitLogin ~ data:", data.password, "new:====", dataLogin);
    try {
      setLoading(true);
      const response = await fetch(`${apiAuth}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataLogin),
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData.token) {
          const token = resData.token;
          localStorage.setItem("token", token);
          const decodedToken: decodedToken = jwtDecode(token);
          if (decodedToken) {
            localStorage.setItem(
              "role",
              decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
            );
            localStorage.setItem(
              "name",
              decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
            );
            localStorage.setItem(
              "email",
              decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]
            );
            localStorage.setItem("idEmployee", decodedToken["Id"]);
            navigate("/dashboard");
          }
          toast({
            title: "Success",
            description: "You have successfully logged in.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: resData.message,
          });
        }
      } else {
        // Handle error
        toast({
          variant: "destructive",
          title: "Error",
          description: "Something went wrong. Please try again later.",
        });
      }
    } catch (error) {
      console.error("Error login:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitRegister = async (data: UserFormValueRegister) => {
    if (data.password !== data.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      });
      return;
    }
    setLoading(true);
    try {
      const dataRegister = {
        email: data.email,
        username: data.username,
        fullName: data.fullName,
        password: data.password,
        role: "4bcba242-fc72-4d4d-a635-4af81da82576",
      };
      const response = await fetch(`${apiAuth}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataRegister),
      });
      if (response.ok) {
        // const resData = await response.json();
        toast({
          title: "Success",
          description: "You have successfully registered.",
        });
        navigate("/login");
      } else {
        const resDataText = await response.text();
        toast({
          variant: "destructive",
          title: "Error",
          description: resDataText,
        });
      }
    } catch (error) {
      console.error("Error register:", error);
    } finally {
      setLoading(false);
    }
  };

  return type === "register" ? (
    <Form {...formRegister}>
      <form onSubmit={formRegister.handleSubmit(onSubmitRegister)} className="w-full space-y-2">
        <FormField
          control={formRegister.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Email</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input type="email" placeholder="Enter your email..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={formRegister.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Username</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input type="text" placeholder="Enter your username..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={formRegister.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Full Name</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input type="text" placeholder="Enter your full name..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={formRegister.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input type="password" placeholder="Enter your password..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={formRegister.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Confirm Password</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input type="password" placeholder="Enter your password..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        {loading ? (
          <Button className="w-full !mt-6" disabled>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading ...
          </Button>
        ) : (
          <Button className="w-full !mt-6" type="submit">
            Register
          </Button>
        )}
      </form>
    </Form>
  ) : (
    <Form {...formLogin}>
      <form onSubmit={formLogin.handleSubmit(onSubmitLogin)} className="w-full space-y-2">
        <FormField
          control={formLogin.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Email</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input type="email" placeholder="Enter your email..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={formLogin.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input type="password" placeholder="Enter your password..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {loading ? (
          <Button className="w-full !mt-6" disabled>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading ...
          </Button>
        ) : (
          <Button className="w-full !mt-6" type="submit">
            Login
          </Button>
        )}
      </form>
    </Form>
  );
}
