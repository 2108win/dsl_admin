import { environment } from "@/environments/environments";
import { atom, selector } from "recoil";

const apiStatus = environment.serverURL.apiStatus;
const apiSizeProduct = environment.serverURL.apiSizeProduct;

export const statusProductState = atom({
  key: "statusProductState",
  default: false,
});

export const statusListRecoil = selector({
  key: "statusListRecoil",
  get: async () => {
    const status = await fetch(`${apiStatus}/getList`).then((res) => res.json());
    return status;
  },
});

export const sizeProductState = atom({
  key: "sizeProductState",
  default: false,
});

export const sizeProductListRecoil = selector({
  key: "sizeProductListRecoil",
  get: async () => {
    const sizeProduct = await fetch(`${apiSizeProduct}/getList`).then((res) => res.json());
    return sizeProduct;
  },
});
