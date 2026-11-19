import { defineConfig } from 'vitepress'
import { sidebar } from './nav'

export default defineConfig({
  title: 'QA Wiki',
  description: 'Bilingual notes and guides for QA engineering.',
  cleanUrls: true,
  head: [
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap'
      }
    ]
  ],
  themeConfig: {
    search: {
      provider: 'local'
    }
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Guides', link: '/guide/qa-test-report' }
        ],
        sidebar: sidebar('en'),
        outline: { level: [2, 3], label: 'On this page' },
        docFooter: { prev: 'Previous', next: 'Next' },
        sidebarMenuLabel: 'Menu',
        returnToTopLabel: 'Return to top',
        darkModeSwitchLabel: 'Appearance'
      }
    },
    vi: {
      label: 'Tiếng Việt',
      lang: 'vi',
      link: '/vi/',
      themeConfig: {
        nav: [
          { text: 'Trang chủ', link: '/vi/' },
          { text: 'Hướng dẫn', link: '/vi/guide/qa-test-report' }
        ],
        sidebar: sidebar('vi'),
        outline: { level: [2, 3], label: 'Trong trang này' },
        docFooter: { prev: 'Trước', next: 'Tiếp' },
        sidebarMenuLabel: 'Menu',
        returnToTopLabel: 'Về đầu trang',
        darkModeSwitchLabel: 'Giao diện'
      }
    }
  }
})
