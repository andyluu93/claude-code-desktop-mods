# Quy trình tạo giao diện (mod) cho Claude Code Desktop

Tài liệu mô tả các bước tạo một giao diện có hình nền chuyển động cho Claude Code trên ứng dụng Claude Desktop, từ ý tưởng tới đóng gói và phát hành. Các quy tắc ở mục 4 được rút ra từ quá trình kiểm thử thực tế trong ứng dụng; bỏ qua các quy tắc này là nguyên nhân phổ biến nhất khiến hình nền hiển thị nhưng đứng yên.

## 1. Tổng quan

Một giao diện là một plugin gồm ba phần:

| Thành phần | Vai trò |
|---|---|
| Bảng màu | Màu nền, chữ, viền, màu nhấn cho chế độ sáng và tối, sinh bằng hàm `makeColors`. |
| Cảnh nền | Một tệp SVG có chuyển động bằng CSS, hiển thị phía sau giao diện chat. |
| Hook | Mã `register.tsx` áp dụng bảng màu khi mở phiên, vẽ cảnh nền và xử lý câu lệnh đổi giao diện. |

Cấu trúc thư mục của một plugin:

```text
mods/<mã>/
├── .claude-plugin/plugin.json   # tên, phiên bản, mô tả
└── hooks/
    ├── hooks.json               # { "modules": ["./register.tsx"] }
    ├── register.tsx             # mã hook
    ├── make-colors.js           # hàm sinh bảng màu
    └── make-colors.d.ts
```

## 2. Xác định ý tưởng

Trước khi vẽ, chốt ba nội dung:

1. **Nhóm phong cách**: sang trọng, chuyên nghiệp, dễ thương hoặc thiên nhiên.
2. **Họa tiết chủ đạo duy nhất**: một hình ảnh trung tâm không trùng với giao diện khác (ví dụ rèm nhung và đèn sân khấu, quả địa cầu xoay, đoàn lạc đà trên đồi cát). Không dùng lại họa tiết của giao diện đã có rồi chỉ đổi màu.
3. **Chế độ phù hợp**: thiết kế cảnh cho chế độ tối hoặc chế độ sáng. Hook đặt `overrideColorScheme` theo chế độ này, nên khi giao diện đang bật, ứng dụng luôn ở đúng chế độ của cảnh dù người dùng chọn chế độ nào. Không bỏ trường này: cảnh vẽ cho nền tối mà hiển thị ở chế độ sáng sẽ bị lớp kính màu sáng phủ lệch, giữa sáng, hai mép tối.

## 3. Bảng màu

Bảng màu sinh bằng `makeColors` từ một màu nhấn và các mốc độ sáng của nền. Tham số được khai báo trong `tools/themes.mjs`:

| Trường | Ý nghĩa |
|---|---|
| `hue`, `sat` | Sắc độ và độ bão hòa của dải xám nền. |
| `accent` | Màu nhấn (nút, liên kết, điểm chọn). |
| `bg` | Các điểm màu của nền cảnh. `bgVertical: true` cho dải màu theo chiều dọc (bầu trời, mặt biển). |
| `metal`, `glow` | Màu kim loại và màu phát sáng dùng chung trong cảnh. |

Sau khi sinh, kiểm tra danh sách cảnh báo `problems`. Không được để xuất hiện dòng bắt đầu bằng "Desktop won't paint": dòng này nghĩa là ứng dụng sẽ từ chối áp dụng bảng màu.

## 4. Quy tắc vẽ cảnh nền

### 4.1. Cách ứng dụng hiển thị cảnh nền

Ứng dụng lọc mã SVG bằng DOMPurify rồi hiển thị trong một khung cách ly có chính sách bảo mật nội dung chặn mọi hình ảnh và tài nguyên bên ngoài. Do đó:

- Không thể dùng ảnh bitmap (PNG, JPG, ảnh do AI tạo) trong cảnh có chuyển động. Mọi chi tiết phải vẽ bằng vector.
- Thẻ `<image>`, `<script>`, `<foreignObject>`, `<a>`, `<iframe>` bị loại bỏ.
- Thuộc tính `href` chỉ được giữ khi trỏ tới phần tử trong cùng tệp (bắt đầu bằng `#`).

### 4.2. Được phép và không được phép

| Được phép | Không được phép |
|---|---|
| Hoạt ảnh CSS `@keyframes` trên `transform`, `opacity`, `stroke-dashoffset` | Khối `@media` trong `<style>` (kể cả `prefers-color-scheme`, `prefers-reduced-motion`) |
| `transform-box: fill-box` kèm `transform-origin` | `url(...)` bên trong `<style>` |
| Gradient, `fill="url(#id)"` dưới dạng thuộc tính | Thuộc tính `pathLength` |
| Nét đứt với độ dài tuyệt đối, ví dụ `stroke-dasharray: 24 1976` | Hoạt ảnh SMIL `animateMotion`, `mpath` |
| Một thẻ `<svg>` gốc duy nhất | Thẻ `<image>`, `<text>`, thuộc tính `on*` |

Bốn mục đầu ở cột "Không được phép" từng khiến toàn bộ chuyển động của cảnh bị dừng trong ứng dụng dù vẫn chạy bình thường trên trình duyệt. Luôn kiểm tra theo mục 7 thay vì chỉ xem trên trình duyệt.

### 4.3. Quy tắc dựng nhóm chuyển động

- Không gắn lớp có hoạt ảnh lên phần tử đã có thuộc tính `transform`: hoạt ảnh CSS sẽ thay thế hoàn toàn thuộc tính đó. Đặt vị trí ở nhóm ngoài, gắn hoạt ảnh ở nhóm bên trong:

  ```xml
  <g transform="translate(1300 520)">
    <g class="spin fb">...</g>
  </g>
  ```

- Hoạt ảnh xoay hoặc phóng to cần `transform-box: fill-box` và điểm gốc phù hợp (`center`, `center top` cho vật treo, `center bottom` cho cây cỏ).
- Vật di chuyển qua màn hình (chim, cá, máy bay) cần độ trễ âm (`animation-delay` âm) để khi mở phiên đã có vật đang ở giữa đường, không phải chờ.
- Chuyển động nên chậm và nhẹ: chu kỳ từ 4 tới 60 giây, biên độ nhỏ, tránh nhấp nháy mạnh.

### 4.4. Bố cục

- Khung nhìn chuẩn `viewBox="0 0 1600 1000"` với `preserveAspectRatio="xMidYMid slice"`: cảnh luôn phủ kín cửa sổ, phần hai bên hoặc trên dưới có thể bị cắt khi tỷ lệ cửa sổ khác 16:10.
- Thanh tiêu đề và khung soạn tin có lớp kính mờ phủ lên. Vùng hiển thị rõ nhất là hai lề trái, phải ở khoảng giữa chiều cao.
- Giữ vùng giữa màn hình yên tĩnh để không cản trở việc đọc nội dung chat; đặt họa tiết chính ở các góc hoặc mép.
- Độ mờ kính khuyến nghị: `blur` 6 tới 8, `opacity` 0,55 tới 0,6.
- Kích thước tệp SVG dưới 131.072 ký tự.

## 5. Mã hook

Mã `register.tsx` thực hiện bốn việc:

1. `session.start`: áp dụng bảng màu, cảnh nền và khóa chế độ bằng `$.theme.set({ colors, overrideColorScheme, backdrop: { scene, glass } })`.
2. `command.run`: đăng ký lệnh `/giao-dien-<mã>`.
3. `prompt.submit`: nhận cụm từ `giao diện <tên>` (đã bỏ dấu tiếng Việt), đổi giao diện và trả về `{ drop }` để cụm từ không gửi tới mô hình. Cơ chế này cần thiết vì ứng dụng không phải lúc nào cũng chuyển lệnh gạch chéo do plugin đăng ký lúc chạy.
4. `ui.render` cho thành phần `Backdrop`: trả về `<Svg source={SCENE} isInteractive />` khi tên cảnh khớp.

Mã mẫu được sinh tự động trong `tools/build.mjs` (hàm `registerSource`). Không sửa trực tiếp các tệp trong `mods/`; sửa nguồn rồi sinh lại.

## 6. Sinh mã và kiểm tra tự động

```bash
node tools/build.mjs <tên-tài-khoản-github>
```

Lệnh sinh toàn bộ thư mục `mods/`, tệp `.claude-plugin/marketplace.json`, các tệp `preview/scenes/*.svg`, trang `preview/index.html` và danh sách trong `README.md`. Trong quá trình sinh, mỗi cảnh được kiểm tra tự động; lệnh dừng với thông báo lỗi khi gặp:

- tệp vượt 131.072 ký tự;
- `@media`, `url(` hoặc ký tự `<` trong khối `<style>`;
- `pathLength`, `animateMotion`, `<image`, `<text`, `<script`, `foreignObject`, `xlink:href`, thuộc tính `on*`;
- bảng màu có cảnh báo "Desktop won't paint".

## 7. Kiểm tra qua bộ lọc của ứng dụng

Trang `tools/check-scrub.html` lọc từng cảnh bằng đúng cấu hình DOMPurify của ứng dụng, gắn kết quả vào trang và đếm số hoạt ảnh đang chạy. Cách dùng:

```bash
python -m http.server 8771
```

Mở `http://localhost:8771/tools/check-scrub.html`. Kết quả đạt khi mọi dòng có trạng thái `OK`, số hoạt ảnh lớn hơn 0 và dòng cuối là `30/30 pass`.

Bước này xác nhận mã SVG qua được bộ lọc; xác nhận cuối cùng vẫn là cài thử trong ứng dụng và quan sát chuyển động.

## 8. Xem trước và tinh chỉnh

- Mở `preview/index.html` để xem toàn bộ cảnh cạnh nhau, đối chiếu để bảo đảm không có hai cảnh trùng họa tiết.
- Xem từng cảnh ở kích thước 1600 x 1000 và ở tỷ lệ hẹp hơn (4:3) để kiểm tra phần bị cắt.
- Kiểm tra độ tương phản của chữ trên nền ở cả chế độ sáng và tối.

## 9. Đóng gói và phát hành

1. Tệp `.claude-plugin/marketplace.json` ở gốc kho khai báo tên kho (`cc-desktop-mods`) và đường dẫn tới từng plugin trong `mods/`.
2. Tăng `version` trong `plugin.json` khi phát hành bản sửa để người dùng nhận được cập nhật.
3. Đẩy kho lên GitHub. Người dùng cài bằng:

   ```bash
   claude plugin marketplace add <tài-khoản>/claude-code-desktop-mods
   ```

   ```bash
   claude plugin install <mã>@cc-desktop-mods
   ```

4. Kiểm tra trước khi đẩy: không có tệp `.env`, khóa truy cập, cookie, đường dẫn hay thông tin cá nhân trong kho.

## 10. Khắc phục sự cố khi phát triển

| Hiện tượng | Nguyên nhân thường gặp | Cách xử lý |
|---|---|---|
| Cảnh hiển thị nhưng đứng yên trong ứng dụng | Có `@media`, `url()` trong `<style>` hoặc `pathLength` | Loại bỏ theo mục 4.2, sinh lại, kiểm tra mục 7. |
| Một vật bị lệch khỏi vị trí khi chuyển động | Lớp hoạt ảnh gắn trên phần tử có thuộc tính `transform` | Tách thành nhóm ngoài và nhóm trong theo mục 4.3. |
| Hình ảnh bitmap không hiện | Ứng dụng chặn mọi hình ảnh trong cảnh nền | Vẽ lại bằng vector. |
| Bảng màu không được áp dụng | Cảnh báo "Desktop won't paint" | Điều chỉnh độ sáng nền hoặc màu nhấn, sinh lại. |
| Lệnh `/giao-dien-...` không chạy | Ứng dụng không chuyển lệnh plugin đăng ký lúc chạy | Dùng cụm từ `giao diện <tên>`. |
| Ở chế độ ngược lại, giữa màn hình sáng còn hai mép tối (hoặc ngược lại) | Thiếu `overrideColorScheme` | Đặt `overrideColorScheme` bằng chế độ của cảnh, tăng `version`, sinh lại. |
| Sửa mã nhưng ứng dụng chưa nhận | Plugin chưa được nạp lại | Gõ `/reload-plugins` hoặc mở phiên mới. |
