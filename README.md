# Website Thiên Đức Hội

Trang web tĩnh đa trang được triển khai từ thiết kế Figma, sử dụng Astro, GSAP và Lenis.

## Các lệnh thường dùng

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

`npm run build` xuất bản tĩnh vào thư mục `dist/`, sẵn sàng triển khai trên static hosting hoặc Nginx.

## Nội dung và ngôn ngữ

Nội dung toàn trang nằm trong `src/i18n/`: `vi.ts` là bản tiếng Việt mặc định tại đường dẫn gốc, còn `en.ts` là gói tiếng Anh tại `/en/`. Hai tệp phải giữ cùng thứ tự mục, slug và tên ảnh. Ảnh nằm trong `public/images/`; dữ liệu chỉ ghi tên tệp, không ghi phần mở rộng `.webp`. Danh sách ảnh cho slideshow và marquee nằm trong `src/data/media.ts`.

## Cấu trúc

- `src/pages/`: định tuyến trang
- `src/components/`: header, footer, danh sách và mẫu bài viết
- `src/styles/global.css`: phong cách và design tokens toàn trang
- `src/scripts/main.ts`: hiệu ứng tương tác, có hỗ trợ cài đặt giảm chuyển động
