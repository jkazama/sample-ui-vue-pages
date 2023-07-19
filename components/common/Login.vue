<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "@/api/context";
import { Level } from "@/libs/log";
import { useEventStore } from "@/store/event";
import { checkLogin } from "@/libs/app";
const router = useRouter();
const event = useEventStore();

export interface Props {
  admin?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  admin: false,
});

const param = ref({
  loginId: "",
  password: "",
});

const doLogin = () => {
  const req = {
    loginId: (props.admin ? "INTERNAL-" : "") + param.value.loginId,
    password: param.value.password,
  };
  login(req)
    .then(() => {
      checkLogin(() => {
        const prefix = props.admin ? "/admin" : "/user";
        router.push(`${prefix}/home`);
      });
    })
    .catch(() => {
      event.notify("Login failed.", Level.WARN);
    });
};
</script>

<template>
  <v-container>
    <v-row no-gutters>
      <v-col lg="6" offset-lg="3" sm="8" offset-sm="2" xs="10" offset-xs="1">
        <v-card
          :color="props.admin ? 'secondary' : 'primary'"
          variant="outlined"
        >
          <v-card-title>
            Login Form<span v-if="props.admin"> for Admin</span>
          </v-card-title>
          <v-card-text>
            <UiTextField
              label="Login ID"
              v-model="param.loginId"
              @keydown.enter="doLogin"
            ></UiTextField>
            <UiTextField
              label="Password"
              v-model="param.password"
              type="password"
              @keydown.enter="doLogin"
            ></UiTextField>
            <UiBtn block @click="doLogin"> Sign In </UiBtn>
          </v-card-text>
        </v-card>
        <div class="d-flex justify-end">
          <NuxtLink
            class="pa-2 text-body-2 text-decoration-none text-grey-darken-2"
            to="/user/login"
            v-if="props.admin"
          >
            for User
          </NuxtLink>
          <NuxtLink
            class="pa-2 text-body-2 text-decoration-none text-blue-grey-darken-2"
            to="/admin/login"
            v-else
          >
            for Admin
          </NuxtLink>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
