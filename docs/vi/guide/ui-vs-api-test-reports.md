---
title: Báo cáo kiểm thử UI và API
description: Vì sao báo cáo kiểm thử UI và API khác nhau ở mức bằng chứng nhưng dùng chung một chuẩn, kèm ma trận độ phủ và ví dụ lỗi.
---

# Báo cáo kiểm thử UI và API: cùng khung, khác bằng chứng

Biểu mẫu nên khác nhau — nhưng không phải thành hai tài liệu rời rạc. Giữ một chuẩn báo cáo duy nhất; thay đổi những gì mỗi tầng ghi lại: môi trường, độ phủ, bằng chứng và chỉ số.

## Những gì giữ nguyên

Cấu trúc ngoài là công cụ ra quyết định, và nó phải giống nhau trong báo cáo UI, báo cáo API và báo cáo phát hành tổng hợp:

- Định dạng kết luận: Go / No-Go / Go có điều kiện.
- Hệ thống trạng thái: đạt, không đạt, bị chặn, chưa chạy, chập chờn.
- Thang mức độ, thang ưu tiên và quy ước ID lỗi.
- Thứ tự các phần: siêu dữ liệu → tóm tắt → phạm vi → kết quả → lỗi → rủi ro → khuyến nghị.
- Quy tắc mỗi lỗi phải có bằng chứng, người phụ trách và bước tiếp theo.

Điều này theo cấu trúc báo cáo tổng kết kiểm thử chuẩn (dòng IEEE 829 / ISO 29119). Chỉ nội dung bên trong các phần thay đổi theo tầng. Khung dùng chung được trình bày trong [Viết báo cáo kiểm thử QA](/vi/guide/qa-test-report).

## Hai báo cáo khác nhau ở đâu

| Khía cạnh | Báo cáo UI | Báo cáo API |
| --- | --- | --- |
| Đơn vị kiểm thử | Hành trình người dùng, màn hình, trạng thái thành phần. | Endpoint hoặc thao tác, hợp đồng (contract). |
| Khối môi trường | Trình duyệt và phiên bản, OS, thiết bị, viewport, zoom, locale, điều kiện mạng. | Tên dịch vụ và phiên bản hoặc image tag, URL gateway, cơ chế auth và scope, tenant, seed DB, dịch vụ phụ thuộc hoặc mock, phiên bản spec OpenAPI. |
| Bằng chứng | Ảnh chụp có chú thích, video, lỗi console, HAR. | Cặp request/response (đã che dữ liệu), status và body, correlation hoặc trace ID, log dịch vụ, diff schema. |
| Độ phủ | Hành trình × trình duyệt/thiết bị; trạng thái hình ảnh (rỗng, đang tải, lỗi); khả năng tiếp cận; i18n. | Thao tác × phương thức × mã trạng thái; ma trận authz; kiểm tra hợp lệ và biên; contract; idempotency. |
| Chỉ số chính | Tỷ lệ đạt đa trình duyệt, tỷ lệ chập chờn (lần đầu so với retry), visual diff, vi phạm a11y, Core Web Vitals. | Độ trễ p50/p95/p99 so với ngân sách, tỷ lệ lỗi theo lớp mã trạng thái, lỗi xác thực schema, % bao phủ spec. |
| Công cụ thường dùng | Playwright, Cypress, axe-core, Percy hoặc Chromatic, Lighthouse. | Postman/Newman, REST Assured, Karate, Pact, Schemathesis, k6 hoặc Gatling. |
| “Bị chặn” thường nghĩa là | UI staging sập, widget bên thứ ba hoặc CAPTCHA, tài khoản test hỏng. | Dịch vụ hoặc phụ thuộc sập, nơi cấp token hỏng, seed DB lệch, mock lệch. |
| Yếu tố quyết định mức độ | Luồng chặn người dùng, mất dữ liệu trên màn hình, bẫy bàn phím, vỡ bố cục. | Hỏng dữ liệu, vượt quyền authz, phá vỡ contract, 5xx lõi, vi phạm SLA độ trễ. |

## Báo cáo UI cần thêm gì

Ngoài khung dùng chung, báo cáo UI mang bằng chứng cho thấy môi trường là một phần của kết quả.

### Ma trận môi trường (ví dụ)

| Trình duyệt | Phiên bản | OS | Viewport | Kết quả |
| --- | --- | --- | --- | --- |
| Chromium (Chrome 142) | 142 | macOS 15 | 1440×900 | Đạt |
| WebKit (Safari 19) | 19 | macOS 15 | 1440×900 | Không đạt — BUG-456 |
| WebKit (iOS Safari) | 19 | iOS 19 | 390×844 | Chưa chạy |

### Độ phủ hành trình (ví dụ)

| Hành trình | Chrome | Safari | Firefox | Mobile | A11y |
| --- | --- | --- | --- | --- | --- |
| Đăng ký / đăng nhập | Đạt | Đạt | Đạt | Đạt | Đạt |
| Thanh toán có mã giảm giá | Không đạt (BUG-456) | Không đạt (BUG-456) | Đạt | Chưa chạy | Đạt |

### Cũng phải khai báo, hoặc đánh dấu ngoài phạm vi

- Trạng thái hình ảnh: rỗng, đang tải, lỗi, dữ liệu một phần, chuỗi dài.
- Khả năng tiếp cận: WCAG 2.2 AA, thao tác chỉ bằng bàn phím, trình đọc màn hình, độ tương phản, zoom 200%.
- i18n, RTL và các điểm ngắt responsive.
- Baseline visual regression: diff nào là chủ đích, diff nào là lỗi.
- Báo cáo chập chờn: tách kết quả lần chạy đầu khỏi retry, vì retry che giấu lỗi thật.

## Báo cáo API cần thêm gì

Báo cáo API thay ma trận trình duyệt bằng trạng thái dịch vụ và hợp đồng. Bằng chứng là request và response, không phải màn hình.

### Khối dịch vụ và hợp đồng (ví dụ)

```text
Dịch vụ: orders-svc 2.14.3 (image sha-3f2a91c)
Base URL: https://staging-api.example.com/orders/v2
Spec: OpenAPI 3.1 @ commit a1b2c3d (diff so với bản trước: 2 trường mới)
Auth: OAuth2 client-credentials, scope [orders:write], tenant=acme
Dữ liệu: fixtures seed-2025-11-18-a; đã chạy cleanup: có
Phụ thuộc: payment-svc 1.9.2 (thật), inventory (mock v4)
```

### Độ phủ thao tác và ma trận authz (ví dụ)

| Endpoint | Phương thức | Happy | Kiểm tra hợp lệ | AuthZ | Schema | Kết quả |
| --- | --- | --- | --- | --- | --- | --- |
| /orders | POST | Đạt | 4/5 đạt | Đạt | Đạt | Không đạt — BUG-401 |
| /orders/{id} | GET | Đạt | Đạt | Đạt | Đạt | Đạt |

Ma trận auth là tương đương API của kiểm thử đa trình duyệt: anonymous / customer / support / admin × mọi thao tác → xác minh 401, 403 hoặc 200.

### Cũng cần có

- Xác thực hợp đồng: response schema được kiểm tra với OpenAPI; thay đổi phá vỡ được gắn cờ.
- Idempotency và retry: cùng một khóa áp dụng hai lần, lần gọi thứ hai trả về gì.
- Toàn vẹn dữ liệu: trạng thái DB trước và sau, side effect được xác minh.
- Rate limit và concurrency: hành vi 429, race condition.
- Hiệu năng, nếu trong phạm vi: p95/p99 so với ngân sách từng thao tác.
- Phân loại lỗi: 500 có đúng là 5xx? Lỗi validation trả 422 hay 400 có nhất quán?

::: danger Quy tắc cứng
Không bao giờ đưa token, cookie hay PII vào bằng chứng request/response. Che header và body trong báo cáo; chỉ đính kèm log đầy đủ vào ticket nếu chính sách cho phép.
:::

## Mục lỗi cũng khác nhau

Cùng bộ trường, khác bằng chứng. Mục UI chứng minh người dùng thấy gì; mục API chứng minh dịch vụ trả về gì.

### Lỗi UI

```text
BUG-456 — Thanh toán trả về HTTP 500 khi giỏ hàng có mã giảm giá
Trình duyệt/OS/Viewport: Chrome 142 / macOS 15 / 1440×900
Các bước: 1. Thêm sản phẩm  2. Áp dụng SAVE10  3. Bấm "Đặt hàng"
Mong đợi: trang xác nhận; Thực tế: toast lỗi, nút quay vòng
Bằng chứng: screenshot.png, recording.mp4, console-errors.txt, orders.har
Incognito: cũng lỗi | Safari: cũng lỗi | Mobile: chưa kiểm tra
Ảnh hưởng a11y: không | Màn hình: /checkout
```

### Lỗi API

```text
BUG-401 — POST /orders trả về 500 khi giỏ hàng có mã giảm giá
Dịch vụ: orders-svc 2.14.3 | Môi trường: staging | Spec: OpenAPI a1b2c3d
Auth: customer JWT, tenant=acme, scope orders:write
Request: POST /api/orders  body: {cartId, code:"SAVE10"}  (header đã che)
Mong đợi: 201 + Order schema v2
Thực tế: 500 + {"error":"null_pointer_at_discount.calc"}
Correlation ID: 5f3c9a1e-... | Trace: liên kết Jaeger
Điều kiện dữ liệu: cart 98765 với SAVE10; đã xác nhận cleanup
Phụ thuộc: payment-svc 1.9.2 khỏe mạnh
Tái hiện bằng curl: có, 10/10
Ảnh hưởng: mọi luồng thanh toán web và mobile dùng mã giảm giá
```

## Quy lỗi về đúng tầng

Một test UI thất bại không tự động là lỗi UI. Phân loại theo nơi bản sửa thuộc về.

- **UI test fail vì API trả 500.** Triệu chứng ở UI; nguyên nhân gốc ở API. Đếm lỗi một lần dưới API, liệt kê các hành trình bị ảnh hưởng là tác động, và để báo cáo UI liên kết tới lỗi API thay vì mở lỗi trùng.
- **API lỗi nhưng UI xử lý gọn gàng.** Một lỗi API; hành vi trạng thái lỗi đúng có thể là yêu cầu sản phẩm, không phải bug.
- **API lỗi và UI trắng trang, treo hoặc mất dữ liệu đã nhập.** Đó là lỗi UI thứ hai, riêng biệt: thiếu xử lý lỗi.

Thêm hai trường vào mọi lỗi — *tầng phát hiện* và *tầng nguyên nhân gốc* — và tổng hợp chúng trong phần tóm tắt:

| Tầng nguyên nhân gốc | Lỗi mở | Chặn phát hành |
| --- | --- | --- |
| UI | 3 | 1 |
| API | 2 | 2 |
| Dùng chung / hạ tầng | 1 | 0 |

## Một báo cáo phát hành, hai tầng

Tạo một báo cáo phát hành với các phần theo tầng thay vì hai báo cáo cấp cao riêng biệt. Lãnh đạo muốn một kết luận; QA cần chi tiết riêng.

```text
1. Kết luận phát hành (một, kèm điều kiện)
2. Phạm vi và tầng kiểm thử: bộ UI, bộ API, phần loại trừ của mỗi tầng
3. Kết quả — UI: ma trận hành trình × trình duyệt, a11y, visual
4. Kết quả — API: ma trận thao tác × mã trạng thái, ma trận auth, contract
5. Hiệu năng (theo tầng, nếu trong phạm vi)
6. Lỗi: một danh sách, gắn nhãn tầng phát hiện và tầng nguyên nhân gốc
7. Rủi ro, khoảng trống được chấp nhận, rủi ro tồn dư theo tầng
8. Mục lục bằng chứng: /evidence/ui, /evidence/api
```

## Tiêu chí kết thúc khác nhau theo tầng

### Tiêu chí kết thúc UI

- Tất cả hành trình P0 đạt trên ma trận trình duyệt và thiết bị đã thống nhất.
- Không còn lỗi UI mức 1.
- Không có vi phạm khả năng tiếp cận nghiêm trọng.
- Visual diff được review và có chủ đích.
- Tỷ lệ chập chờn dưới ngưỡng đã thống nhất.

### Tiêu chí kết thúc API

- 100% thao tác trong phạm vi có happy path, các ca negative chính và authz.
- 100% xác thực schema.
- Không còn P1.
- p95 trong ngân sách.
- Diff contract được review và tương thích ngược với các phiên bản hỗ trợ.
- Không có bí mật trong log.

## Quy tắc thực dụng

Xây một chuẩn báo cáo duy nhất với các module theo tầng: phần tóm tắt, kết luận và phân loại lỗi dùng chung; khối môi trường, ma trận độ phủ, định dạng bằng chứng và chỉ số khởi tạo khác nhau cho UI và API. Trong pipeline tự động, đó là nhãn `layer: ui | api` cộng với artifact khác nhau theo tầng, cùng đổ về một bộ sinh báo cáo.

> **Biểu mẫu khác nhau ở nội dung, không khác ở chuẩn.** Một khung, hai ngôn ngữ bằng chứng — và một kết luận duy nhất để release manager hành động.
