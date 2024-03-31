import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { DataTableStatus } from "../tables/status-tables/data-table-status";
import { columns } from "../tables/status-tables/columns";
import { StatusProduct } from "@/constants/data";
import { useEffect, useState } from "react";
import { environment } from "@/environments/environments";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "../ui/use-toast";
import { useRecoilState } from "recoil";
import { statusProductState } from "@/Page/Categories/categoriesAtom";

const apiStatus = environment.serverURL.apiStatus;

const statusProductFromSchema = z.object({
  NameStatus: z.string().min(1),
});

type StatusProductForm = z.infer<typeof statusProductFromSchema>;

const StatusForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [statusProductS] = useRecoilState(statusProductState);
  const [statusProduct, setStatusProduct] = useState<StatusProduct[]>([]);

  const defaultValues: StatusProductForm = {
    NameStatus: "",
  };
  const form = useForm<StatusProductForm>({
    resolver: zodResolver(statusProductFromSchema),
    defaultValues,
  });

  const onSubmitStatusProduct = async (data: StatusProductForm) => {
    const apiUrl = `${apiStatus}/addStatus`;
    try {
      setIsLoading(true);
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        toast({
          title: "Status added",
          description: "The status has been added successfully",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred while adding the status",
        });
      }
    } catch (error) {
      console.error("Error adding status:", error);
    } finally {
      setIsLoading(false);
      form.reset();
      fetchStatusProduct();
    }
  };
  const fetchStatusProduct = async () => {
    const apiUrl = `${apiStatus}/getList`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setStatusProduct(data);
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  useEffect(() => {
    fetchStatusProduct();
  }, [statusProductS]);

  return (
    <Card className="max-h-full h-fit">
      <CardHeader>
        <CardTitle>Manage Status</CardTitle>
        <CardDescription>Add and delete category status</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitStatusProduct)}
            className="flex w-full space-x-2"
          >
            <FormField
              control={form.control}
              name="NameStatus"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input className="w-full" placeholder="Status name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isLoading} type="submit" className="space-x-1">
              <PlusIcon className="w-4 h-4" />
              <span>Add new</span>
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardContent>
        <DataTableStatus data={statusProduct} columns={columns} />
      </CardContent>
    </Card>
  );
};

export default StatusForm;
