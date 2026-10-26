import type { Theme } from "vitepress";

import DefaultTheme from "vitepress/theme";
import { h } from "vue";

import TranslateDemo from "./components/translate-demo.vue";
import TranslateDomDemo from "./components/translate-dom-demo.vue";
import TranslateElementDemo from "./components/translate-element-demo.vue";
import VersionBadge from "./version-badge.vue";
import "./layout.css";
import "./demo.css";



const theme: Theme = {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      "nav-bar-title-after": () => h(VersionBadge),
    });
  },
  enhanceApp({ app }) {
    app.component("TranslateDemo", TranslateDemo);
    app.component("TranslateElementDemo", TranslateElementDemo);
    app.component("TranslateDomDemo", TranslateDomDemo);
  },
};

export default theme;
