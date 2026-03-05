# Cấu trúc Đề thi TOEIC Speaking

Tài liệu mô tả chi tiết các phần thi thuộc model `EntranceExamSpeaking`. Tổng số câu hỏi: **11 câu**. Thang điểm: **0 - 200** (Chia làm 8 cấp độ).

---

## 1. Part 1: Read a Text Aloud (Câu 1-2)
* **Model:** `SpeakingOneTwo`
* **Chi tiết:** Đọc văn bản thành tiếng.
* **Cấu trúc dữ liệu:** `questionOne` (Đoạn văn 1), `questionTwo` (Đoạn văn 2).
* **Thời gian:** * Chuẩn bị: 45 giây / câu.
    * Trả lời (Đọc): 45 giây / câu.
* **UI Suggestion:** Hiển thị đoạn văn bản lớn, có trình ghi âm và đồng hồ đếm ngược 2 giai đoạn (Chuẩn bị -> Ghi âm).

## 2. Part 2: Describe a Picture (Câu 3-4)
* **Model:** `SpeakingThreeFour`
* **Chi tiết:** Mô tả hình ảnh có sẵn.
* **Cấu trúc dữ liệu:** `imageThree`, `imageFour` (URL/Path của hình ảnh).
* **Thời gian:** * Chuẩn bị: 45 giây.
    * Trả lời: 30 giây.
* **UI Suggestion:** Hiển thị ảnh ở trung tâm, người dùng quan sát và mô tả chi tiết các hoạt động trong ảnh.

## 3. Part 3: Respond to Questions (Câu 5-7)
* **Model:** `SpeakingFiveToSeven`
* **Chi tiết:** Trả lời các câu hỏi tình huống ngắn (không có tài liệu đọc).
* **Cấu trúc dữ liệu:** `passage` (Bối cảnh tình huống), `questionFive`, `questionSix`, `questionSeven`.
* **Thời gian:** * Chuẩn bị: 3 giây / câu.
    * Trả lời: Câu 5, 6 (15 giây/câu); Câu 7 (30 giây).
* **UI Suggestion:** Hiển thị bối cảnh, sau đó lần lượt xuất hiện từng câu hỏi. Âm thanh thông báo (Beep) ngay sau 3 giây chuẩn bị để bắt đầu nói.

## 4. Part 4: Respond to Questions using Information Provided (Câu 8-10)
* **Model:** `SpeakingEightToTen`
* **Chi tiết:** Trả lời câu hỏi dựa trên thông tin (bảng biểu, lịch trình) cho sẵn.
* **Cấu trúc dữ liệu:** `passage` (Dữ liệu bảng biểu dạng văn bản), `image` (Dữ liệu bảng biểu dạng ảnh - optional), `questionEight`, `questionNine`, `questionTen`.
* **Thời gian:** * Đọc tài liệu: 45 giây. Chuẩn bị mỗi câu: 3 giây.
    * Trả lời: Câu 8, 9 (15 giây/câu); Câu 10 (30 giây).
* **UI Suggestion:** Màn hình chia đôi: Một bên giữ cố định bảng thông tin, một bên hiển thị câu hỏi hiện tại.

## 5. Part 5: Express an Opinion (Câu 11)
* **Model:** `SpeakingEleven`
* **Chi tiết:** Bày tỏ quan điểm cá nhân về một vấn đề xã hội hoặc công việc.
* **Cấu trúc dữ liệu:** `question` (Chủ đề nghị luận).
* **Thời gian:** * Chuẩn bị: 30 giây.
    * Trả lời: 60 giây.
* **UI Suggestion:** Hiển thị câu hỏi lớn, có không gian để người dùng nháp (offline) trước khi đồng hồ ghi âm bắt đầu.