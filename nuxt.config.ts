// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: ["vuetify"],
  },
  css: ["vuetify/lib/styles/main.sass"],
  devtools: { enabled: true },
  modules: ["@pinia/nuxt"],
  routeRules: {
    "/": { redirect: "/user/login" },
  },
  runtimeConfig: {
    public: {
      apiRoot: "http://localhost:8080/api",
      logLevel: "DEBUG",
    },
  },
});
