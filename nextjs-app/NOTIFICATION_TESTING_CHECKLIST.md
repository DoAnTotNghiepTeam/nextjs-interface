# ✅ Notification System - Testing Checklist

## 🔍 Pre-Testing Setup

- [ ] Backend running on `http://localhost:8080`
- [ ] Database có bảng `notifications` với đầy đủ columns
- [ ] Frontend running on `http://localhost:3000` (npm run dev)
- [ ] Có 2 accounts: 1 Candidate + 1 Employer

---

## 📋 TEST SCENARIOS

### 1️⃣ Test Candidate Apply → Nhận thông báo

**Steps:**
1. [ ] Login với Candidate account
2. [ ] Vào trang `/jobs-grid`
3. [ ] Click "Apply" vào một job bất kỳ
4. [ ] Submit application form
5. [ ] Click vào icon 🔔 ở header

**Expected Result:**
- [ ] Badge hiển thị số `1` (hoặc tăng lên 1)
- [ ] Dropdown mở ra có 1 notification mới
- [ ] Notification có title: **"✅ Ứng tuyển thành công"**
- [ ] Có company name và job title
- [ ] Background màu xanh dương gradient (unread)
- [ ] Có dấu ● màu xanh bên phải
- [ ] Thời gian hiển thị: "Vừa xong" hoặc "X phút trước"

**Console Logs:**
```
🔔 Total notifications: 1
🔔 Unread count: 1
🔔 Sample notification: { id: X, title: "✅ Ứng tuyển thành công", ... }
```

---

### 2️⃣ Test Employer Update Status → Candidate nhận thông báo

#### 2a. Update to CV_PASSED

**Steps:**
1. [ ] Logout khỏi Candidate account
2. [ ] Login với Employer account (chủ job vừa apply)
3. [ ] Vào trang quản lý applicants (dashboard)
4. [ ] Tìm application vừa tạo
5. [ ] Update status từ **PENDING** → **CV_PASSED**
6. [ ] Thêm note: "CV rất tốt, chúng tôi rất ấn tượng!"
7. [ ] Submit
8. [ ] Logout và login lại với Candidate account
9. [ ] Click icon 🔔

**Expected Result:**
- [ ] Badge tăng thêm 1 (VD: từ 1 → 2)
- [ ] Có notification mới với title: **"✅ CV của bạn đã được duyệt!"**
- [ ] Message hiển thị company name, job title, và note
- [ ] Status hiển thị: **"✅ CV đạt yêu cầu"** màu xanh dương
- [ ] Background gradient xanh (unread)

---

#### 2b. Update to INTERVIEW

**Steps:**
1. [ ] Login Employer
2. [ ] Update application từ **CV_PASSED** → **INTERVIEW**
3. [ ] Điền đầy đủ:
   - Note: "Chúng tôi mời bạn phỏng vấn"
   - Scheduled At: `2026-01-10T14:00:00`
   - Location: "Tầng 12, Tòa nhà FPT"
   - Interviewer: "Mr. Nguyễn Văn A"
4. [ ] Submit
5. [ ] Login lại Candidate
6. [ ] Click 🔔

**Expected Result:**
- [ ] Notification title: **"📅 Mời phỏng vấn"**
- [ ] Message có thời gian, địa điểm, người phỏng vấn
- [ ] Status: **"📅 Mời phỏng vấn"** màu tím
- [ ] Candidate nhận email với chi tiết lịch phỏng vấn

---

#### 2c. Update to HIRED

**Steps:**
1. [ ] Login Employer
2. [ ] Update từ **INTERVIEW** → **HIRED**
3. [ ] Note: "Chúc mừng! Welcome to our team!"
4. [ ] Submit
5. [ ] Login Candidate
6. [ ] Click 🔔

**Expected Result:**
- [ ] Notification title: **"🎉 Chúc mừng! Bạn đã được tuyển dụng"**
- [ ] Status: **"🎉 Trúng tuyển"** màu xanh lá
- [ ] Background gradient xanh (unread)

---

#### 2d. Update to REJECTED

**Steps:**
1. [ ] (Test với application khác)
2. [ ] Employer update → **REJECTED**
3. [ ] Note: "Rất tiếc, chúng tôi đã chọn ứng viên khác"
4. [ ] Login Candidate
5. [ ] Click 🔔

**Expected Result:**
- [ ] Notification title: **"Thông báo từ [Company Name]"**
- [ ] Status: **"❌ Từ chối"** màu đỏ
- [ ] Message hiển thị note từ employer

---

### 3️⃣ Test Mark as Read

**Steps:**
1. [ ] Login Candidate (có ít nhất 2 notifications chưa đọc)
2. [ ] Click 🔔 để mở dropdown
3. [ ] Quan sát badge count (VD: 3)
4. [ ] Click vào 1 notification màu xanh

**Expected Result:**
- [ ] Notification đó mất background xanh → thành trắng
- [ ] Badge giảm đi 1 (VD: 3 → 2)
- [ ] Dấu ● xanh biến mất
- [ ] Browser chuyển tới trang `/applicants/{id}`
- [ ] Console log: `✅ Marked notification as read: {id}`

---

### 4️⃣ Test Hiển thị cả đã đọc và chưa đọc

**Steps:**
1. [ ] Login Candidate
2. [ ] Click 🔔
3. [ ] Kiểm tra dropdown

**Expected Result:**
- [ ] Notifications chưa đọc: background xanh + dấu ●
- [ ] Notifications đã đọc: background trắng, không có dấu ●
- [ ] Cả 2 loại đều hiển thị trong dropdown
- [ ] Notifications mới nhất ở trên cùng
- [ ] Hiển thị tối đa 15 notifications

---

### 5️⃣ Test Auto Refresh

**Steps:**
1. [ ] Login Candidate
2. [ ] Click 🔔 (VD: có 2 unread)
3. [ ] **Không close dropdown**
4. [ ] Mở tab khác, login Employer
5. [ ] Update status của application → trigger notification mới
6. [ ] Đợi 30 giây
7. [ ] Quay lại tab Candidate

**Expected Result:**
- [ ] Badge tự động update (2 → 3)
- [ ] Dropdown tự động refresh (có notification mới xuất hiện)
- [ ] Console log: `🔔 Total notifications: X`

---

### 6️⃣ Test Empty State

**Steps:**
1. [ ] Login với account mới (chưa có notification)
2. [ ] Click 🔔

**Expected Result:**
- [ ] Badge không hiển thị
- [ ] Dropdown mở ra
- [ ] Hiển thị icon 🔔 màu xám lớn
- [ ] Text: "Chưa có thông báo nào"

---

### 7️⃣ Test Loading State

**Steps:**
1. [ ] Login Candidate
2. [ ] Click 🔔 ngay lập tức

**Expected Result:**
- [ ] Hiển thị "Đang tải..." trong vài milliseconds
- [ ] Sau đó hiển thị notifications

---

### 8️⃣ Test Error Handling

**Steps:**
1. [ ] **Stop backend server**
2. [ ] Login Candidate
3. [ ] Click 🔔

**Expected Result:**
- [ ] Console log: `❌ Error fetching notifications: ...`
- [ ] Dropdown vẫn mở được
- [ ] Không crash

---

### 9️⃣ Test Multiple Notifications Display

**Steps:**
1. [ ] Login Candidate có 10+ notifications
2. [ ] Click 🔔

**Expected Result:**
- [ ] Hiển thị tối đa 15 notifications
- [ ] Scrollbar xuất hiện nếu > 5-6 notifications
- [ ] Scrollbar custom styling (màu xám nhạt)
- [ ] Smooth scrolling

---

### 🔟 Test Responsive & Mobile

**Steps:**
1. [ ] Mở DevTools (F12)
2. [ ] Toggle device toolbar
3. [ ] Chọn iPhone 12 Pro
4. [ ] Click 🔔

**Expected Result:**
- [ ] Dropdown vừa màn hình mobile
- [ ] Không bị tràn ra ngoài
- [ ] Touch-friendly (không cần hover)
- [ ] Badge vẫn hiển thị rõ

---

## 🐛 COMMON ISSUES & FIXES

### Issue 1: Badge không hiển thị

**Kiểm tra:**
```javascript
// Console (F12):
console.log("Session:", session);
console.log("Unread count:", unreadCount);
```

**Fix:**
- Đảm bảo `session?.accessToken` có giá trị
- Check backend log: notification có được tạo không?
- Check database: `SELECT * FROM notifications WHERE user_id = X AND is_read = false;`

---

### Issue 2: Notification không mark as read

**Kiểm tra:**
```javascript
// Network tab (F12):
PUT http://localhost:8080/api/notifications/123/read
Status: 200 OK
```

**Fix:**
- Check Authorization header có đúng không
- Backend log có error không?
- Database: `UPDATE notifications SET is_read = true WHERE id = 123;`

---

### Issue 3: Notification biến mất sau khi mark as read

**Giải pháp:**
- ✅ **Đã sửa**: Frontend giờ fetch TẤT CẢ notifications, không chỉ unread
- API endpoint: `/api/notifications?page=0&size=20`

---

### Issue 4: Badge count sai

**Kiểm tra:**
```sql
-- Database:
SELECT COUNT(*) FROM notifications 
WHERE user_id = X AND is_read = false;
```

**Fix:**
- Frontend tính unread từ array: `notifications.filter(n => !n.isRead).length`
- Backend: `countByUserIdAndIsReadFalse(userId)`

---

## 📊 PERFORMANCE TEST

### Load Time Test

**Steps:**
1. [ ] Login
2. [ ] Open DevTools → Network tab
3. [ ] Click 🔔
4. [ ] Quan sát request time

**Expected:**
- [ ] API response: < 100ms
- [ ] Total dropdown render: < 200ms

---

### Stress Test

**Steps:**
1. [ ] Tạo 50+ notifications trong database
2. [ ] Login
3. [ ] Click 🔔
4. [ ] Scroll dropdown

**Expected:**
- [ ] Vẫn mượt, không lag
- [ ] Hiển thị 15 items đầu
- [ ] Scroll smooth

---

## ✅ SIGN-OFF

**Tested by:** _________________  
**Date:** _________________  
**Environment:** 
- [ ] Development (localhost)
- [ ] Staging
- [ ] Production

**Overall Status:**
- [ ] All tests passed ✅
- [ ] Some tests failed (see notes) ⚠️
- [ ] Critical issues found ❌

**Notes:**
_______________________________________
_______________________________________
_______________________________________
