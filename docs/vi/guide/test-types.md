---
title: "Các loại kiểm thử: smoke, hồi quy và hơn thế"
description: Smoke, sanity, retest và hồi quy chứng minh điều gì, cấp độ và kỹ thuật kiểm thử khác nhau ra sao, và cách chọn bộ kiểm thử theo rủi ro cho một lần phát hành.
---

# Các loại kiểm thử: smoke, hồi quy và hơn thế

Một bộ kiểm thử là tập hợp các câu hỏi, không phải danh sách nghi thức. Smoke hỏi “build này có đáng để kiểm thử không?”, hồi quy hỏi “chúng ta có làm hỏng thứ gì không?”, chấp nhận hỏi “nó có đáp ứng nhu cầu không?”. Loại kiểm thử đi theo câu hỏi bạn cần trả lời ngay lúc này.

## Bắt đầu từ câu hỏi

| Câu hỏi | Loại kiểm thử | Khi nào chạy |
| --- | --- | --- |
| Build này có đáng để kiểm thử? | Smoke | Mỗi build hoặc lần triển khai mới |
| Bản sửa này đã đúng chưa? | Kiểm thử lại (retest / xác nhận) | Sau khi sửa lỗi |
| Thay đổi này có làm hỏng hành vi cũ? | Hồi quy (regression) | Trước phát hành, sau thay đổi rủi ro |
| Tính năng có đúng đặc tả? | Chức năng (functional) | Khi story và tiêu chí chấp nhận sẵn sàng |
| Các thành phần có phối hợp? | Tích hợp / hợp đồng | Khi dịch vụ hoặc thành phần thay đổi |
| Toàn bộ hành trình người dùng có chạy? | Đầu-cuối (E2E) | Trước phát hành, luồng quan trọng |
| Có đáp ứng nhu cầu kinh doanh? | Chấp nhận (UAT) | Trước ký duyệt |
| Người dùng có thật sự dùng được? | Khả dụng, khả năng tiếp cận | Vòng thiết kế, trước phát hành |
| Có chịu được tải? | Hiệu năng | Khi lưu lượng hoặc năng lực thay đổi |
| Có bị tấn công không? | Bảo mật | Khi bề mặt đe dọa thay đổi, trước phát hành |
| Có chạy đúng ở môi trường người dùng? | Tương thích | Ma trận trình duyệt và thiết bị |
| UI có thay đổi ngoài ý muốn? | Visual regression | Khi UI thay đổi |

## Bốn loại dễ nhầm nhất

| Loại | Câu hỏi | Phạm vi | Khi nào | Nếu thất bại |
| --- | --- | --- | --- | --- |
| Smoke | Build có đủ ổn định để kiểm thử? | Rộng, nông: đăng nhập, hành trình chính, API quan trọng | Mỗi build hoặc lần triển khai | Từ chối build; dừng kiểm thử |
| Sanity | Thay đổi cụ thể có hợp lý? | Hẹp, sâu hơn: vùng vừa chạm | Sau bản sửa hoặc thay đổi nhỏ | Sửa trước khi kiểm thử rộng |
| Retest (xác nhận) | Lỗi được báo còn không? | Đúng kịch bản thất bại | Sau khi sửa | Mở lại lỗi |
| Hồi quy | Hành vi cũ có hỏng? | Vùng quan trọng và vùng bị ảnh hưởng | Sau thay đổi, trước phát hành | Sửa, hoặc chấp nhận rủi ro có khai báo |

Vài quy tắc giữ bốn loại này không bị lẫn vào nhau:

- Smoke cho biết có nên dành thời gian kiểm thử hay không; nó không phải “hồi quy đầy đủ chạy nhanh”.
- Sanity dựa trên phán đoán; có thể là kiểm thử khám phá thay vì theo kịch bản.
- Retest chứng minh bản sửa; hồi quy chứng minh không có thứ khác hỏng. Bản sửa chỉ xong khi cả hai đều đạt.
- “Hồi quy” cũng là một lớp lỗi; loại kiểm thử này tồn tại để bảo vệ chống lại lớp lỗi đó.

## Cấp độ, loại và kỹ thuật là các trục khác nhau

| Trục | Trả lời | Ví dụ |
| --- | --- | --- |
| Cấp độ (level) | Ở đâu trong hệ thống | Unit, tích hợp, hệ thống, chấp nhận |
| Loại (type) | Kiểm tra điều gì | Smoke, hồi quy, hiệu năng, bảo mật |
| Kỹ thuật (technique) | Cách chọn ca kiểm thử | Phân vùng tương đương, giá trị biên, bảng quyết định, heuristic khám phá |

“Kiểm thử hồi quy ở cấp unit” là cách nói có nghĩa. “Unit là một loại kiểm thử” thì không. Giữ các trục tách biệt trong tài liệu chiến lược, nếu không đội ngũ sẽ tranh luận về từ vựng thay vì rủi ro.

## Danh mục

Các loại ở mức build đã nằm ở trên; đây là phần còn lại của bộ công cụ.

| Loại | Trả lời | Phạm vi điển hình | Bằng chứng |
| --- | --- | --- | --- |
| Chức năng | Có đúng đặc tả? | Tiêu chí chấp nhận, quy tắc nghiệp vụ | Ca đạt/không đạt so với mong đợi |
| Tích hợp | Các phần có phối hợp? | Ranh giới dịch vụ, DB, queue, bên thứ ba | Luồng request, log, kiểm tra hợp đồng |
| Hợp đồng (contract) | Consumer và provider có khớp? | Schema, mã trạng thái, sự kiện | Xác thực OpenAPI hoặc Pact |
| Đầu-cuối (E2E) | Hành trình có chạy? | UI → API → dữ liệu, luồng quan trọng | Bản ghi, trace, ảnh chụp |
| Chấp nhận (UAT) | Có đáp ứng nhu cầu kinh doanh? | Tác vụ thực tế bởi người dùng hoặc đại diện nghiệp vụ | Ký duyệt, điều kiện |
| Khám phá (exploratory) | Điều gì chưa nghĩ tới? | Charter và heuristic | Ghi chú phiên, lỗi tìm được |
| Khả dụng (usability) | Người dùng có thành công dễ dàng? | Tác vụ chính, trải nghiệm lần đầu | Phát hiện, tỷ lệ hoàn thành tác vụ |
| Khả năng tiếp cận | Mọi người có dùng được? | WCAG 2.2 AA, bàn phím, trình đọc màn hình | Vi phạm, kiểm tra thủ công |
| Tương thích | Có chạy trong môi trường người dùng? | Ma trận trình duyệt, OS, thiết bị | Kết quả ma trận |
| Bản địa hóa | Ngôn ngữ và locale có làm vỡ? | Chuỗi dài, RTL, định dạng | Ảnh chụp, ma trận locale |
| Visual regression | Điểm ảnh có đổi ngoài ý? | Baseline so với build hiện tại | Diff, phê duyệt chủ đích |
| Hiệu năng | Có chịu được tải? | Tải, căng thẳng, bền bỉ, đột biến | p50/p95/p99, tỷ lệ lỗi, thông lượng |
| Bảo mật | Có bị khai thác? | AuthN/AuthZ, đầu vào, bí mật, OWASP | Phát hiện theo mức độ, bằng chứng |
| Độ tin cậy (reliability) | Có phục hồi? | Failover, retry, thử nghiệm chaos | Thời gian phục hồi, error budget |

## Các loại xếp chồng thế nào

| Cấp độ | Chạy ở đâu | Chi phí | Tốc độ | Vai trò điển hình |
| --- | --- | --- | --- | --- |
| Unit | Máy dev, CI | Thấp | Giây | Logic |
| Tích hợp / hợp đồng | CI | Trung bình | Phút | Ranh giới |
| API / chức năng | CI, staging | Trung bình | Phút | Hành vi dịch vụ |
| UI E2E | CI, staging | Cao | Phút đến giờ | Hành trình quan trọng |
| Khám phá / UAT thủ công | Staging giống production | Cao | Giờ đến ngày | Phát hiện rủi ro, ký duyệt |

Hình dạng là heuristic, không phải chỉ tiêu. Quy tắc hữu ích: đẩy mỗi kiểm tra xuống cấp rẻ nhất có thể bắt được lỗi, và giữ một bộ E2E nhỏ, ổn định cho các hành trình mang ý nghĩa kinh doanh.

## Chọn bộ kiểm thử cho một lần phát hành

1. Smoke mỗi lần triển khai; chặn kiểm thử tiếp nếu thất bại.
2. Retest các lỗi đã sửa, sau đó sanity vùng vừa chạm.
3. Hồi quy theo tác động, không theo thói quen: dùng change set, bản đồ rủi ro và lỗi gần đây.
4. Chạy các hành trình E2E quan trọng trên môi trường đã thống nhất.
5. Áp cổng phi chức năng theo rủi ro: khả năng tiếp cận mỗi phát hành, hiệu năng trước ra mắt lớn, bảo mật khi bề mặt đe dọa thay đổi.
6. UAT và ký duyệt với nghiệp vụ; ghi lại điều kiện và rủi ro được chấp nhận.

| Kích hoạt | Bộ tối thiểu | Tín hiệu kết thúc |
| --- | --- | --- |
| Mỗi lần triển khai | Smoke | Build được chấp nhận |
| Bản sửa nhỏ | Retest + sanity + hồi quy mục tiêu | Bản sửa được xác minh, vùng ổn định |
| Merge nhánh tính năng | Chức năng + hồi quy bị ảnh hưởng + E2E quan trọng | Story được chấp nhận, không có P1/P2 mới |
| Ứng viên phát hành | Hồi quy đầy đủ theo rủi ro + E2E + a11y + hiệu năng (nếu trong phạm vi) | Đạt tiêu chí kết thúc |
| Sửa sau sự cố | Ca tái hiện, retest, hồi quy quanh sự cố | Sự cố đóng, không tái diễn |

## Báo cáo mỗi loại chứng minh điều gì

| Loại | Bằng chứng cần ghi | Báo cáo nên khẳng định |
| --- | --- | --- |
| Smoke | Build ID, các kiểm tra, đạt/không đạt | “Build X kiểm thử được” hoặc “bị từ chối ở smoke” |
| Retest | ID lỗi gốc, kịch bản | “Bản sửa đã xác minh” — chưa phải “lỗi đã sửa” cho đến khi hồi quy đạt |
| Hồi quy | Phạm vi, vùng bao phủ, loại trừ | “Không hồi quy trong vùng bao phủ”; khai báo khoảng trống |
| E2E | Hành trình, môi trường, bản ghi | “Hành trình quan trọng đạt trên ma trận” |
| Khả năng tiếp cận | Công cụ và kiểm tra thủ công, vi phạm | “Không vi phạm nghiêm trọng; đường bàn phím đạt” |
| Hiệu năng | Mô hình tải, p50/p95/p99, lỗi | “Trong ngân sách ở tải dự kiến” |
| Bảo mật | Phạm vi, phát hiện, mức độ | “Không còn phát hiện critical hoặc high trong phạm vi” |
| UAT | Người tham gia, tác vụ, điều kiện | “Được chấp nhận với điều kiện: …” |

Các định dạng bằng chứng này khớp trực tiếp với [Viết báo cáo kiểm thử QA](/vi/guide/qa-test-report); trạng thái và thang mức độ giữ nguyên giữa mọi loại. Về khác biệt bằng chứng giữa UI và API, xem [Báo cáo kiểm thử UI và API](/vi/guide/ui-vs-api-test-reports).

## Định nghĩa mỗi loại trong chiến lược

Khi đưa một loại kiểm thử vào quy trình của đội, hãy chốt tám điều:

1. Câu hỏi nó trả lời.
2. Kích hoạt: khi nào chạy.
3. Phạm vi và loại trừ rõ ràng.
4. Môi trường và dữ liệu kiểm thử.
5. Tiêu chí vào và ra.
6. Người phụ trách và người review.
7. Bằng chứng và nơi lưu.
8. Báo cáo: phần nào của báo cáo nhận kết quả, và lỗi chặn phát hành thế nào.

Một loại kiểm thử không có tiêu chí kết thúc sẽ biến thành nghi thức.

## Các cạm bẫy phổ biến

- Chạy “hồi quy” như nghi thức toàn bộ cố định bất kể rủi ro thay đổi.
- Coi smoke là hồi quy thu nhỏ, rồi bỏ qua hồi quy thật.
- Đóng lỗi sau retest mà không hồi quy; bản sửa có thể phá vỡ vùng lân cận.
- Dùng E2E cho mọi thứ, rồi đổ lỗi cho kiểm thử vì chậm và chập chờn.
- Lặng lẽ loại bỏ test chập chờn thay vì sửa hoặc báo cáo chúng.
- Coi UAT là trách nhiệm của QA; đó là chấp nhận của nghiệp vụ.
- Viết báo cáo liệt kê “các test đã chạy” thay vì mỗi loại đã chứng minh điều gì.

> **Chọn loại theo câu hỏi. Báo cáo câu trả lời, không phải hoạt động.**
