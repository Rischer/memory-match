import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import messages from "./i18n";

const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages
});

const app = createApp(App);
app.use(router);
app.use(i18n);
app.mount("#app");
