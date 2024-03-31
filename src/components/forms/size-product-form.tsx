import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { DataTableSizeProduct } from "../tables/size-product-tables/data-table-size-product";
import { columns } from "../tables/size-product-tables/columns";
import { SizeProduct } from "@/constants/data";
import { useEffect, useState } from "react";
import { environment } from "@/environments/environments";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "../ui/use-toast";
import { useRecoilState } from "recoil";
import { sizeProductState } from "@/Page/Categories/categoriesAtom";

const apiSizeProduct = environment.serverURL.apiSizeProduct;

const sizeProductFromSchema = z.object({
  NameSize: z.string().min(3),
  Width: z.string().min(1),
  Height: z.string().min(1),
  Length: z.string().min(1),
  Weight: z.string().min(1),
});

type SizeProductForm = z.infer<typeof sizeProductFromSchema>;

const SizeProductForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sizeProductS] = useRecoilState(sizeProductState);
  const [sizeProduct, setSizeProduct] = useState<SizeProduct[]>([]);

  const defaultValues: SizeProductForm = {
    NameSize: "",
    Width: "",
    Height: "",
    Length: "",
    Weight: "",
  };
  const form = useForm<SizeProductForm>({
    resolver: zodResolver(sizeProductFromSchema),
    defaultValues,
  });

  const onSubmitSizeProduct = async (data: SizeProductForm) => {
    const apiUrl = `${apiSizeProduct}/addSize`;
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
          title: "Size added",
          description: "The size has been added successfully",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred while adding the size",
        });
      }
    } catch (error) {
      console.error("Error adding size:", error);
    } finally {
      setIsLoading(false);
      form.reset();
      fetchSizeProduct();
    }
  };
  const fetchSizeProduct = async () => {
    const apiUrl = `${apiSizeProduct}/getList`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setSizeProduct(data);
    } catch (error) {
      console.error("Error fetching size:", error);
    }
  };

  useEffect(() => {
    fetchSizeProduct();
  }, [sizeProductS]);

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Manage Size</CardTitle>
        <CardDescription>Add and delete category size</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitSizeProduct)} className="flex w-full space-x-2">
            <div className="flex flex-col w-full gap-2">
              <FormField
                control={form.control}
                name="NameSize"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input className="w-full" placeholder="Size name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("NameSize") && (
                <div className="grid grid-cols-4 gap-2">
                  {["Width", "Height", "Length", "Weight"].map((name) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name as keyof SizeProductForm}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input className="w-full" placeholder={name} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
            <Button disabled={isLoading} type="submit" className="space-x-1">
              <PlusIcon className="w-4 h-4" />
              <span>Add new</span>
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardContent>
        <DataTableSizeProduct data={sizeProduct} columns={columns} />
      </CardContent>
    </Card>
  );
};

export default SizeProductForm;
