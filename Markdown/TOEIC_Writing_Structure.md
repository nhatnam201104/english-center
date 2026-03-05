# Cấu trúc Đề thi TOEIC Writing

Tài liệu mô tả chi tiết các phần thi thuộc model `EntranceExamWriting`. Tập trung vào khả năng trình bày văn bản từ mức độ câu đến bài luận.

---

## 1. Part 1: Write a Sentence Based on a Picture (Câu 1-5)
* **Model:** `WritingOneToFive`
* **Chi tiết:** Viết 01 câu mô tả hình ảnh dựa trên 2 từ/cụm từ gợi ý.
* **Cấu trúc dữ liệu:** `imageOne` đến `imageFive`.
* **Thời gian tổng:** 8 phút cho 5 câu.
* **Quy tắc:**
    * Sử dụng đúng 2 từ gợi ý.
    * Có thể thay đổi hình thức từ (chia thì, số ít/nhiều).
    * Thứ tự từ trong câu tùy ý.
* **UI Suggestion:** Hiển thị ảnh và 2 nhãn từ gợi ý bên dưới, kèm một ô `input` hoặc `textarea` ngắn cho mỗi ảnh.

## 2. Part 2: Respond to a Written Request (Câu 6-7)
* **Model:** `WritingSixSeven`
* **Chi tiết:** Viết email phản hồi dựa trên một yêu cầu văn bản cho sẵn.
* **Cấu trúc dữ liệu:** `imageSix`, `imageSeven` (Thường là ảnh chụp nội dung email yêu cầu).
* **Thời gian:** 20 phút (Mỗi email 10 phút).
* **Yêu cầu:** Thể hiện khả năng giải quyết vấn đề, đặt câu hỏi hoặc cung cấp thông tin qua email.
* **UI Suggestion:** Trình soạn thảo văn bản giả lập giao diện Email (To, Subject, Body).

## 3. Part 3: Write an Opinion Essay (Câu 8)
* **Model:** `WritingEight`
* **Chi tiết:** Viết bài luận trình bày quan điểm, giải thích và ủng hộ ý kiến về một vấn đề.
* **Cấu trúc dữ liệu:** `questionEight` (Chủ đề bài luận).
* **Thời gian:** 30 phút.
* **Yêu cầu:** Bài luận hiệu quả nên chứa **ít nhất 300 từ**.
* **UI Suggestion:** * Khung soạn thảo lớn (Text editor).
    * **Tính năng quan trọng:** Có bộ đếm số lượng từ (Word count) hiển thị thời gian thực để người dùng theo dõi mục tiêu 300 từ.