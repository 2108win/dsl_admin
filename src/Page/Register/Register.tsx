import logo from "../../assets/svg/logo.svg";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import UserAuthForm from "@/components/forms/user-auth-form";

const RegisterPage = () => {
  localStorage.clear();
  return (
    <div className="relative flex-col items-center justify-center h-screen md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <a
        href="/login"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        Login
      </a>
      <div className="relative flex-col hidden h-full p-10 text-white bg-muted dark:border-r lg:flex">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)",
          }}
        />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <img src={logo} alt="" className="w-20" />
          Loa Tại Xưởng
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This library has saved me countless hours of work and helped me deliver
              stunning designs to my clients faster than ever before.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className="flex items-center h-full p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>
          <UserAuthForm type="register" />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
