# 📢 Hướng dẫn Backend: Thông báo khi Employer cập nhật trạng thái ứng tuyển

## ⚠️ Vấn đề hiện tại

**Candidate KHÔNG nhận thông báo khi Employer thay đổi trạng thái ứng tuyển (PENDING → CV_PASSED, INTERVIEW, REJECTED, HIRED)**

### Nguyên nhân:
- Backend chưa tự động đặt `isRead = false` cho applicant khi employer cập nhật status
- Khi employer thay đổi status, record applicant vẫn giữ nguyên `isRead = true` (hoặc giá trị cũ)
- Frontend chỉ đếm và hiển thị thông báo dựa trên `isRead = false`

---

## ✅ Giải pháp Backend cần implement

### 1. **Endpoint hiện tại**: `PATCH /api/applicant/{id}/status`

Khi employer gọi endpoint này để cập nhật status, backend cần:

```java
// ❌ SAI - Chỉ cập nhật status
public void updateApplicantStatus(Long id, String newStatus) {
    Applicant applicant = applicantRepository.findById(id);
    applicant.setApplicationStatus(newStatus);
    applicantRepository.save(applicant);
}

// ✅ ĐÚNG - Cập nhật status + Reset isRead
public void updateApplicantStatus(Long id, String newStatus, String note) {
    Applicant applicant = applicantRepository.findById(id);
    applicant.setApplicationStatus(newStatus);
    applicant.setIsRead(false);  // 👈 QUAN TRỌNG: Đánh dấu chưa đọc
    applicantRepository.save(applicant);
    
    // Optional: Thêm vào history
    ApplicantHistory history = new ApplicantHistory();
    history.setApplicantId(id);
    history.setStatus(newStatus);
    history.setNote(note);
    history.setChangedAt(LocalDateTime.now());
    history.setChangedBy(currentEmployerName);
    historyRepository.save(history);
}
```

### 2. **Logic đầy đủ**

```java
@Transactional
public ApplicantDTO updateStatus(Long applicantId, UpdateStatusRequest request) {
    // 1. Tìm applicant
    Applicant applicant = applicantRepository.findById(applicantId)
        .orElseThrow(() -> new NotFoundException("Applicant not found"));
    
    String oldStatus = applicant.getApplicationStatus();
    String newStatus = request.getStatus();
    
    // 2. Chỉ reset isRead nếu status thực sự thay đổi
    if (!oldStatus.equals(newStatus)) {
        applicant.setApplicationStatus(newStatus);
        applicant.setIsRead(false);  // 👈 Đặt chưa đọc để candidate nhận thông báo
        applicant.setUpdatedAt(LocalDateTime.now());
        
        // 3. Lưu vào database
        applicantRepository.save(applicant);
        
        // 4. Thêm history record
        ApplicantHistory history = new ApplicantHistory();
        history.setApplicantId(applicantId);
        history.setStatus(newStatus);
        history.setNote(request.getNote());
        history.setChangedAt(LocalDateTime.now());
        history.setChangedBy(getCurrentEmployerName());
        historyRepository.save(history);
        
        // 5. Optional: Gửi email notification
        emailService.sendStatusUpdateEmail(applicant);
        
        log.info("✅ Updated applicant {} status: {} -> {} (isRead reset to false)", 
                 applicantId, oldStatus, newStatus);
    }
    
    return mapToDTO(applicant);
}
```

---

## 🔍 Test Cases

### Test 1: Employer update status → Candidate nhận thông báo
```
GIVEN: Applicant có status = PENDING, isRead = true
WHEN:  Employer update status → CV_PASSED
THEN:  
  - applicant.status = CV_PASSED ✅
  - applicant.isRead = false ✅
  - Frontend hiển thị badge đỏ với count +1 ✅
```

### Test 2: Employer update lại cùng status → Không tạo thông báo mới
```
GIVEN: Applicant có status = CV_PASSED, isRead = false
WHEN:  Employer update lại status → CV_PASSED (không thay đổi)
THEN:  
  - applicant.status = CV_PASSED (không đổi)
  - applicant.isRead = false (không đổi)
  - Không tạo history record mới
```

---

## 📊 Database Schema

Đảm bảo table `applicants` có cột:

```sql
ALTER TABLE applicants 
ADD COLUMN is_read BOOLEAN DEFAULT FALSE;

-- Migration existing data
UPDATE applicants 
SET is_read = FALSE 
WHERE application_status IN ('CV_PASSED', 'INTERVIEW', 'HIRED', 'REJECTED');
```

---

## 🚀 API Request/Response Example

### Request
```http
PATCH /api/applicant/123/status
Authorization: Bearer {employer_token}
Content-Type: application/json

{
  "status": "CV_PASSED",
  "note": "CV đạt yêu cầu, mời phỏng vấn vòng 1"
}
```

### Response
```json
{
  "success": true,
  "data": {
    "id": 123,
    "candidateId": 456,
    "jobId": 789,
    "applicationStatus": "CV_PASSED",
    "isRead": false,  // 👈 Quan trọng
    "updatedAt": "2026-01-03T10:30:00"
  }
}
```

---

## 📌 Checklist Backend

- [ ] Thêm cột `is_read` vào table `applicants` (nếu chưa có)
- [ ] Update endpoint `PATCH /api/applicant/{id}/status` để set `isRead = false`
- [ ] Chỉ reset `isRead` khi status thực sự thay đổi
- [ ] Thêm record vào `applicant_history` table
- [ ] Test với các status: PENDING → CV_PASSED, CV_PASSED → INTERVIEW, INTERVIEW → HIRED, etc.
- [ ] Verify frontend nhận được `isRead = false` qua API `/api/applicant?page=0&size=50`
- [ ] Optional: Gửi email notification khi status thay đổi

---

## 🎯 Kết quả mong đợi

Sau khi implement:

1. **Employer** cập nhật status: PENDING → CV_PASSED
2. **Backend** tự động set `isRead = false`
3. **Frontend NotificationBell** hiển thị badge đỏ với số thông báo mới
4. **Candidate** click vào thông báo → frontend gọi `PATCH /api/applicant/{id}/mark-read`
5. **Backend** set `isRead = true` → badge biến mất

---

## 💡 Lưu ý Frontend (đã implement)

Frontend đã sẵn sàng:
- ✅ NotificationBell component fetch `/api/applicant` và filter theo `isRead === false`
- ✅ ApplicantsTable hiển thị badge NEW cho các card `isRead === false`
- ✅ Click vào thông báo → auto call `mark-read` endpoint
- ✅ CSS nổi bật cho thông báo chưa đọc (background gradient + border đậm)

**Backend chỉ cần đảm bảo set `isRead = false` khi employer update status là đủ!**

---

## 📧 Contact

Nếu có thắc mắc về integration, liên hệ Frontend team.
