import Layout from "@/Page/Layout/layout";
import BreadCrumb from "@/components/breadcrumb";
import UserForm from "@/components/forms/user-form";

const breadcrumbItems = [
  { title: "User", link: "/dashboard/users" },
  { title: "Create New User", link: "/dashboard/users/create" },
];
const CreateNewUser = () => {
  return (
    <Layout>
      <div className="flex-1 h-full space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <UserForm action="create" />
      </div>
    </Layout>
  );
};
export default CreateNewUser;
