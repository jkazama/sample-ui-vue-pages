import { axios } from "@/libs/axios";
import { UserRegCashOut, UserCashOut } from "@/types/asset";

export const findUnprocessedCashOut = (): Promise<UserCashOut[]> => {
  return axios().get("/asset/cio/unprocessedOut");
};

export const withdraw = (req: UserRegCashOut): Promise<void> => {
  return axios().post("/asset/cio/withdraw", req);
};
