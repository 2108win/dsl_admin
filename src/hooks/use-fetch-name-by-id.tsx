import { Role, StatusProduct } from "@/constants/data";

export const useFetchRoleNameById = (id: string, role: Role[]) => {
  const roleName = role.find((r) => r.id === id);
  return roleName?.roleName;
};

export const useFetchStatusNameById = (id: string, status: StatusProduct[]) => {
  const statusName = status.find((s) => s.id === id);
  return statusName?.nameStatus;
};
