import { axios } from "@/libs/axios";
import { LoginAccount } from "@/types/context";

export type LoginRequest = {
  loginId: string;
  password: string;
};

export const login = (req: LoginRequest): Promise<void> => {
  return axios().postForm("/login", req);
};

export const logout = (): Promise<void> => {
  return axios().postForm("/logout");
};

export const loginStatus = (): Promise<void> => {
  return axios().get("/loginStatus");
};

export const loginAccount = (): Promise<LoginAccount> => {
  return axios().get("/loginAccount");
};
