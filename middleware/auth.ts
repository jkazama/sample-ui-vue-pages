import { checkLogin } from "@/libs/app";
import { useStore } from "@/store/app";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (
    !to.matched
      .filter((m) => m.children.length == 0)
      ?.some((m) => m.meta.anonymous)
  ) {
    const store = useStore();
    const current = store.logined;
    const prefix =
      from && 0 <= from.path.indexOf("/admin") ? "/admin" : "/user";
    const ret = await checkLogin();
    if (!ret) {
      return current
        ? navigateTo(prefix + "/timeout")
        : navigateTo(prefix + "/login");
    }
  }
});
