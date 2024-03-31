import { RouterProvider } from "react-router-dom";
import "./App.css";
import { RecoilRoot } from "recoil";
import { router } from "./Router";
import { ThemeProvider } from "./components/layout/ThemeToggle/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RecoilRoot>
        <RouterProvider router={router} />
      </RecoilRoot>
    </ThemeProvider>
  );
}

export default App;
