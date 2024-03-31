import { ScrollArea } from "@/components/ui/scroll-area";
import Layout from "../Layout/layout";

const DashboardPage = () => {
  return (
    <Layout>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Hi, Welcome back 👋</h2>
          </div>
          <h3 className="text-2xl font-bold tracking-tight">This is Dashboard</h3>
        </div>
      </ScrollArea>
    </Layout>
  );
};
export default DashboardPage;
