import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Role, Routers } from "@/constants/data";
import { useEffect } from "react";
import { toast } from "sonner";
import { environment } from "@/environments/environments";

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

type Props = {
  role: Role;
  routers: Routers[];
  listCheck?: Routers["id"][];
  isAddNew?: boolean;
};

export function CheckboxReactHookFormMultiple({ role, routers, listCheck, isAddNew }: Props) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: [],
    },
  });
  useEffect(() => {
    form.setValue("items", listCheck || []);
  }, [listCheck]);
  function onSubmit(data: z.infer<typeof FormSchema>) {
    const body = isAddNew
      ? {
          RoleName: role.roleName,
          RoutersId: data.items,
        }
      : {
          Id: role.id,
          RoleName: role.roleName,
          RoutersId: data.items,
        };
    // submit data
    const apiUrl = isAddNew
      ? `${environment.serverURL.apiRole}/addRole`
      : `${environment.serverURL.apiRole}/update/${role.id}`;
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        toast.success("Update role successfully");
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Update role failed");
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem>
              {/* <div className="mb-4">
                <FormLabel className="text-base">Sidebar</FormLabel>
                <FormDescription>
                  Select the items you want to display in the sidebar.
                </FormDescription>
              </div> */}
              {routers.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="items"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            disabled={role?.roleName == "ADMIN"}
                            className="w-5 h-5 mt-1"
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(field.value?.filter((value) => value !== item.id));
                            }}
                          />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="text-lg">{item.label}</FormLabel>
                          <FormDescription className="text-sm font-normal">
                            {item.href}
                          </FormDescription>
                        </div>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        {role?.roleName !== "ADMIN" && (
          <Button type="submit">{isAddNew ? "Add new role" : "Update role"}</Button>
        )}
      </form>
    </Form>
  );
}
