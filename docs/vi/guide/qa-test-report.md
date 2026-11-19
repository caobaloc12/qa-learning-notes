---
title: Viết báo cáo kiểm thử QA
description: Nguyên tắc, cấu trúc, trạng thái, đặc thù giao diện web, mục lỗi và biểu mẫu cho báo cáo kiểm thử QA.
---

# Cách viết báo cáo kiểm thử QA

Báo cáo kiểm thử tồn tại để người khác ra quyết định — phát hành, sửa trước, hay dừng lại — với ít phải đọc nhất. Kiểm thử giao diện web thêm một quy tắc: môi trường là một phần của kết quả.

<aside class="qa-specimen" aria-label="Thẻ tóm tắt kiểm thử mẫu">
  <div class="qa-spec-head">
    <span class="qa-spec-label">Tóm tắt kiểm thử · mẫu</span>
    <span class="qa-spec-build">3f2a91c</span>
  </div>
  <div><span class="qa-vbadge">GO CÓ ĐIỀU KIỆN</span></div>
  <div class="qa-spec-bar" aria-hidden="true">
    <span style="width:92.2%;background:var(--qa-pass)"></span>
    <span style="width:2.6%;background:var(--qa-fail)"></span>
    <span style="width:1.3%;background:var(--qa-warn)"></span>
    <span style="width:3.9%;background:var(--qa-skip)"></span>
  </div>
  <ul class="qa-spec-grid">
    <li><i style="background:var(--qa-pass)"></i>Đạt <b>142</b></li>
    <li><i style="background:var(--qa-fail)"></i>Không đạt <b>4</b></li>
    <li><i style="background:var(--qa-warn)"></i>Bị chặn <b>2</b></li>
    <li><i style="background:var(--qa-skip)"></i>Bỏ qua <b>6</b></li>
  </ul>
  <div class="qa-spec-foot">Đã xác minh trên Chrome 142 · Safari 19 · Firefox 143</div>
</aside>

## Các nguyên tắc

Mọi phần dưới đây xuất phát từ một ý: báo cáo là công cụ ra quyết định, không phải nhật ký kiểm thử.

| Nguyên tắc | Thực tế áp dụng |
| --- | --- |
| Người đọc là trên hết | Lãnh đạo muốn kết luận và rủi ro trong 30 giây; lập trình viên muốn bước tái hiện và bằng chứng. Tóm tắt đặt lên đầu, chi tiết xuống phụ lục. |
| Sự thật, không phải tính từ | “Nút thanh toán trả về HTTP 500 khi gửi” tốt hơn “thanh toán bị lỗi”. Định lượng: “lỗi 3/10 lần thử”. |
| Có thể tái hiện | Bất kỳ ai có mã build, môi trường, vai trò tài khoản và các bước đều tái hiện được — nếu không, đó là giai thoại, không phải báo cáo lỗi. |
| Trung thực về phạm vi | Nêu rõ những gì không được kiểm thử (tính năng, trình duyệt, ca biên, phần bị chặn). Rủi ro tồn dư là phần giá trị nhất với người ra quyết định. |
| Có thể hành động | Mỗi lỗi cần mức độ nghiêm trọng, người phụ trách (hoặc đề xuất), và bước tiếp theo: sửa ngay, hoãn, hay chấp nhận rủi ro. |
| Nhất quán | Cùng một biểu mẫu, cùng quy ước ID (TC-123, BUG-456), cùng thang mức độ ở mọi lần. |

## Báo cáo tổng kết gồm những gì

Thứ tự quan trọng: người đọc phải thấy kết luận trước phần chi tiết.

1. **Siêu dữ liệu.** Mã báo cáo, tác giả, khoảng thời gian kiểm thử, **định danh build (git SHA hoặc số build)**, URL môi trường, bộ dữ liệu kiểm thử, và các cờ tính năng đang bật.
2. **Tóm tắt điều hành.** Số lượng đạt, không đạt và bị chặn, độ phủ yêu cầu, một **kết luận — Go / No-Go / Go có điều kiện** — và ba đến năm điều người đọc bắt buộc phải biết.
3. **Phạm vi.** Trong phạm vi, ngoài phạm vi và lý do (loại trừ theo rủi ro, phụ thuộc bị chặn).
4. **Cách tiếp cận.** Thủ công hay tự động, các loại kiểm thử đã chạy (smoke, hồi quy, đa trình duyệt, khả năng tiếp cận, hiệu năng), công cụ và liên kết CI. Liên kết tới kết quả thô (Allure, Playwright HTML report, JUnit XML) thay vì dán log.
5. **Kết quả.** Theo từng tính năng hoặc yêu cầu, kèm phân rã trạng thái bên dưới. Truy vết tới ticket và story để người đọc đánh giá độ phủ, không chỉ tỷ lệ đạt.
6. **Lỗi.** Các lỗi còn mở sắp xếp theo mức độ, mỗi dòng liên kết tới ticket đầy đủ.
7. **Rủi ro, vấn đề đã biết và mục hoãn lại.** Cái gì còn hỏng, và vì sao có thể chấp nhận — hoặc không.
8. **Khuyến nghị.** Dứt khoát, kèm điều kiện: “phát hành nếu BUG-456 được sửa và đợt kiểm tra khả năng tiếp cận đạt trước GA”.

### Ba loại báo cáo, đừng trộn lẫn

| Loại báo cáo | Viết khi nào | Mục đích |
| --- | --- | --- |
| Báo cáo lỗi | Ngay khi phát hiện | Một lỗi, một ticket, tái hiện đầy đủ |
| Trạng thái hằng ngày | Trong lúc thực thi | Tiến độ, tắc nghẽn, lỗi mới — ngắn gọn |
| Tổng kết / ký duyệt | Khi kết thúc | Kết luận, độ phủ, rủi ro — hướng quyết định |

Trộn lẫn ba loại này là lỗi báo cáo phổ biến nhất. Một lỗi bị chôn trong cập nhật tiến độ, hay một kết luận bị chôn trong danh sách bug, không giúp được ai.

## Báo cáo trạng thái cho đúng

Đừng gộp tất cả thành đạt hoặc không đạt. Mỗi trạng thái dưới đây là một sự thật khác nhau về lần chạy.

| Trạng thái | Ý nghĩa |
| --- | --- |
| <span class="qa-badge pass">Đạt</span> | Đã xác minh, khớp với kết quả mong đợi. |
| <span class="qa-badge fail">Không đạt</span> | Đã xác minh nhưng kết quả khác mong đợi. |
| <span class="qa-badge warn">Bị chặn</span> | Không thể thực thi: phụ thuộc bị hỏng hoặc môi trường sập. |
| <span class="qa-badge skip">Chưa chạy / bỏ qua</span> | Ngoài phạm vi hoặc giảm ưu tiên. Phải khai báo rõ, không được ngầm hiểu. |
| <span class="qa-badge flaky">Chập chờn</span> | Đạt và không đạt qua các lần chạy; báo cáo tỷ lệ, không phải kết quả lần cuối. |

::: warning Con số đáng ngờ nhất
“Tỷ lệ đạt 100%” vô nghĩa nếu 40% bộ kiểm thử bị bỏ qua. Tỷ lệ đạt mà thiếu độ phủ là chỉ số gây nhầm lẫn nhất trong báo cáo QA.
:::

Các chỉ số khác nên có: độ phủ yêu cầu, số lỗi mở theo mức độ, mật độ lỗi theo tính năng, lỗi lọt ra ngoài (escaped defects), tỷ lệ chập chờn, và tổng thời gian thực thi. Bỏ qua các chỉ số hình thức như số lượng test case đã chạy.

## Những chi tiết làm báo cáo UI web đáng tin

Trên web, môi trường là một phần của kết quả. Cùng một build có thể đạt trên trình duyệt này và lỗi trên trình duyệt khác; báo cáo thiếu môi trường thì không thể nói là trường hợp nào.

### Ma trận môi trường: luôn chính xác

- Trình duyệt và phiên bản (không bao giờ “Chrome mới nhất”), hệ điều hành, thiết bị.
- Viewport và độ phân giải, mức zoom, desktop hay mobile.
- Locale, múi giờ, và điều kiện mạng (throttling) cho các vấn đề hiệu năng hoặc tải trang.
- Vai trò và quyền người dùng, nhóm cờ tính năng hoặc A/B, và bộ dữ liệu đã dùng.

### Bằng chứng ngoài ảnh chụp màn hình

- Ảnh chụp có chú thích, mũi tên chỉ đúng phần tử lỗi.
- Video ngắn cho các vấn đề động (Playwright trace, Loom, QuickTime).
- Lỗi console trình duyệt, nguyên văn.
- Tab Network hoặc tệp HAR: mã trạng thái, payload, lỗi CORS.
- Có tái hiện trong incognito, hoặc sau khi xóa cache và cookie hay không.
- Tỷ lệ tái hiện, và lỗi có chập chờn hay không.

### Phải bao phủ rõ ràng, hoặc tuyên bố ngoài phạm vi

- Trình duyệt: Chrome, Safari, Firefox, Edge; thêm iOS Safari và Android Chrome.
- Các điểm ngắt responsive quanh từng mục tiêu thiết kế.
- Khả năng tiếp cận theo WCAG 2.2 AA: điều hướng chỉ bằng bàn phím, trình đọc màn hình (VoiceOver hoặc NVDA), độ tương phản, zoom 200%.
- Bản địa hóa: chuỗi dài và bố cục phải-sang-trái (RTL) khi áp dụng.
- Ngân sách hiệu năng hoặc Core Web Vitals, nếu trong phạm vi.
- Các ca biên của phiên: hết hạn, nút Back, refresh, deep link, nhiều tab, mạng chậm hoặc offline.

## Viết báo cáo lỗi: mỗi báo cáo một lỗi

Mục báo cáo lỗi là đoạn văn có đòn bẩy cao nhất mà kỹ sư QA viết. Đây là dạng thức trụ được qua review.

```text
BUG-456 — Thanh toán trả về HTTP 500 khi giỏ hàng có mã giảm giá
Mức độ: Nghiêm trọng (chặn mua hàng) | Ưu tiên: P1
Build: 3f2a91c | Môi trường: staging, Chrome 142 / macOS 15 / 1440×900
Vai trò: khách hàng đã đăng nhập | Cờ: checkout_v2=on

Điều kiện trước: giỏ hàng có ≥1 sản phẩm; người dùng có mã SAVE10 hợp lệ
Các bước:
  1. Thêm một sản phẩm bất kỳ vào giỏ
  2. Vào /checkout, nhập SAVE10, bấm Áp dụng
  3. Bấm "Đặt hàng"
Kỳ vọng: trang xác nhận đơn hàng, đơn hàng được tạo
Thực tế: nút quay vòng, sau đó hiện toast "Đã xảy ra lỗi"; tab Network cho thấy
        POST /api/orders → 500 (nội dung phản hồi đính kèm)

Bằng chứng: recording.mp4, console-errors.txt, orders.har, screenshot.png
Tỷ lệ tái hiện: 10/10 | Cũng lỗi trong incognito: có | Safari: chưa kiểm tra
```

- Các bước ngắn nhất, đánh số: đường ngắn nhất tới lỗi.
- Luôn có cả kỳ vọng và thực tế.
- Tách mức độ (tác động: chặn, nghiêm trọng, lớn, nhỏ, không đáng kể) khỏi ưu tiên (độ khẩn cấp để sửa).
- Không thổi phồng mức độ. Uy tín là ngân sách chỉ tiêu được một lần.
- Không bao giờ viết “không hoạt động” mà thiếu triệu chứng chính xác và tỷ lệ tái hiện.

## Những điều không nên viết

Mỗi điều dưới đây đều làm mất niềm tin của người đọc. Bỏ chúng trước khi thêm bất cứ thứ gì mới.

- “Tất cả kiểm thử đều đạt” mà không có phạm vi hay mã build.
- Ảnh chụp màn hình không kèm bước tái hiện và môi trường.
- Nhiều lỗi nhét chung vào một ticket.
- Dán log thô thay vì liên kết tới chúng.
- Chôn kết luận phát hành ở trang thứ chín.
- Ngôn ngữ rào đón (“có vẻ như…”) trong khi sự thật quan sát được và độ tin cậy của nó là đủ.
- Chỉ báo cáo luồng thuận (happy path) và lặng lẽ bỏ qua phần bị chặn hoặc đã bỏ.
- Sửa biểu mẫu sau khi kiểm thử xong thay vì thống nhất tiêu chí kết thúc từ trước.

## Sao chép, dán, điều chỉnh

Hai điểm khởi đầu: báo cáo tổng kết phát hành (dưới đây) và báo cáo lỗi (ở trên). Giữ nguyên cấu trúc, bản địa hóa nhãn.

```text
# Tóm tắt kiểm thử — <Bản phát hành> / <Build SHA>
Tác giả · Ngày · Khoảng thời gian kiểm thử · Môi trường · Dữ liệu · Cờ tính năng

## Kết luận: GO / NO-GO / GO CÓ ĐIỀU KIỆN
<2–4 câu: độ phủ, vấn đề mở nghiêm trọng nhất, quyết định cần đưa ra>

## Kết quả
Đạt X | Không đạt Y | Bị chặn Z | Chưa chạy W | Chập chờn V
Độ phủ yêu cầu: N/M (danh sách liên kết)

## Phạm vi
Trong: …   Ngoài (lý do): …

## Lỗi còn mở
| ID | Mức độ | Tiêu đề | Người phụ trách | Trạng thái |

## Rủi ro / vấn đề đã biết / lỗi được chấp nhận
…

## Bằng chứng
Liên kết CI · ảnh chụp · video · tệp HAR
```

> **Mẫu báo cáo đáng để tối ưu:** một release manager lướt mười dòng đầu, tin vào các con số vì phạm vi đã được nêu rõ, và chuyển được một liên kết lỗi cho lập trình viên mà không cần hỏi bạn thêm câu nào.
