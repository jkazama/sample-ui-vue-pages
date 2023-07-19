<script lang="ts" setup>
import { useEventStore, LogoutKey, LoginedKey } from "@/store/event";
import { useStore } from "@/store/app";
import { logout } from "@/api/context";
import { Log } from "@/libs/log";

const store = useStore();
const event = useEventStore();

// for Logined Action
event.on(LoginedKey, (user) => {
  store.login(user);
  Log.info(`Login Successed. [${user.roleType}-${user.id}]`);
});
// for Logout Action
event.on(LogoutKey, async () => {
  await logout();
  store.logout();
  Log.info("Logout Successed.");
});
</script>

<template>
  <v-app>
    <v-main>
      <NuxtPage />
    </v-main>
    <CommonNotification />
  </v-app>
</template>
