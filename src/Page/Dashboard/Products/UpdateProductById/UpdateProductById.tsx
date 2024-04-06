import BreadCrumb from "@/components/breadcrumb";
import { Button, buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { environment } from "@/environments/environments";
import { ArrowLeft, Loader2, PlusCircle, XCircle } from "lucide-react";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import Header from "@/components/layout/header";
import { toast } from "sonner";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product, SizeProduct, StatusProduct } from "@/constants/data";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const apiProduct = environment.serverURL.apiProduct;
const apiStatus = environment.serverURL.apiStatus;
const apiSizeProduct = environment.serverURL.apiSizeProduct;

const productFormSchema = z.object({
  ProductName: z.string().min(3),
  Brand: z.string().min(3),
  Model: z.string().min(3),
  Power: z.string().min(3),
  Adapter: z.string().min(3),
  TimeIsBattery: z.string().min(3),
  TimeIsUse: z.string().min(3),
  ManySpeaker: z.string().min(3),
  ManyBass: z.string().min(3),
  Treble: z.string().min(3),
  ConnectWireless: z.string().min(3),
  ConnectMicroWireless: z.string().min(3),
  ConnectOther: z.string().min(3),
  PortWiredMicro: z.string().min(3),
  Length: z.string().min(1),
  Width: z.string().min(1),
  Height: z.string().min(1),
  Weight: z.string().min(1),
  Material: z.string().min(3),
  ColorImg: z.string().min(3),
  Frequency: z.string().min(3),
  Price: z.string().min(1),
  Status: z.string().min(1),
});

type ProductForm = z.infer<typeof productFormSchema>;

const UpdateProductByIdPage = forwardRef(() => {
  const [statusProduct, setStatusProduct] = useState<StatusProduct[]>([]);
  const [sizeProduct, setSizeProduct] = useState<SizeProduct[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageMassage, setImageMassage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const { id } = useParams();
  const navigation = useNavigate();
  const productFormRef = useRef(null);

  const breadcrumbItems = [
    { title: "Manage Products", link: "/dashboard/products/manage" },
    { title: `Edit ${id}`, link: `/dashboard/products/update/${id}` },
  ];

  const API_URL = `${apiProduct}/update/${id}`;

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
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${apiProduct}/getOne/${id}`);
        const data: Product = await response.json();
        form.setValue("ProductName", data.productName);
        form.setValue("Brand", data.brand);
        form.setValue("Model", data.model);
        form.setValue("Power", data.power);
        form.setValue("Adapter", data.adapter);
        form.setValue("TimeIsBattery", data.timeIsBattery);
        form.setValue("TimeIsUse", data.timeIsUse);
        form.setValue("ManySpeaker", data.manySpeaker);
        form.setValue("ManyBass", data.manyBass);
        form.setValue("Treble", data.treble);
        form.setValue("ConnectWireless", data.connectWireless);
        form.setValue("ConnectMicroWireless", data.connectMicroWireless);
        form.setValue("ConnectOther", data.connectOther);
        form.setValue("PortWiredMicro", data.portWiredMicro);
        form.setValue("Length", data.length);
        form.setValue("Width", data.width);
        form.setValue("Height", data.height);
        form.setValue("Weight", data.weight);
        form.setValue("Material", data.material);
        form.setValue("ColorImg", data.colorImg);
        form.setValue("Frequency", data.frequency);
        form.setValue("Price", data.price);
        form.setValue("Status", data.status);

        const dataFile = data.images.map((item, index: number) => {
          return convertBase64ToFile(item, `image-${index + 1}.png`);
        });
        setImageFiles(dataFile);
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);
  const defaultValues: ProductForm = {
    ProductName: "",
    Brand: "",
    Model: "",
    Power: "",
    Adapter: "",
    TimeIsBattery: "",
    TimeIsUse: "",
    ManySpeaker: "",
    ManyBass: "",
    Treble: "",
    ConnectWireless: "",
    ConnectMicroWireless: "",
    ConnectOther: "",
    PortWiredMicro: "",
    Length: "",
    Width: "",
    Height: "",
    Weight: "",
    Material: "",
    ColorImg: "",
    Frequency: "",
    Price: "",
    Status: "",
  };
  const form = useForm<ProductForm>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });
  useEffect(() => {
    if (imageFiles.length > 0) {
      setImageMassage("");
    }
  }, [imageFiles, setImageMassage]);
  useEffect(() => {
    fetch(`${apiStatus}/getList`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setStatusProduct(data))
      .catch((error) => {
        console.error("Error:", error);
      });

    fetch(`${apiSizeProduct}/getList`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setSizeProduct(data))
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const idEmployee = localStorage.getItem("idEmployee") || "";

  const handleUpload = async () => {
    const formData = new FormData();
    imageFiles.forEach((file) => formData.append("ImagesFile", file));
    formData.append("IdEmployee", idEmployee);
    formData.append("ProductName", form.getValues("ProductName"));
    formData.append("Brand", form.getValues("Brand"));
    formData.append("Model", form.getValues("Model"));
    formData.append("Power", form.getValues("Power"));
    formData.append("Adapter", form.getValues("Adapter"));
    formData.append("TimeIsBattery", form.getValues("TimeIsBattery"));
    formData.append("TimeIsUse", form.getValues("TimeIsUse"));
    formData.append("ManySpeaker", form.getValues("ManySpeaker"));
    formData.append("ManyBass", form.getValues("ManyBass"));
    formData.append("Treble", form.getValues("Treble"));
    formData.append("ConnectWireless", form.getValues("ConnectWireless"));
    formData.append("ConnectMicroWireless", form.getValues("ConnectMicroWireless"));
    formData.append("ConnectOther", form.getValues("ConnectOther"));
    formData.append("PortWiredMicro", form.getValues("PortWiredMicro"));
    formData.append("Length", form.getValues("Length"));
    formData.append("Width", form.getValues("Width"));
    formData.append("Height", form.getValues("Height"));
    formData.append("Weight", form.getValues("Weight"));
    formData.append("Material", form.getValues("Material"));
    formData.append("ColorImg", form.getValues("ColorImg"));
    formData.append("Frequency", form.getValues("Frequency"));
    formData.append("Price", form.getValues("Price"));
    formData.append("Status", form.getValues("Status"));
    try {
      setIsLoadingEdit(true);
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });
      // const data = await response.json();
      if (response.ok) {
        toast.success("Product updated successfully", {
          description: "You can manage your products in the manage products page.",
          action: {
            label: "Go to Manage Products",
            onClick: () => navigation("/dashboard/products/manage"),
          },
        });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoadingEdit(false);
    }
  };

  const handleUploadListFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    const files = Array.from(e.target.files);
    const checkType = files.every((file) => file.type !== "image/svg+xml");
    if (!checkType) {
      setImageMassage("Please upload image(s) not svg");
      toast.warning("Please upload image(s) not svg");
      return;
    }
    const checkSize = files.every((file) => file.size <= 3 * 1024 * 1024);
    if (!checkSize) {
      setImageMassage("Please upload image(s) <= 3mb");
      toast.warning("Please upload image(s) <= 3mb");
      return;
    }
    setImageFiles([...imageFiles, ...Array.from(e.target.files)]);
  };

  const handleDeleteImage = (e: React.MouseEvent<HTMLSpanElement>, index: number) => {
    e.preventDefault();
    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);
    setImageFiles(newFiles);
  };

  const onSubmitProduct = async () => {
    if (imageFiles.length === 0) {
      setImageMassage("Please upload image(s)");
      toast.warning("Please upload image(s)");
      return;
    } else {
      handleUpload();
      setImageMassage("");
      setIsLoadingEdit(false);
    }
  };

  const handleOnValueChange = (id: string) => {
    const selectedSizeProduct = sizeProduct.find((size) => size.id === id);
    if (selectedSizeProduct) {
      form.setValue("Width", selectedSizeProduct.width);
      form.setValue("Height", selectedSizeProduct.height);
      form.setValue("Length", selectedSizeProduct.length);
      form.setValue("Weight", selectedSizeProduct.weight);
    }
  };

  const renderFormField = (name: string, label: string) => (
    <FormField
      control={form.control}
      name={name as keyof ProductForm}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>{label}</FormLabel>
            <FormMessage />
          </div>
          <FormControl>
            <Input placeholder={`Enter ${label}`} {...field} disabled={isLoading} />
          </FormControl>
        </FormItem>
      )}
    />
  );

  const renderFormFieldSelect = (name: string, label: string, options: StatusProduct[]) => (
    <FormField
      control={form.control}
      name={name as keyof ProductForm}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>{label}</FormLabel>
            <FormMessage />
          </div>
          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
            <FormControl ref={productFormRef as React.RefObject<HTMLDivElement>}>
              <SelectTrigger>
                <SelectValue placeholder={label} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.nameStatus}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );

  const renderSelectOptions = (name: string, label: string, options: SizeProduct[]) => (
    <Select onValueChange={handleOnValueChange} disabled={isLoading}>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{name}</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.nameSize}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );

  return (
    <>
      <Header />
      <div className="relative flex-1 w-full h-full p-4 mx-auto mt-16 space-y-4 max-w-7xl md:p-8">
        <ScrollArea className="p-5 -m-4 py-0 h-[100%]">
          <Form {...form}>
            <form className="h-full space-y-5" onSubmit={form.handleSubmit(onSubmitProduct)}>
              <div className="sticky z-10 w-full space-y-5 bg-background">
                <BreadCrumb items={breadcrumbItems} />
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigation("/dashboard/products/manage")}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  {isLoading ? (
                    <Skeleton className="w-40 h-10" />
                  ) : (
                    <div className="flex items-start justify-between w-full">
                      <Heading
                        title={`Update Product ${form.getValues("ProductName")}`}
                        description="Update product information and images."
                      />
                      <Button type="submit" size="lg" disabled={isLoadingEdit}>
                        {isLoadingEdit ? (
                          <span>
                            <Loader2 className="animate-spin" /> Saving...
                          </span>
                        ) : (
                          <span>Save</span>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
                <Separator />
              </div>
              <div className="grid h-full grid-cols-1 gap-5 md:grid-cols-2">
                <div className="h-full">
                  <div className="grid w-full h-full grid-cols-1 gap-5">
                    <Card>
                      <CardHeader>
                        <CardTitle>Product Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isLoading ? (
                          <Skeleton className="w-full h-10" />
                        ) : (
                          <div className="space-y-4">
                            {renderFormField("ProductName", "Product Name")}
                            {renderFormField("Brand", "Brand")}
                            {renderFormField("Model", "Model")}
                            {renderFormField("Price", "Price")}
                            {renderFormFieldSelect("Status", "Status", statusProduct)}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Product Specifications</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isLoading ? (
                          <Skeleton className="w-full h-20" />
                        ) : (
                          <div className="space-y-4">
                            {renderFormField("Power", "Power")}
                            {renderFormField("Adapter", "Adapter")}
                            {renderFormField("TimeIsBattery", "Time is Battery")}
                            {renderFormField("TimeIsUse", "Time is Use")}
                            {renderFormField("ManySpeaker", "Many Speaker")}
                            {renderFormField("ManyBass", "Many Bass")}
                            {renderFormField("Treble", "Treble")}
                            {renderFormField("ConnectWireless", "Connect Wireless")}
                            {renderFormField("ConnectMicroWireless", "Connect Micro Wireless")}
                            {renderFormField("ConnectOther", "Connect Other")}
                            {renderFormField("PortWiredMicro", "Port Wired Micro")}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
                <div>
                  <div className="grid w-full grid-cols-1 gap-5">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Product Images</CardTitle>
                          <span className="text-sm font-semibold text-red-500">{imageMassage}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {isLoading ? (
                          <Skeleton className="w-full h-20" />
                        ) : (
                          <div className="w-full -mt-4">
                            <ScrollArea className="w-full pb-4 mb-2 rounded-md">
                              <div className="flex items-center gap-4 pt-6 w-max">
                                {imageFiles.map((file, i) => (
                                  <div
                                    key={i}
                                    className="relative flex flex-col items-center gap-2 group"
                                  >
                                    <span
                                      className="absolute translate-x-1 rounded-full cursor-pointer bg-slate-400 hover:bg-red-600 -top-2 -right-1"
                                      onClick={(e) => handleDeleteImage(e, i)}
                                    >
                                      <XCircle className="text-white" />
                                    </span>
                                    <div className="h-[250px] overflow-hidden rounded-md border-2 group-hover:border-red-500">
                                      <img
                                        className="object-contain w-full h-full"
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                      />
                                    </div>
                                    <span className="text-sm max-w-[150px] truncate">
                                      {file.name.length > 13
                                        ? file.name.split(".")[0].substring(0, 10) + "..."
                                        : file.name.split(".")[0].substring(0, 13)}
                                      .{file.type.split("/")[1]}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                            <div className="flex items-center gap-4">
                              <label
                                htmlFor="imageInput"
                                className={cn(
                                  "flex-1 cursor-pointer",
                                  isLoadingEdit && "pointer-events-none opacity-60"
                                )}
                              >
                                <div
                                  className={cn(
                                    buttonVariants({}),
                                    "!h-16 cursor-pointer flex-1 w-full"
                                  )}
                                >
                                  <span className="flex items-center gap-2">
                                    <PlusCircle className="text-2xl" />
                                    <span>Upload image(s)</span>
                                  </span>
                                </div>
                              </label>
                              <span
                                className={cn(
                                  buttonVariants({ variant: "outline" }),
                                  "!h-16 cursor-pointer"
                                )}
                                onClick={() => setImageFiles([])}
                              >
                                Reset
                              </span>
                              <input
                                className="hidden"
                                id="imageInput"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleUploadListFile}
                              />
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Product Dimensions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isLoading ? (
                          <Skeleton className="w-full h-20" />
                        ) : (
                          <div className="space-y-4">
                            {renderSelectOptions("Size Product", "Select size", sizeProduct)}
                            {renderFormField("Width", "Width")}
                            {renderFormField("Height", "Height")}
                            {renderFormField("Length", "Length")}
                            {renderFormField("Weight", "Weight")}
                            {renderFormField("Material", "Material")}
                            {renderFormField("ColorImg", "ColorImg")}
                            {renderFormField("Frequency", "Frequency")}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </div>
    </>
  );
});

export default UpdateProductByIdPage;
