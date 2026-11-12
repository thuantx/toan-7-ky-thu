export const SPECIFICATION_DOCUMENT = {
  title: "TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM & THIẾT KẾ HỆ THỐNG (SRS & ARCHITECTURE)",
  subTitle: "Hệ Thống Học Toán Lớp 7 Trực Quan Hóa & Trò Chơi Hóa (MathQuest LMS)",
  version: "v2.4 - Production Draft",
  author: "Senior Business Analyst & EdTech Lead Architect",
  derivedFrom: "10. Bài tập Toán 7 cơ bản Kết Nối Tri Thức cả năm.pdf",
  date: "2026-11-12",

  sections: [
    {
      id: "sec-overview",
      title: "I. TỔNG QUAN HỆ THỐNG VÀ CẤU TRÚC PHÂN CẤP LMS",
      content: `### 1. Bối cảnh & Mục tiêu (Problem & Vision)
Chương trình Toán 7 Kết Nối Tri Thức với Cuộc Sống có lượng kiến thức chuyển tiếp quan trọng từ số học tiểu học sang tư duy đại số trừu tượng (Số hữu tỉ, số thực, đa thức) và tư duy hình học tiên đề (Góc so le trong, tiên đề Euclid, tam giác bằng nhau c-c-c, c-g-c, g-c-g). Học sinh lứa tuổi 12-13 tuổi dễ nản lòng trước các bài toán biến đổi thuần số và chứng minh hình học dài.

**Giải pháp MathQuest LMS**: Trò chơi hóa (Gamification) toàn bộ tài liệu PDF chuẩn, chuyển hóa kiến thức thành các chặng thám hiểm, có linh vật đồng hành (Mascot Cú Pipo), cơ chế thưởng điểm kinh nghiệm (XP), thu thập bảo vật, và cứu trợ khi gặp khó khăn (Hint 2 cấp).

### 2. Cấu trúc dữ liệu phân cấp 3 tầng chuẩn LMS
Nội dung từ tài liệu PDF được chuẩn hóa theo mô hình phân cấp:
\`\`\`
Toán 7 (Curriculum)
├── 10 Chương (Chapters)
│   ├── Các Bài học (Lessons - Tổng cộng 37 bài)
│   │   ├── 1. Khung Lý Thuyết (Theory Card): Trực quan hóa quy tắc, công thức, bẫy sai lầm
│   │   ├── 2. Ví dụ mẫu (Step-by-step Examples): Lời giải chi tiết từng bước có giải thích
│   │   └── 3. Ngân hàng Bài tập Vận dụng (Question Bank):
│   │         ├── Trắc nghiệm nhận biết & thông hiểu (Multiple Choice)
│   │         ├── Điền đáp án số / biểu thức tự luận (Fill-in-the-blank)
│   │         └── Bộ lọc theo dạng bài (Dạng 1: Tính toán, Dạng 2: Tìm x, Dạng 3: Bài toán tỉ lệ, Dạng 4: Hình học chứng minh)
\`\`\`

### 3. Danh mục 25 Bài học Trọng tâm đã Số hóa & Tích hợp LMS (Từ file PDF Kết Nối Tri Thức):
- **Chương I: Số Hữu Tỉ**
  - *Bài 1:* Tập hợp các số hữu tỉ $\mathbb{Q}$, biểu diễn trên trục số, số đối.
  - *Bài 2:* Cộng, trừ, nhân, chia số hữu tỉ.
  - *Bài 3:* Lũy thừa với số mũ tự nhiên của số hữu tỉ.
  - *Bài 4:* Thứ tự thực hiện phép tính. Quy tắc chuyển vế tìm x.
- **Chương II: Số Thực**
  - *Bài 5:* Làm quen với số thập phân vô hạn tuần hoàn và làm tròn số.
  - *Bài 6:* Số vô tỉ. Căn bậc hai số học $\\sqrt{a}$.
  - *Bài 7:* Tập hợp các số thực $\\mathbb{R}$ và giá trị tuyệt đối $|x|$.
- **Chương III: Góc và Đường Thẳng Song Song**
  - *Bài 8:* Góc ở vị trí đặc biệt (kề bù, đối đỉnh). Tia phân giác của một góc.
  - *Bài 9:* Hai đường thẳng song song và dấu hiệu nhận biết (so le trong, đồng vị).
  - *Bài 10 (Mới bổ sung):* Tiên đề Euclid về đường thẳng song song và tính chất hai đường thẳng song song.
  - *Bài 11 (Mới bổ sung):* Định lí và phương pháp chứng minh định lí (Giả thiết - Kết luận).
- **Chương IV: Tam Giác Bằng Nhau**
  - *Bài 12:* Tổng các góc trong một tam giác bằng 180°.
  - *Bài 13 (Mới bổ sung):* Hai tam giác bằng nhau. Trường hợp bằng nhau thứ nhất: Cạnh - Cạnh - Cạnh (c.c.c).
  - *Bài 14:* Trường hợp bằng nhau thứ hai (c.g.c) và thứ ba (g.c.g).
  - *Bài 15 (Mới bổ sung):* Các trường hợp bằng nhau của tam giác vuông (cạnh huyền - góc nhọn, cạnh huyền - cạnh góc vuông).
  - *Bài 16 (Mới bổ sung):* Tam giác cân. Tính chất đường trung trực của đoạn thẳng.
- **Chương V: Thu Thập & Biểu Diễn Dữ Liệu**
  - *Bài 17 (Mới bổ sung):* Thu thập và phân loại dữ liệu (định tính vs định lượng, tính đại diện).
  - *Bài 18 (Mới bổ sung):* Biểu đồ hình quạt tròn (đọc, phân tích và chuyển đổi tỉ lệ phần trăm sang số lượng).
  - *Bài 19 (Mới bổ sung):* Biểu đồ đoạn thẳng (phân tích xu hướng tăng/giảm theo thời gian).
- **Chương VI: Tỉ Lệ Thức & Đại Lượng Tỉ Lệ**
  - *Bài 20 (Mới bổ sung):* Tỉ lệ thức và tính chất cơ bản $\\frac{a}{b} = \\frac{c}{d} \\iff a \\cdot d = b \\cdot c$.
  - *Bài 21 (Mới bổ sung):* Tính chất của dãy tỉ số bằng nhau $\\frac{a}{b} = \\frac{c}{d} = \\frac{a+c}{b+d}$.
  - *Bài 22 (Mới bổ sung):* Đại lượng tỉ lệ thuận ($y = kx$) và giải toán phân chia tỉ lệ.
  - *Bài 23 (Mới bổ sung):* Đại lượng tỉ lệ nghịch ($y = \\frac{a}{x}$ hay $x \\cdot y = a$) và ứng dụng thực tiễn năng suất, thời gian.
- **Chương VII: Biểu Thức Đại Số & Đa Thức Một Biến**
  - *Bài 24 (Mới bổ sung):* Biểu thức đại số và tính giá trị của biểu thức tại giá trị cho trước của biến.
  - *Bài 25:* Đa thức một biến, thu gọn, xác định bậc, hệ số cao nhất, hệ số tự do và tìm nghiệm của đa thức.`
    },
    {
      id: "sec-gamification",
      title: "II. THIẾT KẾ GAMIFICATION, MASCOT & TRẢI NGHIỆM NGƯỜI DÙNG",
      content: `### 1. Thiết kế Linh vật (Mascot Pipo)
- **Hình tượng**: Cú Pipo đeo kính thông thái, đội mũ cử nhân bảy sắc cầu vồng, tay cầm thước kẻ và phấn màu ma thuật.
- **Vai trò sư phạm**:
  - *Đón tiếp*: Chào học sinh bằng tên, thông báo chuỗi ngày học liên tục (Streak).
  - *Động viên*: Khi học sinh làm đúng 3 câu liên tiếp -> Pipo bay nhảy tung pháo hoa cổ vũ (+Combo Multiplier).
  - *Cứu trợ sư phạm (Scaffolding)*: Khi học sinh trả lời sai lần 1 -> Pipo giữ bình tĩnh ("Bình tĩnh nào, kiểm tra lại dấu phép tính xem nhé!"). Khi sai lần 2 -> Pipo kích hoạt **Túi Cứu Trợ (Hint Modal)** hiển thị gợi ý từng bước mà không làm mất mạng tiếp.

### 2. Cơ chế Điểm thưởng & Hệ thống Phạt (Reward & Penalty Economy)
| Yếu tố | Quy tắc tính | Mục đích tâm lý |
| :--- | :--- | :--- |
| **Điểm XP** | +20 XP (câu đúng lần 1), +10 XP (câu đúng lần 2), +5 XP (sau khi xem gợi ý) | Tạo động lực học tập tức thì |
| **Xu vàng (Coins)** | +5 Xu mỗi câu đúng, +50 Xu khi đạt sao hoàn thành bài | Tiền tệ mở khóa trang phục Pipo / mua Tim |
| **Tim / Mạng (Lives)** | Tối đa 5 tim. Sai 1 lần: -1 Tim. Tự hồi phục 1 tim sau mỗi 30 phút, hoặc đổi 100 Xu | Rèn luyện tính cẩn thận, chống đoán bừa |
| **Streak (Ngọn lửa)** | Duy trì bằng cách hoàn thành tối thiểu 10 câu hỏi mỗi ngày. Multiplier x1.2 sau 3 ngày, x1.5 sau 7 ngày | Hình thành thói quen kỷ luật học tập hàng ngày |
| **Huy hiệu (Badges)** | 'Thợ Săn Số Hữu Tỉ', 'Phù Thủy Hình Học', 'Bậc Thầy Nghiệm Đa Thức' | Thỏa mãn nhu cầu sưu tầm và công nhận |

### 3. Cơ chế Phân Quyền (RBAC) cho Gợi ý & Lời giải Chi tiết (Hint & Solution Governance)
- **Học sinh (Student) - Tuyệt đối không xem gợi ý trước khi nộp bài**:
  - Nhằm rèn luyện tư duy tự chủ và chống đoán mò đáp án, học sinh **hoàn toàn không được cung cấp nút 'Xem gợi ý'** trong khi đang làm bài.
  - Mascot Pipo động viên học sinh đọc kỹ đề, tự tính toán nháp và tự tin kiểm tra đáp án.
- **Sau khi kiểm tra đáp án (Post-Submission Review)**:
  - **CHỈ SAU KHI KIỂM TRA ĐÁP ÁN**, hệ thống mới mở toàn bộ **'Giải Thích & Cách Giải Chi Tiết Từng Bước (Step-by-step Solution)'** cùng **'Ghi nhớ cốt lõi & Kết luận'**.
  - Dù học sinh làm đúng hay sai, phần cách giải chi tiết từng bước đều được hiển thị để học sinh đối chiếu phương pháp, khắc sâu công thức và nhận biết bẫy sai lầm.
- **Admin / Giáo viên (Admin / Teacher)**:
  - Tài khoản Admin/GV có quyền kích hoạt nút **'Admin: Xem trước Gợi ý & Đáp án'** trước khi submit để kiểm tra nội dung sư phạm, chuẩn bị bài giảng hoặc hỗ trợ học sinh khi cần thiết.
- **Xử lý trừ mạng & Thưởng**:
  - Trả lời đúng lần 1: +20 XP, +5 Xu vàng.
  - Trả lời sai: Trừ 1 Tim, hệ thống mở cách giải chi tiết để học sinh rút kinh nghiệm trước khi thử lại hoặc sang câu tiếp theo.`
    },
    {
      id: "sec-state-machine",
      title: "III. MÔ HÌNH TRẠNG THÁI (STATE MACHINE) & XỬ LÝ EDGE-CASES",
      content: `### 1. State Machine chuyển trạng thái Bài học (Lesson Lifecycle)
Bài học tuân theo 4 trạng thái hữu hạn (FSM - Finite State Machine):

\`\`\`
[ NOT_STARTED ] (Chưa học)
       │
       ▼ (Học sinh mở lý thuyết hoặc làm câu đầu tiên)
[ IN_PROGRESS ] (Đang học) ◄───────────────┐
       │                                   │ (Điểm < 80%
       │ (Hoàn thành 100% câu hỏi          │  hoặc làm lại bài)
       │  với độ chính xác ≥ 80%)          │
       ▼                                   │
[ COMPLETED ] (Hoàn thành) ────────────────┘
       │
       ▼ (Đạt độ chính xác 100% không dùng gợi ý + Hoàn thành Speed Quiz < 5 phút)
[ MASTER ] (Tinh thông ⭐)
\`\`\`

### 2. Chi tiết các chuyển trạng thái (Transitions & Guards)
- **T1: NOT_STARTED → IN_PROGRESS**:
  - *Trigger*: User click 'Bắt đầu học' hoặc hoàn thành câu hỏi số 1.
  - *Action*: Tạo bản ghi \`UserProgress\`, ghi nhận \`started_at = NOW()\`, gán trạng thái \`IN_PROGRESS\`.
- **T2: IN_PROGRESS → COMPLETED**:
  - *Guard*: \`total_answered == total_questions\` AND \`accuracy >= 80%\`.
  - *Action*: Tặng +100 XP, thưởng 50 Xu vàng, bắn pháo hoa chiến thắng, cập nhật tổng % hoàn thành chương trình.
- **T3: COMPLETED → MASTER**:
  - *Guard*: Học sinh vượt qua bài kiểm tra ôn tập nâng cao (Mastery Challenge) với \`accuracy == 100%\` và không sử dụng gợi ý (Hint count = 0).
  - *Action*: Cấp huy hiệu Master đính kèm bài học, nhân đôi phần thưởng XP.

### 3. Kỹ thuật Xử lý Edge-Cases (Ngoại lệ & Sự cố)
1. **Edge-case 1: Học sinh đột ngột đóng ứng dụng / tắt tab khi đang làm bài**:
   - *Giải pháp*: **Auto-checkpointing vào LocalStorage/IndexedDB** sau mỗi thao tác chọn đáp án (debounce 300ms).
   - *Khôi phục*: Khi mở lại ứng dụng, hệ thống hiển thị Dialog: *'Chào [Tên bé], Pipo thấy em đang làm dở bài [Tên bài] ở câu số 4/10. Em có muốn tiếp tục làm tiếp không?'*. Dữ liệu điểm số, tim và thời gian trôi qua được phục hồi nguyên vẹn.
2. **Edge-case 2: Mất kết nối mạng Internet giữa chừng**:
   - *Giải pháp*: Mô hình **Offline-First**. Toàn bộ dữ liệu câu hỏi của bài học được tải sẵn vào bộ nhớ đệm (Cache). Học sinh tiếp tục làm bài bình thường. Kết quả được đưa vào **Sync Queue** và tự động đồng bộ lên máy chủ khi có lại kết nối mạng (\`window.addEventListener('online')\`).
3. **Edge-case 3: Hết tim giữa bài kiểm tra**:
   - *Giải pháp*: Tránh làm học sinh cụt hứng hoặc ức chế:
     - Cho phép làm Mini-game toán tư duy nhanh (Speed Math: cộng trừ đơn giản) để hồi ngay +1 Tim.
     - Dùng 100 Xu vàng tích lũy để mua gói Hồi phục tim.
     - Phụ huynh/Giáo viên có thể cấp thêm tim trợ giúp.`
    },
    {
      id: "sec-dashboard-goals",
      title: "IV. DASHBOARD THỐNG KÊ & HỆ THỐNG NỘI SUY MỤC TIÊU",
      content: `### 1. Dashboard Thống kê thông minh
- **Tiến độ tổng thể (Curriculum Completion Rate)**:
  $$\\text{Tiến độ tổng (\\%)} = \\frac{\\sum_{i=1}^{N} \\text{Điểm trọng số bài } i}{N \\times 100} \\times 100\\%$$
  Trong đó: Trạng thái Chưa học = 0%, Đang học = 30%, Hoàn thành = 80%, Master = 100%.
- **Chỉ số chi tiết từng bài học**:
  - Số câu trả lời đúng / Tổng số câu đã giải.
  - Tỉ lệ chính xác (%) và thời gian trung bình giải một câu.
  - Ma trận Radar đo lường 4 trục năng lực: *Kỹ năng tính toán phân số/số thực*, *Kỹ năng đại số & tìm x*, *Kỹ năng hình học & góc*, *Kỹ năng thống kê dữ liệu*.
- **Phân tích lỗ hổng kiến thức (Weakness Diagnostic Engine)**:
  - Tự động gắn tag các dạng bài có tỉ lệ sai > 40% (Ví dụ: *"Quy đồng phân số mẫu âm"*, *"Tính chất góc ngoài tam giác"*).
  - Đưa ra nút hành động 1-click: *'Luyện riêng 5 câu dạng này với Pipo'* để lấp lỗ hổng ngay lập tức.

### 2. Hệ thống Thiết lập Mục tiêu & Nội suy Micro-Goals (Goal Recommendation Engine)
Học sinh hoặc Phụ huynh thiết lập mục tiêu cấp cao (Macro-Goal):
- *Ví dụ*: 'Đạt điểm 9.0+ Học kỳ 1' hoặc 'Hoàn thành 100% Chương I & Chương II trước ngày 15/11'.

**Thuật toán tự động nội suy thành Micro-Goals (Mục tiêu nhỏ)**:
1. **Phân tích khoảng cách (Gap Analysis)**:
   - Số bài học còn lại cần đạt: $L_{rem} = L_{target} - L_{completed}$
   - Số câu hỏi cần luyện tập: $Q_{rem} = L_{rem} \\times \\bar{Q}$
   - Số ngày còn lại đến hạn: $D_{rem} = \\text{TargetDate} - \\text{Today}$
2. **Nội suy mục tiêu tuần (Weekly Micro-Goal Formula)**:
   $$\\text{Số bài tập/tuần} = \\left\\lceil \\frac{Q_{rem}}{D_{rem} / 7} \\right\\rceil$$
   $$\\text{Mục tiêu độ chính xác} = \\max(80\\%, \\text{TargetGrade} \\times 10\\%)$$
3. **Gợi ý cá nhân hóa của Pipo**:
   - *"Để đạt danh hiệu Học sinh Giỏi Toán HK1, lộ trình tuần này của em là: Hoàn thành 15 bài tập vận dụng Chương I với độ chính xác trên 85% và dành 20 phút ôn lại dạng Tìm x."*`
    },
    {
      id: "sec-data-dictionary",
      title: "V. TỪ ĐIỂN DỮ LIỆU (DATA DICTIONARY) CHI TIẾT",
      content: `Dưới đây là cấu trúc thiết kế 8 bảng Cơ sở dữ liệu quan hệ (RDBMS) phục vụ vận hành toàn diện hệ thống:

#### 1. Bảng \`users\` (Người dùng / Học sinh & Phụ huynh)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| \`id\` | UUID | PRIMARY KEY | Khóa chính định danh học sinh |
| \`username\` | VARCHAR(50) | NOT NULL, UNIQUE | Tên đăng nhập |
| \`display_name\` | VARCHAR(100) | NOT NULL | Tên hiển thị của bé (VD: Minh Khang) |
| \`avatar_code\` | VARCHAR(50) | DEFAULT 'pipo_apprentice' | Mã trang phục avatar của bé |
| \`current_xp\` | INTEGER | DEFAULT 0, CHECK (>=0) | Tổng điểm kinh nghiệm tích lũy |
| \`coins\` | INTEGER | DEFAULT 50, CHECK (>=0) | Tiền ảo trong app để mua đồ |
| \`hearts\` | INTEGER | DEFAULT 5, CHECK (0..5) | Số tim/mạng hiện tại |
| \`hearts_last_refill\` | TIMESTAMP | DEFAULT NOW() | Thời điểm hồi tim lần cuối |
| \`streak_days\` | INTEGER | DEFAULT 1 | Số ngày học liên tiếp |
| \`last_active_at\` | TIMESTAMP | DEFAULT NOW() | Thời điểm hoạt động gần nhất |

#### 2. Bảng \`chapters\` (Chương học - Trích xuất từ PDF)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| \`id\` | VARCHAR(20) | PRIMARY KEY | Định danh chương (VD: 'ch-1', 'ch-2') |
| \`code\` | VARCHAR(20) | NOT NULL | Ký hiệu mã chương (VD: 'CHƯƠNG I') |
| \`title\` | VARCHAR(255) | NOT NULL | Tiêu đề chương (VD: 'SỐ HỮU TỈ') |
| \`description\` | TEXT | NULL | Tóm tắt mục tiêu chương |
| \`order_index\` | INTEGER | NOT NULL | Thứ tự sắp xếp trong chương trình |

#### 3. Bảng \`lessons\` (Bài học phân cấp)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| \`id\` | VARCHAR(30) | PRIMARY KEY | Định danh bài học (VD: 'c1-l1', 'c1-l2') |
| \`chapter_id\` | VARCHAR(20) | FK -> chapters(id) | Thuộc chương nào |
| \`lesson_number\` | INTEGER | NOT NULL | Số thứ tự bài (Bài 1, Bài 2...) |
| \`title\` | VARCHAR(255) | NOT NULL | Tiêu đề bài học |
| \`theory_summary\` | JSONB | NOT NULL | Cấu trúc lý thuyết (keyPoints, rules, commonMistakes) |
| \`examples_json\` | JSONB | NOT NULL | Danh sách ví dụ minh họa step-by-step |
| \`estimated_duration\`| INTEGER | DEFAULT 30 | Thời lượng ước tính (phút) |

#### 4. Bảng \`questions\` (Ngân hàng câu hỏi vận dụng)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| \`id\` | VARCHAR(30) | PRIMARY KEY | Định danh câu hỏi |
| \`lesson_id\` | VARCHAR(30) | FK -> lessons(id) | Thuộc bài học nào |
| \`question_type\` | VARCHAR(30) | ENUM('mc', 'fill') | 'multiple_choice' hoặc 'fill_in_blank' |
| \`category\` | VARCHAR(100) | NOT NULL | Dạng bài: 'Tìm x', 'Tính hợp lý', 'Hình học' |
| \`difficulty\` | VARCHAR(20) | ENUM('Cơ bản','TB','Nâng cao') | Mức độ nhận thức |
| \`prompt\` | TEXT | NOT NULL | Đề bài câu hỏi |
| \`options_json\` | JSONB | NULL | Mảng 4 lựa chọn (đối với câu trắc nghiệm) |
| \`correct_answer\` | TEXT | NOT NULL | Đáp án chuẩn để so khớp tự động |
| \`hint_level_1\` | TEXT | NOT NULL | Gợi ý sơ bộ (sau 1 lần sai) |
| \`hint_level_2\` | TEXT | NOT NULL | Gợi ý từng bước chi tiết (sau 2 lần sai) |
| \`full_solution\` | TEXT | NOT NULL | Lời giải chi tiết hoàn chỉnh |
| \`xp_reward\` | INTEGER | DEFAULT 20 | Điểm XP nhận được khi đúng |

#### 5. Bảng \`user_progress\` (Tiến độ & State Machine học sinh)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| \`id\` | UUID | PRIMARY KEY | Khóa chính bản ghi tiến độ |
| \`user_id\` | UUID | FK -> users(id) | Học sinh |
| \`lesson_id\` | VARCHAR(30) | FK -> lessons(id) | Bài học tương ứng |
| \`status\` | VARCHAR(20) | ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'MASTER') | Trạng thái bài học |
| \`attempts_count\` | INTEGER | DEFAULT 0 | Số lượt giải câu hỏi |
| \`correct_count\` | INTEGER | DEFAULT 0 | Số câu giải đúng |
| \`accuracy_rate\` | NUMERIC(5,2) | DEFAULT 0.00 | Tỉ lệ % trả lời đúng (0 - 100) |
| \`total_time_seconds\`| INTEGER | DEFAULT 0 | Tổng thời gian làm bài (giây) |
| \`completed_at\` | TIMESTAMP | NULL | Thời điểm hoàn thành bài |
| \`mastered_at\` | TIMESTAMP | NULL | Thời điểm đạt chuẩn Master |

#### 6. Bảng \`user_goals\` (Mục tiêu học tập & Nội suy Micro-Goals)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| \`id\` | UUID | PRIMARY KEY | Khóa chính mục tiêu |
| \`user_id\` | UUID | FK -> users(id) | Học sinh |
| \`scope\` | VARCHAR(20) | ENUM('SEMESTER', 'FULL_YEAR', 'CHAPTER') | Phạm vi mục tiêu |
| \`title\` | VARCHAR(255) | NOT NULL | Tên mục tiêu (VD: Đạt danh hiệu HSG Toán 7) |
| \`target_score\` | NUMERIC(3,1) | CHECK (0..10) | Điểm số kỳ vọng (VD: 9.0) |
| \`target_date\` | DATE | NOT NULL | Ngày đến hạn hoàn thành |
| \`weekly_target_questions\` | INTEGER | NOT NULL | Micro-goal: Số bài cần làm mỗi tuần (tự nội suy) |
| \`target_accuracy\` | INTEGER | DEFAULT 80 | Micro-goal: Độ chính xác mục tiêu (%) |
| \`current_progress\` | NUMERIC(5,2) | DEFAULT 0.00 | % tiến độ đạt được tới mục tiêu |
| \`status\` | VARCHAR(20) | ENUM('ACTIVE', 'ACHIEVED', 'OVERDUE') | Trạng thái mục tiêu |

#### 7. Bảng \`study_sessions\` (Phiên học & Checkpointing khôi phục)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| \`id\` | UUID | PRIMARY KEY | Khóa chính phiên học |
| \`user_id\` | UUID | FK -> users(id) | Học sinh |
| \`lesson_id\` | VARCHAR(30) | FK -> lessons(id) | Bài học đang làm |
| \`active_question_index\` | INTEGER | DEFAULT 0 | Câu hỏi hiện tại (để khôi phục khi tắt app) |
| \`current_session_score\` | INTEGER | DEFAULT 0 | Điểm trong phiên |
| \`hearts_remaining\` | INTEGER | DEFAULT 5 | Tim còn lại trong phiên |
| \`answered_history\` | JSONB | DEFAULT '[]' | Lịch sử các câu đã trả lời trong phiên |
| \`is_active\` | BOOLEAN | DEFAULT TRUE | Trạng thái phiên còn mở hay đã đóng |

#### 8. Bảng \`badges\` (Danh mục Huy hiệu Gamification)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| \`code\` | VARCHAR(50) | PRIMARY KEY | Mã huy hiệu (VD: 'RATIONAL_MASTER') |
| \`name\` | VARCHAR(100) | NOT NULL | Tên tiếng Việt (VD: Bậc Thầy Số Hữu Tỉ) |
| \`category\` | VARCHAR(50) | NOT NULL | Danh mục (Chương 1, Chăm chỉ, Thần tốc) |
| \`criteria_description\` | TEXT | NOT NULL | Điều kiện nhận (VD: Hoàn thành 100% Chương I) |
| \`icon_path\` | VARCHAR(255) | NOT NULL | Đường dẫn icon hiển thị |`
    },
    {
      id: "sec-nfr",
      title: "VI. DANH SÁCH YÊU CẦU PHI CHỨC NĂNG (NFRs)",
      content: `### 1. Bảo mật & An toàn Trẻ em (Security & Child Safety - COPPA Compliance)
- **Bảo vệ quyền riêng tư học sinh**: Không yêu cầu trẻ cung cấp thông tin định danh cá nhân nhạy cảm (số CCCD, vị trí GPS thời gian thực).
- **Mã hóa dữ liệu**: Toàn bộ dữ liệu truyền qua giao thức an toàn HTTPS với mã hóa TLS 1.3. Mật khẩu mã hóa Bcrypt (cost factor 12).
- **Phân quyền vai trò (Role-Based Access Control - RBAC)**:
  - *Học sinh (Student)*: Làm bài tập, đổi xu, xem bảng xếp hạng lớp, nhận gợi ý từ Pipo.
  - *Phụ huynh / Giáo viên (Guardian/Teacher)*: Đặt mục tiêu học tập, theo dõi thời gian và lỗ hổng kiến thức, gửi lời khen thưởng.

### 2. Hiệu năng & Trải nghiệm tương tác (Performance SLAs)
- **Tốc độ phản hồi (Latency Budget)**: Thời gian phản hồi kiểm tra đáp án và kích hoạt hiệu ứng Mascot Pipo $\\le 150\\text{ms}$ (thao tác cục bộ tức thì).
- **Thời gian tải trang ban đầu (First Contentful Paint - FCP)**: $\\le 1.2\\text{ giây}$ trên đường truyền 4G di động thông thường.
- **Tiêu thụ tài nguyên nhẹ nhàng**: Dung lượng gói tải ban đầu tối ưu $< 500\\text{KB}$ nén Gzip, đảm bảo chạy mượt trên các máy tính bảng giá rẻ và điện thoại phổ thông của học sinh.

### 3. Giới hạn thao tác & Phòng chống Gian lận (Anti-Cheat & Rate Limits)
- **Chống spam click đáp án bừa**: Đặt giới hạn tốc độ (Rate Limiting) tối thiểu $1.5\\text{ giây}$ giữa các lần nộp đáp án. Nếu học sinh spam click liên tục 3 lần không đọc đề, Mascot Pipo sẽ nhắc: *"Em hãy đọc kỹ đề bài trước khi chọn nhé!"* và khóa nút nộp trong 3 giây.
- **Xác thực thời gian làm bài hợp lệ (Speed Anomaly Detection)**: Một bài tập 10 câu nếu hoàn thành dưới 15 giây với độ chính xác 100% sẽ bị gắn cờ bất thường, không cộng điểm vào Bảng vàng Tuần cho đến khi làm bài xác thực.
- **Hồi phục mạng (Heart Throttling)**: Mỗi lần sai bị trừ 1 tim, ngăn chặn học sinh thử sai 4 phương án trắc nghiệm mà không chịu suy nghĩ.`
    }
  ]
};
