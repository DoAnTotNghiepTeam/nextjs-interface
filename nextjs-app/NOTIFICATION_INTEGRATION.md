# 🔔 Tích hợp hệ thống Notification

## 📋 Tổng quan

Hệ thống notification đã được cập nhật để sử dụng **API riêng biệt** từ backend thay vì lấy dữ liệu từ bảng `applicants`. Backend đã xây dựng bảng `notifications` riêng với đầy đủ chức năng quản lý thông báo.

## 🔄 Thay đổi chính

### 1. **API Endpoints mới**

Frontend giờ sử dụng các endpoint sau:

```typescript
// Lấy danh sách thông báo chưa đọc
GET http://localhost:8080/api/notifications/unread
Response: {
  notifications: Notification[],
  unreadCount: number
}

// Đánh dấu thông báo đã đọc
PUT http://localhost:8080/api/notifications/{id}/read
Response: {
  message: "Đã đánh dấu thông báo là đã đọc"
}

// Lấy tất cả thông báo với phân trang
GET http://localhost:8080/api/notifications?page=0&size=10
Response: {
  notifications: Notification[],
  currentPage: number,
  totalPages: number,
  totalItems: number,
  hasNext: boolean,
  hasPrevious: boolean
}

// Đếm số thông báo chưa đọc
GET http://localhost:8080/api/notifications/unread-count
Response: {
  unreadCount: number
}

// Đánh dấu tất cả đã đọc
PUT http://localhost:8080/api/notifications/mark-all-read
Response: {
  message: "Đã đánh dấu tất cả thông báo là đã đọc"
}
```

### 2. **Interface Notification mới**

```typescript
interface Notification {
  id: number;
  title: string;                  // Tiêu đề thông báo (VD: "✅ CV của bạn đã được duyệt!")
  message: string;                // Nội dung chi tiết
  status: string;                 // "PENDING" | "CV_PASSED" | "INTERVIEW" | "HIRED" | "REJECTED"
  isRead: boolean;                // Đã đọc chưa
  createdAt: string;              // ISO datetime
  applicantId: number | null;     // ID đơn ứng tuyển liên quan
  jobTitle: string;               // Tên công việc
  companyName: string;            // Tên công ty
}
```

### 3. **Luồng tạo thông báo từ Backend**

#### 3.1. Khi Candidate apply vào Job
```java
// ApplicantService.java - applyJob()
notificationService.createApplySuccessNotification(applicant);
// → Tạo thông báo: "✅ Ứng tuyển thành công"

notificationService.createNewApplicantNotification(applicant);
// → Tạo thông báo cho Employer: "🔔 Có ứng viên mới ứng tuyển"
```

#### 3.2. Khi Employer cập nhật trạng thái
```java
// ApplicantService.java - updateApplicantStatus()
notificationService.createStatusUpdateNotification(applicant, newStatus, note);
// → Tạo thông báo cho Candidate:
//   - CV_PASSED: "✅ CV của bạn đã được duyệt!"
//   - INTERVIEW: "📅 Mời phỏng vấn"
//   - HIRED: "🎉 Chúc mừng! Bạn đã được tuyển dụng"
//   - REJECTED: "Thông báo từ [CompanyName]"
```

## 🎨 Frontend Components

### `NotificationBell.tsx`

**Chức năng chính:**
- Hiển thị icon 🔔 với badge số thông báo chưa đọc
- Dropdown list hiển thị tối đa 10 thông báo gần nhất
- Tự động refresh mỗi 30 giây
- Click vào notification → đánh dấu đã đọc + chuyển tới trang chi tiết applicant

**Features:**
- ✅ Real-time unread count
- ✅ Mark as read khi click
- ✅ Hiển thị thời gian tương đối ("5 phút trước", "2 giờ trước")
- ✅ Màu sắc status (Hired = xanh, Rejected = đỏ, Interview = tím, CV_PASSED = xanh dương)
- ✅ Unread notification có background gradient xanh dương + border trái 4px

**Styling:**
```css
/* Thông báo chưa đọc */
.notificationItem.unread {
  background: linear-gradient(90deg, #dbeafe 0%, #eff6ff 100%);
  border-left: 4px solid #2563eb;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(37, 99, 235, 0.1);
}

/* Hover effect */
.notificationItem.unread:hover {
  background: linear-gradient(90deg, #bfdbfe 0%, #dbeafe 100%);
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.15);
}
```

## 🧪 Test Scenarios

### 1. Test Candidate nhận thông báo khi apply
```bash
# 1. Login với Candidate account
# 2. Apply vào một job bất kỳ
# 3. Click vào icon 🔔
# ✅ Phải thấy thông báo: "✅ Ứng tuyển thành công"
```

### 2. Test Employer nhận thông báo khi có ứng viên mới
```bash
# 1. Candidate apply vào job
# 2. Login với Employer account (chủ job đó)
# 3. Click vào icon 🔔
# ✅ Phải thấy thông báo: "🔔 Có ứng viên mới ứng tuyển"
```

### 3. Test Candidate nhận thông báo khi Employer update status
```bash
# 1. Login với Employer account
# 2. Vào trang quản lý applicants
# 3. Update status applicant từ PENDING → CV_PASSED
# 4. Logout và login lại với Candidate account
# 5. Click vào icon 🔔
# ✅ Phải thấy thông báo: "✅ CV của bạn đã được duyệt!"
```

### 4. Test mark as read functionality
```bash
# 1. Login với Candidate account có thông báo chưa đọc
# 2. Click vào icon 🔔
# 3. Click vào một thông báo
# ✅ Badge count phải giảm đi 1
# ✅ Notification đó phải mất background xanh dương
# ✅ Browser chuyển tới trang chi tiết applicant
```

## 🐛 Debugging

### Kiểm tra console logs:
```javascript
// NotificationBell.tsx logs:
console.log("🔔 Unread notifications:", data.unreadCount);
console.log("🔔 Sample notification:", data.notifications?.[0]);
console.log("❌ Error fetching notifications:", error);
console.log("❌ Error marking notification as read:", error);
```

### Kiểm tra Network tab (F12):
- **Request URL**: `http://localhost:8080/api/notifications/unread`
- **Headers**: Phải có `Authorization: Bearer <JWT_TOKEN>`
- **Response**: `{ notifications: [...], unreadCount: 3 }`

### Lỗi thường gặp:

1. **Badge không hiển thị số đúng**
   - Check: Backend có tạo notification khi employer update status không?
   - Check: `isRead` field có được set đúng không?

2. **Click notification không mark as read**
   - Check: `handleMarkAsRead()` có gọi đúng API không?
   - Check: Response từ PUT `/api/notifications/{id}/read` có status 200 không?

3. **Không có thông báo nào hiển thị**
   - Check: Backend có chạy không? (`http://localhost:8080`)
   - Check: JWT token có hợp lệ không?
   - Check: Database có bảng `notifications` không?
   - Check: `user_id` trong notifications table có đúng không?

## 📦 Database Schema

```sql
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    applicant_id BIGINT,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    status VARCHAR(50),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL,
    job_title VARCHAR(255),
    company_name VARCHAR(255),
    
    CONSTRAINT fk_notification_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_notification_applicant 
        FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_is_read (is_read)
);
```

## 🚀 Next Steps (Optional Enhancements)

1. **Server-Sent Events (SSE)** cho real-time notifications
2. **Push Notifications** qua browser API
3. **Sound alert** khi có thông báo mới
4. **Filter notifications** theo status (All, Hired, Rejected, etc.)
5. **Search trong notifications**
6. **Infinite scroll** thay vì pagination
7. **"Mark all as read"** button trong dropdown
8. **Desktop notification** permission request

## 📝 Notes

- Notification chỉ hiển thị cho **Candidate** (user đang login)
- Employer cũng có thể nhận notification (khi có ứng viên mới apply)
- Thời gian refresh: **30 giây** (có thể thay đổi trong `setInterval(fetchNotifications, 30000)`)
- Badge hiển thị tối đa **99+** (nếu > 99)
- Dropdown hiển thị tối đa **10 notifications** gần nhất

## 🔗 Related Files

- **Frontend:**
  - `components/NotificationBell.tsx` - Main component
  - `components/NotificationBell.module.css` - Styling

- **Backend:**
  - `entities/Notification.java` - Entity
  - `repositories/NotificationRepository.java` - Data access
  - `services/NotificationService.java` - Business logic
  - `controllers/NotificationController.java` - REST API
  - `services/ApplicantService.java` - Tạo notifications khi apply/update status
  - `dtos/Notification/NotificationResponseDto.java` - Response DTO

- **Database:**
  - Migration SQL: Tạo bảng `notifications` với foreign keys

---

**Last updated:** January 5, 2026
**Backend version:** Spring Boot 3.x
**Frontend version:** Next.js 14.x
