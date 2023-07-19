// Pinia App Store
import { defineStore } from "pinia";
import { ActorRoleType, LoginAccount } from "@/types/context";

export type User = {
  id: string;
  name: string;
  roleType: ActorRoleType;
  authorityIds: string[];
};

export const useStore = defineStore("app", {
  state: () => ({
    logined: false as boolean,
    user: {
      id: "anonymous",
      name: "Anonymous",
      roleType: ActorRoleType.ANONYMOUS,
      authorityIds: [],
    } as User,
  }),
  getters: {
    isAdmin(state): boolean {
      switch (state.user.roleType) {
        case ActorRoleType.INTERNAL:
        case ActorRoleType.ADMINISTRATOR:
          return true;
        default:
          return false;
      }
    },
  },
  actions: {
    login(user: LoginAccount) {
      this.user = user;
      this.logined = true;
    },
    logout() {
      this.logined = false;
      this.user = {
        id: "unknown",
        name: "Anonymous",
        roleType: ActorRoleType.ANONYMOUS,
        authorityIds: [],
      };
    },
  },
});
