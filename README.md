# 天德会官网

基于 Figma「Daiwa 交付文件 / 官网」实现的静态多页面站点，使用 Astro、GSAP 和 Lenis。

## 常用命令

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

`npm run build` 把可部署的静态文件输出到 `dist/`，可以放到任意静态托管或 Nginx 上。

## 改内容

全站文案在 `src/i18n/`：`zh.ts` 是简体中文，`en.ts` 是英文，`vi.ts` 是越南文。三份文件的条目、slug 和图片名要保持一致。中文站在根路径，英文在 `/en/`，越南文在 `/vi/`。图片放在 `public/images/`，数据里只写文件名（不含 `.webp`）。轮播和公益走马灯的图片名单在 `src/data/media.ts`。

## 目录

- `src/pages/`：页面路由
- `src/components/`：页头、页脚、列表、文章模板等组件
- `src/styles/global.css`：全站样式和设计变量
- `src/scripts/main.ts`：全部交互动画，遵守系统的“减少动态效果”设置
