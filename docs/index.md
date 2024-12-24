---
layout: home

hero:
  name: "MzLib Minecraft"
  text: "MzLib 使用文档"
  tagline: Bukkit plugin library
  actions:
    - theme: brand
      text: Start
      link: /docs/start
    - theme: alt
      text: Github
      link: https://github.com/BugCleanser/MzLib
  image:
    src: /banner.png
    alt: 网页的logo图标
features:
  - icon: 🛠️
    title: MzLibCore
    details: MzLibCore 是 MzLib 的根基, 包含一些JAVA实用工具
    link: https://github.com/BugCleanser/MzLib/tree/main/MzLibCore
  - icon: ⚡️
    title: MzLibMinecraft
    details: MzLibMinecraft 包含 Minecraft 插件的主要代码，依赖于 MzLibCore
    link: https://github.com/BugCleanser/MzLib/tree/main/MzLibMinecraft
  - icon: 🌞
    title: Demo
    details: 一些示例代码, 帮助开发者快速上手
    link: https://github.com/BugCleanser/MzLib/tree/main/MzLibDemo
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);

  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>


