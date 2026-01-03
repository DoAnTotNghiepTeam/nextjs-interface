# 🔔 Hệ thống Thông báo Ứng tuyển

## Tổng quan giải pháp

Đã implement **In-App Notification System** để giải quyết vấn đề UX:
- ✅ **Không cần check email** - Thông báo real-time ngay trong app
- ✅ **Biết ngay công ty nào** - Hiển thị tên công ty + vị trí rõ ràng
- ✅ **Badge NEW nổi bật** - Highlight các application chưa đọc
- ✅ **Click để xem chi tiết** - Navigate trực tiếp đến application

---

## 🎯 Các tính năng đã implement

### 1. **Notification Bell Icon** (🔔 ở Header)
- Hiển thị số lượng application chưa đọc (unread count)
- Badge đỏ với animation pulse
- Dropdown menu hiển thị 10 thông báo gần nhất
- Chi tiết mỗi thông báo:
  - Tên công ty (nổi bật)
  - Tên job
  - Trạng thái (với màu sắc phù hợp)
  - Thời gian
  - Dot (●) cho thông báo chưa đọc

### 2. **Application Cards với NEW Badge**
- Card có border xanh + background gradient cho application chưa đọc
- Badge "NEW" màu đỏ với animation ở góc phải trên
- Auto highlight khi có update mới
- Auto mark as read khi click "View status"

### 3. **Real-time Updates qua SSE**
- Kết nối Server-Sent Events với backend
- Toast notification khi có cập nhật mới
- Auto refresh danh sách application
- Click vào toast để xem chi tiết
- Auto reconnect nếu mất kết nối

### 4. **Email Subject được cải thiện**
Backend đã update format:
```
❌ CŨ: "Xác nhận ứng tuyển thành công"
✅ MỚI: "🔔 FPT Software - Cập nhật: Lập Trình Viên Web"
```

---

## 📁 Files đã tạo/sửa

### Tạo mới:
1. **components/NotificationBell.tsx** - Component notification bell
2. **components/NotificationBell.module.css** - Styles cho bell
3. **hooks/use-application-sse.ts** - Hook xử lý SSE connection

### Cập nhật:
1. **components/Layout/Header.tsx** - Thêm NotificationBell
2. **features/applicants/components/ApplicantsTable.tsx** - Badge NEW + mark as read
3. **features/applicants/hooks/useApplicants.ts** - Integrate SSE
4. **styles/ApplicantsTable.module.css** - Styles cho highlight + badge

---

## 🚀 Cách sử dụng

### Cho Candidate (Ứng viên):

1. **Xem thông báo:**
   - Click icon 🔔 ở header (bên trái avatar)
   - Xem số unread trên badge đỏ
   - Click vào thông báo để xem chi tiết

2. **Theo dõi application:**
   - Vào trang "My Apply"
   - Card có border xanh + badge NEW = chưa đọc
   - Click "View status" để xem chi tiết (tự động mark as read)

3. **Real-time notifications:**
   - Khi HR cập nhật status → Toast notification tự động hiện
   - Click vào toast để xem ngay
   - Không cần refresh trang

### Trạng thái hiển thị:

| Status | Icon | Màu sắc | Ý nghĩa |
|--------|------|---------|---------|
| HIRED | ✅ | Xanh lá | Trúng tuyển |
| REJECTED | ❌ | Đỏ | Từ chối |
| INTERVIEW | 📅 | Tím | Mời phỏng vấn |
| CV_PASSED | ✓ | Xanh dương | CV đạt |
| PENDING | ⏳ | Xám | Đang xét duyệt |

---

## 🔧 Cấu hình Backend

### API Endpoints được sử dụng:

1. **GET** `/api/applicant` - Lấy danh sách applications
2. **PATCH** `/api/applicant/{id}/mark-read` - Đánh dấu đã đọc
3. **GET** `/api/applicant/{id}/subscribe` - SSE connection (real-time)

### Database fields:
- `isRead: Boolean` - Đánh dấu application đã đọc/chưa đọc
- Mặc định `false` khi tạo mới

---

## 📊 User Flow

```
Candidate apply job
     ↓
Backend tạo application (isRead = false)
     ↓
Email gửi tới candidate (subject có tên công ty + job)
     ↓
[Option 1] Candidate login app → Thấy bell có badge đỏ → Click xem
[Option 2] HR update status → SSE push → Toast notification → Click xem
     ↓
Click "View status" → API mark as read → Badge NEW biến mất
```

---

## 🎨 UI/UX Improvements

### Before (❌ Vấn đề cũ):
- Phải check email
- Subject chung chung
- Không biết công ty nào update
- Mất thời gian tìm kiếm

### After (✅ Đã cải thiện):
- In-app notification real-time
- Thấy ngay công ty + job + status
- Badge NEW nổi bật
- Click 1 cái là xem được chi tiết

---

## 🔒 Security

- SSE endpoint yêu cầu JWT token
- Mark as read API kiểm tra ownership
- Chỉ Candidate mới thấy notification bell
- Auto close SSE connection khi logout

---

## 🐛 Troubleshooting

### Bell icon không hiển thị:
- Kiểm tra role: `session?.user?.roles` phải có "Candidate"
- Check console log xem API có lỗi không

### SSE không kết nối:
- Kiểm tra backend endpoint `/api/applicant/subscribe`
- Check CORS settings
- Verify JWT token

### Badge NEW không biến mất:
- Kiểm tra API `/api/applicant/{id}/mark-read` có được gọi không
- Check database field `isRead` có update không

---

## 📈 Performance

- Notification bell chỉ fetch khi click (lazy loading)
- SSE reconnect tự động sau 5 giây nếu mất kết nối
- Debounce refresh để tránh spam API
- Limit 10 notifications trong dropdown

---

## 🔮 Future Enhancements (Tùy chọn)

1. **Push Notifications** - Thông báo ngay cả khi không mở app
2. **Email Digest** - Tổng hợp notification hàng ngày
3. **Filter notifications** - Lọc theo status/company
4. **Mark all as read** - Đánh dấu tất cả đã đọc
5. **Notification preferences** - Cài đặt loại thông báo muốn nhận

---

Made with ❤️ to solve real UX problems!
