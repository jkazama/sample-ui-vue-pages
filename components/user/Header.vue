<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "../../store/app";
import { LogoutKey, useEventStore } from "../../store/event";

const router = useRouter();

const store = useStore();
const event = useEventStore();

const brandName = "Sample";

const drawer = ref(false);

const doLogout = () => {
  event.emit(LogoutKey, undefined);
  router.push("/user/login");
};
</script>

<template>
  <div>
    <v-app-bar color="primary" density="compact" flat>
      <template v-slot:prepend>
        <v-app-bar-nav-icon
          class="d-flex d-sm-none"
          @click.stop="drawer = !drawer"
          v-if="store.logined"
        ></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title class="d-none d-sm-flex">
        {{ brandName }}
      </v-app-bar-title>
      <v-app-bar-title class="d-flex d-sm-none" v-if="!store.logined">
        {{ brandName }}
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <div class="d-none d-sm-flex" v-if="store.logined">
        <v-btn
          prepend-icon="mdi-home"
          variant="text"
          class="text-capitalize"
          to="/user/home"
        >
          Home
        </v-btn>
        <v-btn
          prepend-icon="mdi-monitor"
          variant="text"
          class="text-capitalize"
          to="/user/trade"
        >
          Trade
        </v-btn>
        <v-btn
          prepend-icon="mdi-bank"
          variant="text"
          class="text-capitalize"
          to="/user/asset"
        >
          Asset
        </v-btn>
      </div>
      <template v-slot:append>
        <v-menu v-if="store.logined">
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
          </template>
          <v-list :lines="false" density="compact" nav>
            <v-list-item
              :title="store.user.name"
              :subtitle="store.user.roleType"
            >
              <template v-slot:prepend>
                <v-icon>mdi-account</v-icon>
              </template>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="doLogout">
              <template v-slot:prepend>
                <v-icon>mdi-logout</v-icon>
              </template>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" location="left" temporary>
      <v-list :lines="false" density="compact" nav>
        <v-list-item :title="brandName"></v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="router.push('/user/home')">
          <template v-slot:prepend>
            <v-icon>mdi-home</v-icon>
          </template>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-item @click="router.push('/user/trade')">
          <template v-slot:prepend>
            <v-icon>mdi-monitor</v-icon>
          </template>
          <v-list-item-title>Trade</v-list-item-title>
        </v-list-item>
        <v-list-item @click="router.push('/user/asset')">
          <template v-slot:prepend>
            <v-icon>mdi-bank</v-icon>
          </template>
          <v-list-item-title>Asset</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>
