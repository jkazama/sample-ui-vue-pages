import { Level, Log } from "@/libs/log";
import { LoginAccount } from "@/types";
import { defineStore } from "pinia";

export type Messages = {
  global: string;
  level: Level;
  columns: Record<string, string[]>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type AppEventKey<V> = {
  key: string;
};

export type AppEventAfter = {
  success: () => {};
  failure: () => {};
};

// AppEventKeys
export const LoginedKey: AppEventKey<LoginAccount> = { key: "logined" };
export const LogoutKey: AppEventKey<void> = { key: "logout" };

// Pinia App Store
export const useEventStore = defineStore("event", {
  state: () => ({
    messages: {
      global: "",
      level: Level.INFO,
      columns: {},
    } as Messages,
  }),
  actions: {
    notify(
      globalMessage: string,
      level: Level = Level.INFO,
      columnMessages: Record<string, string[]> = {} as Record<string, string[]>
    ): void {
      this.messages = {
        global: globalMessage || "",
        level: level,
        columns: columnMessages,
      } as Messages;
      if (globalMessage) {
        Log.debug(this.messages);
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    emit<T>(key: AppEventKey<T>, payload: T): void {
      // for etnry $onAction
    },
    on<T>(key: AppEventKey<T>, fn: (payload: T) => void): () => void {
      return this.$onAction((v) => {
        if (v.name == "emit") {
          if (v.args[0].key === key.key) {
            fn(v.args[1] as T);
          }
        }
      });
    },
  },
});
