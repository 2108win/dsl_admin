import { RouterProvider } from "react-router-dom";
import "./App.css";
import { RecoilRoot } from "recoil";
import { router } from "./Router";
import { ThemeProvider } from "./components/layout/ThemeToggle/theme-provider";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <RecoilRoot>
        <RouterProvider router={router} />
        <Toaster />
      </RecoilRoot>
    </ThemeProvider>
  );
}

export default App;
