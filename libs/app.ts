import { loginAccount, loginStatus } from "@/api/context";
import { useStore } from "@/store/app";
import { LoginedKey, LogoutKey, useEventStore } from "@/store/event";

export const checkLogin = async (
  success: () => void = () => {},
  failure: () => void = () => {}
): Promise<boolean> => {
  const store = useStore();
  const event = useEventStore();
  try {
    await loginStatus();
    if (store.logined) {
      success();
      return true;
    }
    const user = await loginAccount();
    event.emit(LoginedKey, user);
    success();
    return true;
  } catch (err) {
    event.emit(LogoutKey, undefined);
    failure();
    return false;
  }
};

export const formatAmount = (v: string): string => {
  if (v) {
    return v.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  } else if (v === "0") {
    return "0";
  } else {
    return "";
  }
};
