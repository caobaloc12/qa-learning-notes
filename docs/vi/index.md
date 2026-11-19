---
layout: home

hero:
  name: QA Wiki
  text: Ghi chú và hướng dẫn kỹ thuật QA
  tagline: Song ngữ Anh và Việt. Site tài liệu tĩnh, có tìm kiếm, xây dựng bằng VitePress.
  actions:
    - theme: brand
      text: Viết báo cáo kiểm thử QA
      link: /vi/guide/qa-test-report
    - theme: alt
      text: Báo cáo kiểm thử UI và API
      link: /vi/guide/ui-vs-api-test-reports

features:
  - title: Báo cáo phục vụ quyết định
    details: Nguyên tắc, cấu trúc, trạng thái, mục lỗi và biểu mẫu để release manager hành động.
  - title: Hai tầng UI và API
    details: Một chuẩn báo cáo, hai ngôn ngữ bằng chứng — ma trận độ phủ, ví dụ lỗi và tiêu chí kết thúc.
  - title: Sẵn sàng mở rộng
    details: Nguồn Markdown, sidebar sinh từ manifest, tìm kiếm cục bộ và locale song ngữ — sẵn cho hàng trăm trang.
---

## Cách wiki này được xây

- Nội dung viết bằng Markdown, mỗi trang mỗi ngôn ngữ một tệp, trong `docs/`.
- Sidebar sinh từ một manifest duy nhất trong `docs/.vitepress/nav.ts`, bản địa hóa theo ngôn ngữ.
- Tìm kiếm chạy cục bộ; không cần dịch vụ ngoài.
- Bản build hoàn toàn tĩnh: triển khai thư mục `docs/.vitepress/dist` ở bất kỳ đâu.
