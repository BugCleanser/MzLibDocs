import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/MzLibDocs',
  title: "MzLib Doc",
  description: "MzLib Document",
  themeConfig: {
    logo: '/banner.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Start', link: '/docs/start' }
    ],

    sidebar: [
      {
        text: '如何使用',
        items: [
          { text: '开始', link: '/docs/start' },
          { text: '命令系统', link: '/docs/command' },
          { text: '事件监听器', link: '/docs/listener' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/BugCleanser/MzLib' }
    ]
  }
})
