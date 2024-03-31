import UserForm from "@/components/forms/user-form";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/constants/data";
import { MoreHorizontal } from "lucide-react";
interface CellActionProps {
  data: User["id"];
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  // const [user, setUser] = useState<User>();
  // const fetchUserById = async (id: User["id"]) => {
  //   const response = await fetch(`${apiUser}/user/${id}`)
  //     .then((res) => res.json())
  //     .catch((error) => {
  //       console.error("Error fetching user by id:", error);
  //     });
  //   setUser(response);
  // };
  // useEffect(() => {
  //   fetchUserById(data.id);
  // }, [data.id]);
  // const onConfirm = async () => {
  //   await handleDelete();
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //     setOpen(false);
  //   }, 1000);
  // };
  // const handleDelete = async () => {
  //   await fetch(`${apiUser}/Delete/${data.id}`, {
  //     method: "DELETE",
  //   })
  //     .then((res) => res.json())
  //     .then((res) => {
  //       toast({
  //         variant: res.status === "true" ? "default" : "destructive",
  //         title: "Delete User",
  //         description: res.message,
  //         duration: 5000,
  //       });
  //     })
  //     .finally(() => {
  //       setUserS(!userS);
  //     });
  // };
  return (
    <>
      {/* <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      /> */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <UserForm action="edit" data={data} />
          </DropdownMenuItem>
          {/* <DropdownMenuItem
            asChild
            onClick={() => {
              navigation(`/dashboard/blogs/${data.id}`);
            }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="justify-start w-full font-normal cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </DropdownMenuItem> */}
          {/* <DropdownMenuItem asChild onClick={() => setOpen(true)}>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start w-full font-normal cursor-pointer"
            >
              <Trash className="w-4 h-4 mr-2" /> Delete
            </Button>
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
