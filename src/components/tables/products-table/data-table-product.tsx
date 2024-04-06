import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
// import { Button } from "./button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2, Trash } from "lucide-react";
import { useRecoilState } from "recoil";
import { productState } from "@/Page/Dashboard/Products/productAtom";
import { AlertModal } from "@/components/modal/alert-modal";
import { environment } from "@/environments/environments";
import { StatusProduct } from "@/constants/data";
// import { statusListRecoil } from "@/Page/Categories/categoriesAtom";
import { toast } from "sonner";

const apiProduct = environment.serverURL.apiProduct;

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
}

export function DataTableProduct<TData extends object, TValue>({
  columns,
  data,
  searchKey,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [open, setOpen] = useState(false);
  const [productS, setProductS] = useRecoilState(productState);
  // const [statusList] = useRecoilValue(statusListRecoil) as [StatusProduct[]];
  const [statusList, setStatusList] = useState<StatusProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });
  useEffect(() => {
    fetch(`${apiProduct}/getList`)
      .then((res) => res.json())
      .then((res) => {
        setStatusList(res);
      });
  }, []);
  const getIdFilteredSelectedRowModel = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => (row.original as { id: string }).id);

  const handleDeleteSelected = () => {
    setIsLoading(true);
    getIdFilteredSelectedRowModel.forEach(async (id) => {
      if (statusList.find((status) => status.id === id)) {
        toast.error("Cannot delete product", {
          description: "This product is associated with a status. Please delete the status first.",
        });
        setIsLoading(false);
        return;
      }
      await fetch(`${apiProduct}/Delete/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === "true") {
            toast.success(`Deleted successfully ${id}`, {
              description: res.message,
            });
            setProductS(!productS);
            setOpen(false);
          } else {
            toast.error("Failed to delete", {
              description: res.message,
            });
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteSelected}
        loading={isLoading}
      />
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder={`Search ${searchKey}...`}
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="w-full md:max-w-sm"
        />

        <div className="flex gap-2 md:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            disabled={!getIdFilteredSelectedRowModel.length}
            variant="destructive"
            onClick={() => setOpen(true)}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
      <ScrollArea className="rounded-md border h-[calc(80vh-220px)]">
        <Table className="relative">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="flex items-center justify-end py-4 space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        {/* <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div> */}
      </div>
    </>
  );
}
