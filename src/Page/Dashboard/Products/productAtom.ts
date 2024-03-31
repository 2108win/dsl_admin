import { environment } from "@/environments/environments";
import { atom, selector } from "recoil";

export const productState = atom({
  key: "productState",
  default: false,
});
const apiStatus = environment.serverURL.apiStatus;

export const statusListState = selector({
  key: "statusListState",
  get: async () => {
    const status = await fetch(`${apiStatus}/getList`).then((res) => res.json());
    return status;
  },
});
