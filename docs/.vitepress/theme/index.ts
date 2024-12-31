// .vitepress/theme/index.ts
import DefaultTheme from "vitepress/theme";

import Confetti from "./components/Confetti.vue";

import "./style/index.css"; //引入自定义的样式

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router }) {
    app.component("Confetti", Confetti); //注册全局组件
  },
};