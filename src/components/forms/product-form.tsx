import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PlusCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { forwardRef, useEffect, useRef, useState } from "react";

import useMediaQuery from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
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
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Loader2 } from "lucide-react";
import { Product, SizeProduct, StatusProduct } from "@/constants/data";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRecoilState } from "recoil";
import { productState } from "@/Page/Dashboard/Products/productAtom";
import { environment } from "@/environments/environments";

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

const ProductForm = forwardRef(({ action, data }: { action: string; data?: Product }, ref) => {
  const [productS, setProductS] = useRecoilState(productState);
  const [statusProduct, setStatusProduct] = useState<StatusProduct[]>([]);
  const [sizeProduct, setSizeProduct] = useState<SizeProduct[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageMassage, setImageMassage] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const productFormRef = useRef(ref || null);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const navigate = useNavigate();
  const idProduct = action === "edit" && data ? data.id : undefined;
  const API_URL = idProduct ? `${apiProduct}/update/${idProduct}` : `${apiProduct}/addProduct`;
  const API_GET_ONE_PRODUCT_URL = idProduct && `${apiProduct}/getOne/${idProduct}`;

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
    if (API_GET_ONE_PRODUCT_URL) {
      const fetchProduct = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(API_GET_ONE_PRODUCT_URL);
          const data = await response.json();
          const dataFile = data.images.map((imgBase64: string, index: number) => {
            return convertBase64ToFile(imgBase64, `image-${index + 1}.png`);
          });
          setImageFiles(dataFile);
          setIsLoading(false);
        } catch (error) {
          console.error("Error:", error);
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [API_GET_ONE_PRODUCT_URL]);
  const defaultValues: Partial<ProductForm> =
    action === "edit" && data
      ? {
          ProductName: data.productName,
          Brand: data.brand,
          Model: data.model,
          Power: data.power,
          Adapter: data.adapter,
          TimeIsBattery: data.timeIsBattery,
          TimeIsUse: data.timeIsUse,
          ManySpeaker: data.manySpeaker,
          ManyBass: data.manyBass,
          Treble: data.treble,
          ConnectWireless: data.connectWireless,
          ConnectMicroWireless: data.connectMicroWireless,
          ConnectOther: data.connectOther,
          PortWiredMicro: data.portWiredMicro,
          Length: data.length,
          Width: data.width,
          Height: data.height,
          Weight: data.weight,
          Material: data.material,
          ColorImg: data.colorImg,
          Frequency: data.frequency,
          Price: data.price,
          Status: data.status,
        }
      : {
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

  // const IdEmployee = localStorage.getItem("IdEmployee") || "";

  const handleUpload = async () => {
    const formData = new FormData();
    imageFiles.forEach((file) => formData.append("ImagesFile", file));
    formData.append("IdEmployee", "1203123");
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
      setIsLoading(true);
      toast({
        variant: "default",
        title: action === "edit" ? "Updating..." : "Creating...",
        description: "Please wait a moment...",
      });
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });
      // const data = await response.json();
      if (response.ok) {
        if (action === "create") {
          toast({
            title: "Created",
            description: "Product has been created successfully",
            action: (
              <ToastAction
                altText="Go to Manage"
                onClick={() => {
                  navigate("/dashboard/products/manage");
                }}
              >
                Go to Manage
              </ToastAction>
            ),
          });
        } else {
          toast({
            title: "Edited",
            description: "Product has been edited successfully",
          });
          setProductS(!productS);
        }
        // clear form
        form.reset();
        setImageFiles([]);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoadingEdit(false);
      setIsLoading(false);
    }
  };

  const handleUploadListFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles([...imageFiles, ...Array.from(e.target.files)]);
    }
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
      toast({
        variant: "destructive",
        title: "Missing Image(s)",
        description: "Please upload image(s)",
      });
      return;
    } else {
      handleUpload();
      setImageMassage("");
      setOpen(false);
      setIsLoading(false);
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

  const renderFormField = (name: string, label: string, type: string = "text") => (
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
            <Input placeholder={`Enter ${label}`} {...field} type={type} />
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
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
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
    <Select onValueChange={handleOnValueChange}>
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
          <DialogContent
            ref={
              productFormRef as React.RefObject<HTMLDivElement> as React.RefObject<HTMLDivElement>
            }
            className="min-w-[80%] h-[70%]"
          >
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>{`Edit product ${data.id}`}</DialogDescription>
            </DialogHeader>
            <Separator className="mb-4" />
            {/* <BlogForm action={action} data={data} /> */}
            <ScrollArea className="p-5 -m-4 py-0 h-[100%]">
              <Form {...form}>
                <form className="h-full space-y-5" onSubmit={form.handleSubmit(onSubmitProduct)}>
                  <div className="sticky top-0 left-0 right-0 z-10">
                    <Button className="w-full" type="submit" size="lg" disabled={isLoadingEdit}>
                      {isLoadingEdit ? (
                        <span>
                          <Loader2 className="animate-spin" /> Saving...
                        </span>
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </div>
                  <div className="grid h-full grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="h-full">
                      <div className="grid w-full h-full grid-cols-1 gap-5">
                        <Card>
                          <CardHeader>
                            <CardTitle>Product Information</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {renderFormField("ProductName", "Product Name")}
                            {renderFormField("Brand", "Brand")}
                            {renderFormField("Model", "Model")}
                            {renderFormField("Price", "Price")}
                            {/* {renderFormField("Status", "Status")} */}
                            {renderFormFieldSelect("Status", "Status", statusProduct)}
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle>Product Specifications</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
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
                              <span className="text-sm font-semibold text-red-500">
                                {imageMassage}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* input list file image */}
                            {/* {renderFormField("imageUrls", "Image Urls", "file")} */}
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
                                <label htmlFor="imageInput" className="flex-1 cursor-pointer">
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
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle>Product Dimensions</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {renderSelectOptions("Size Product", "Select size", sizeProduct)}
                            {renderFormField("Width", "Width")}
                            {renderFormField("Height", "Height")}
                            {renderFormField("Length", "Length")}
                            {renderFormField("Weight", "Weight")}
                            {renderFormField("Material", "Material")}
                            {renderFormField("ColorImg", "ColorImg")}
                            {renderFormField("Frequency", "Frequency")}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </form>
              </Form>
            </ScrollArea>
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
        <DrawerContent ref={productFormRef as React.RefObject<HTMLDivElement>} className="h-[80%]">
          <DrawerHeader className="text-left">
            <DrawerTitle>Edit Product</DrawerTitle>
            <DrawerDescription>{`Edit product ${data.id}`}</DrawerDescription>
          </DrawerHeader>
          <Separator className="px-4 mb-4" />
          <ScrollArea className="p-5 pt-0 -m-1 h-[100%]">
            <Form {...form}>
              <form className="h-full space-y-5" onSubmit={form.handleSubmit(onSubmitProduct)}>
                <div className="sticky top-0 left-0 right-0 z-10">
                  <Button className="w-full" type="submit" size="lg" disabled={isLoadingEdit}>
                    {isLoadingEdit ? (
                      <span>
                        <Loader2 className="animate-spin" /> Saving...
                      </span>
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
                <div className="grid h-full grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="h-full">
                    <div className="grid w-full h-full grid-cols-1 gap-5">
                      <Card>
                        <CardHeader>
                          <CardTitle>Product Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {renderFormField("ProductName", "Product Name")}
                          {renderFormField("Brand", "Brand")}
                          {renderFormField("Model", "Model")}
                          {renderFormField("price", "Price")}
                          {renderFormField("status", "Status")}
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Product Specifications</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
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
                            <span className="text-sm font-semibold text-red-500">
                              {imageMassage}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* input list file image */}
                          {/* {renderFormField("imageUrls", "Image Urls", "file")} */}
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
                              <label htmlFor="imageInput" className="flex-1 cursor-pointer">
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
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Product Dimensions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {renderSelectOptions("Size Product", "Select size", sizeProduct)}
                          {renderFormField("Width", "Width")}
                          {renderFormField("Height", "Height")}
                          {renderFormField("Length", "Length")}
                          {renderFormField("Weight", "Weight")}
                          {renderFormField("Material", "Material")}
                          {renderFormField("ColorImg", "ColorImg")}
                          {renderFormField("Frequency", "Frequency")}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </ScrollArea>
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Form {...form}>
      <form className="h-full space-y-5" onSubmit={form.handleSubmit(onSubmitProduct)}>
        <div className="sticky top-0 left-0 right-0 z-10 space-y-5 bg-background">
          <div className="flex items-start justify-between">
            <Heading
              icon="createProduct"
              title="Create New Product"
              description="Create a new product and add it to the list of products."
            />
            <Button type="submit" size="lg">
              Save
            </Button>
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
                <CardContent className="space-y-4">
                  {renderFormField("ProductName", "Product Name")}
                  {renderFormField("Brand", "Brand")}
                  {renderFormField("Model", "Model")}
                  {renderFormField("Price", "Price")}
                  {/* {renderFormField("Status", "Status")} */}
                  {renderFormFieldSelect("Status", "Status", statusProduct)}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Product Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                <CardContent className="space-y-4">
                  {/* input list file image */}
                  {/* {renderFormField("imageUrls", "Image Urls", "file")} */}
                  <div className="w-full -mt-4">
                    <ScrollArea className="w-full pb-4 mb-2 rounded-md">
                      <div className="flex items-center gap-4 pt-6 w-max">
                        {imageFiles.map((file, i) => (
                          <div key={i} className="relative flex flex-col items-center gap-2 group">
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
                      <label htmlFor="imageInput" className="flex-1 cursor-pointer">
                        <div
                          className={cn(buttonVariants({}), "!h-16 cursor-pointer flex-1 w-full")}
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
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Product Dimensions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {renderSelectOptions("Size Product", "Select size", sizeProduct)}
                  {renderFormField("Width", "Width")}
                  {renderFormField("Height", "Height")}
                  {renderFormField("Length", "Length")}
                  {renderFormField("Weight", "Weight")}
                  {renderFormField("Material", "Material")}
                  {renderFormField("ColorImg", "ColorImg")}
                  {renderFormField("Frequency", "Frequency")}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
});

export default ProductForm;
