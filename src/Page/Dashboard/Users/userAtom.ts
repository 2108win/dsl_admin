import { environment } from "@/environments/environments";
import { atom, selector } from "recoil";

const apiRole = environment.serverURL.apiRole;
const apiAuth = environment.serverURL.apiAuth;

export const userState = atom({
  key: "userState",
  default: false,
});

// Define an atom for the role state
export const roleState = atom<string | null>({
  key: "roleState",
  default: null,
});

// Define a selector for the role list
export const roleListState = selector({
  key: "roleListState",
  get: async () => {
    const roles = await fetch(`${apiRole}/getList`).then((res) => res.json());
    return roles;
  },
});

export const userListRecoil = selector({
  key: "userListRecoil",
  get: async () => {
    const users = await fetch(`${apiAuth}/getList`).then((res) => res.json());
    return users;
  },
});
