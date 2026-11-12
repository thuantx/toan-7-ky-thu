export interface Question {
  id: string;
  lessonId: string;
  type: 'multiple_choice' | 'fill_in_blank';
  category: string; // e.g., 'Nhận biết', 'Tìm x', 'Tính hợp lý', 'Hình học'
  difficulty: 'Cơ bản' | 'Trung bình' | 'Nâng cao';
  prompt: string;
  mathExpression?: string;
  options?: string[];
  correctAnswer: string;
  adminHint: string; // Gợi ý chỉ dành cho Admin/Giáo viên
  stepByStepSolution: string; // Cách giải chi tiết từng bước (hiện sau khi kiểm tra đáp án)
  explanation: string; // Giải thích kết luận ngắn gọn
  pointsXP: number;
}

export interface Example {
  title: string;
  problem: string;
  steps: { stepNumber: number; instruction: string; formula: string }[];
  note?: string;
}

export interface Lesson {
  id: string;
  chapterId: string;
  number: number;
  title: string;
  description: string;
  theory: {
    keyPoints: string[];
    formulaSummary: string[];
    rules: string[];
    commonMistakes: string[];
  };
  examples: Example[];
  questions: Question[];
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'MASTER';
  accuracy: number; // 0 - 100
  totalAttempts: number;
  correctCount: number;
  timeSpentMinutes: number;
}

export interface Chapter {
  id: string;
  code: string;
  title: string;
  description: string;
  iconName: string;
  color: string;
  lessons: Lesson[];
}

export const CURRICULUM_DATA: Chapter[] = [
  // ==========================================
  // CHƯƠNG I: SỐ HỮU TỈ
  // ==========================================
  {
    id: 'ch-1',
    code: 'CHƯƠNG I',
    title: 'Số Hữu Tỉ',
    description: 'Tập hợp số hữu tỉ, các phép toán cộng trừ nhân chia, lũy thừa và quy tắc chuyển vế.',
    iconName: 'Divide',
    color: 'emerald',
    lessons: [
      {
        id: 'c1-l1',
        chapterId: 'ch-1',
        number: 1,
        title: 'Tập hợp các số hữu tỉ',
        description: 'Khái niệm số hữu tỉ a/b (b ≠ 0), số đối và biểu diễn trên trục số.',
        status: 'MASTER',
        accuracy: 94,
        totalAttempts: 18,
        correctCount: 17,
        timeSpentMinutes: 35,
        theory: {
          keyPoints: [
            'Số hữu tỉ là số viết được dưới dạng phân số a/b với a, b ∈ ℤ và b ≠ 0.',
            'Tập hợp các số hữu tỉ ký hiệu là ℚ. Tập hợp các số hữu tỉ khác 0 ký hiệu là ℚ*.',
            'Mỗi số hữu tỉ a/b đều có một số đối là -a/b. Hai số đối nhau có tổng bằng 0.',
            'Mọi số nguyên, hỗn số, số thập phân đều là số hữu tỉ.'
          ],
          formulaSummary: [
            'ℚ = { x | x = a/b, a, b ∈ ℤ, b ≠ 0 }',
            'Số đối của a/b là -a/b; a/b + (-a/b) = 0'
          ],
          rules: ['Khi viết số hữu tỉ dạng phân số, luôn đưa mẫu số về số dương.'],
          commonMistakes: ['Nghĩ rằng số 0 không phải là số hữu tỉ (Thực tế: 0 = 0/1 ∈ ℚ).']
        },
        examples: [
          {
            title: 'Ví dụ 1: Tìm số đối của số hữu tỉ',
            problem: 'Tìm số đối của các số: 2,4; 4/(-9); -11/3',
            steps: [
              { stepNumber: 1, instruction: 'Số đối của 2,4', formula: '-2,4' },
              { stepNumber: 2, instruction: 'Chuyển dấu âm lên tử 4/(-9) = -4/9, số đối là', formula: '4/9' },
              { stepNumber: 3, instruction: 'Số đối của -11/3 là', formula: '11/3' }
            ]
          }
        ],
        questions: [
          {
            id: 'q1-1',
            lessonId: 'c1-l1',
            type: 'multiple_choice',
            category: 'Nhận biết',
            difficulty: 'Cơ bản',
            prompt: 'Khẳng định nào sau đây là ĐÚNG về tập hợp các số hữu tỉ?',
            options: [
              '-3 không thuộc tập hợp ℚ',
              'Tất cả các số thập phân hữu hạn đều là số hữu tỉ',
              'Số 0 không phải là số hữu tỉ vì không có mẫu số',
              'Mẫu số b của số hữu tỉ a/b có thể bằng 0'
            ],
            correctAnswer: 'Tất cả các số thập phân hữu hạn đều là số hữu tỉ',
            adminHint: 'Định nghĩa số hữu tỉ là số viết được dưới dạng phân số a/b với a, b ∈ ℤ và b ≠ 0.',
            stepByStepSolution: 'Bước 1: Nhớ lại định nghĩa số hữu tỉ a/b với a, b nguyên, b khác 0.\nBước 2: Mọi số thập phân hữu hạn (như 0,45 = 45/100) đều chuyển được thành phân số thập phân.\nBước 3: Do đó tất cả các số thập phân hữu hạn đều thuộc tập hợp ℚ.',
            explanation: 'Mọi số thập phân hữu hạn đều viết được dưới dạng phân số thập phân nên thuộc tập hợp số hữu tỉ ℚ.',
            pointsXP: 20
          },
          {
            id: 'q1-2',
            lessonId: 'c1-l1',
            type: 'fill_in_blank',
            category: 'Số đối',
            difficulty: 'Cơ bản',
            prompt: 'Viết số đối của phân số (-13)/6 dưới dạng phân số tối giản a/b:',
            correctAnswer: '13/6',
            adminHint: 'Số đối của -x là +x. Hãy bỏ dấu âm ở tử số.',
            stepByStepSolution: 'Bước 1: Phân số đã cho là (-13)/6 = -13/6.\nBước 2: Số đối của -13/6 là -(-13/6) = 13/6.\nBước 3: 13/6 đã là phân số tối giản.',
            explanation: 'Số đối của (-13)/6 là 13/6.',
            pointsXP: 25
          }
        ]
      },
      {
        id: 'c1-l2',
        chapterId: 'ch-1',
        number: 2,
        title: 'Cộng, trừ, nhân, chia số hữu tỉ',
        description: 'Quy tắc cộng trừ cùng mẫu, quy đồng mẫu số, tính chất giao hoán, kết hợp và phân phối.',
        status: 'IN_PROGRESS',
        accuracy: 82,
        totalAttempts: 24,
        correctCount: 20,
        timeSpentMinutes: 48,
        theory: {
          keyPoints: [
            'Cộng, trừ hai số hữu tỉ bằng cách đưa về phân số cùng mẫu dương rồi cộng hoặc trừ tử số.',
            'Nhân hai số hữu tỉ: (a/b) · (c/d) = (a·c)/(b·d).',
            'Chia hai số hữu tỉ: (a/b) : (c/d) = (a/b) · (d/c) với c/d ≠ 0.'
          ],
          formulaSummary: [
            'a/m + b/m = (a + b)/m',
            '(a/b) : (c/d) = (a·d)/(b·c)'
          ],
          rules: ['Đổi hỗn số hoặc số thập phân ra phân số trước khi thực hiện phép nhân, chia.'],
          commonMistakes: ['Chia phân số nhưng lại nhân với phân số giữ nguyên mà không nghịch đảo.']
        },
        examples: [
          {
            title: 'Ví dụ: Tính hợp lý',
            problem: 'Tính: A = 3/7 + (-1/2) + 4/7 - 3/2',
            steps: [
              { stepNumber: 1, instruction: 'Nhóm các số cùng mẫu', formula: '(3/7 + 4/7) + [(-1/2) + (-3/2)]' },
              { stepNumber: 2, instruction: 'Cộng từng nhóm', formula: '7/7 + (-4/2) = 1 + (-2) = -1' }
            ]
          }
        ],
        questions: [
          {
            id: 'q2-1',
            lessonId: 'c1-l2',
            type: 'fill_in_blank',
            category: 'Tính toán',
            difficulty: 'Cơ bản',
            prompt: 'Tính kết quả: 1/3 + 1/4 (nhập phân số a/b):',
            correctAnswer: '7/12',
            adminHint: 'Mẫu chung là 12. Quy đồng: 4/12 + 3/12.',
            stepByStepSolution: 'Bước 1: Tìm mẫu số chung nhỏ nhất của 3 và 4 là 12.\nBước 2: Quy đồng tử: 1/3 = 4/12; 1/4 = 3/12.\nBước 3: Cộng tử số: 4/12 + 3/12 = 7/12.',
            explanation: '1/3 + 1/4 = 4/12 + 3/12 = 7/12.',
            pointsXP: 20
          },
          {
            id: 'q2-2',
            lessonId: 'c1-l2',
            type: 'multiple_choice',
            category: 'Tìm x',
            difficulty: 'Trung bình',
            prompt: 'Tìm x biết: x + 1/3 = 3/4',
            options: ['x = 5/12', 'x = 7/12', 'x = -5/12', 'x = 13/12'],
            correctAnswer: 'x = 5/12',
            adminHint: 'Chuyển vế: x = 3/4 - 1/3 = 9/12 - 4/12.',
            stepByStepSolution: 'Bước 1: Chuyển +1/3 sang vế phải đổi thành -1/3: x = 3/4 - 1/3.\nBước 2: Quy đồng mẫu chung là 12: 3/4 = 9/12 và 1/3 = 4/12.\nBước 3: Trừ hai phân số: x = 9/12 - 4/12 = 5/12.',
            explanation: 'x = 3/4 - 1/3 = 9/12 - 4/12 = 5/12.',
            pointsXP: 25
          }
        ]
      },
      {
        id: 'c1-l3',
        chapterId: 'ch-1',
        number: 3,
        title: 'Lũy thừa với số mũ tự nhiên của một số hữu tỉ',
        description: 'Định nghĩa lũy thừa, tích và thương hai lũy thừa cùng cơ số, lũy thừa của lũy thừa.',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Lũy thừa bậc n của x là tích n thừa số x: xⁿ = x · x · ... · x (n > 1). Quy ước: x¹ = x; x⁰ = 1 (x ≠ 0).',
            'Nhân cùng cơ số: xᵐ · xⁿ = xᵐ⁺ⁿ; Chia cùng cơ số: xᵐ : xⁿ = xᵐ⁻ⁿ (x ≠ 0, m ≥ n).',
            'Lũy thừa của lũy thừa: (xᵐ)ⁿ = xᵐ ˙ ⁿ.'
          ],
          formulaSummary: ['(a/b)ⁿ = aⁿ/bⁿ', 'xᵐ · xⁿ = xᵐ⁺ⁿ', '(xᵐ)ⁿ = xᵐ ˙ ⁿ'],
          rules: ['Lũy thừa mũ chẵn của số âm là dương; lũy thừa mũ lẻ của số âm là âm.'],
          commonMistakes: ['Nhầm (-1/2)² = -1/4 thay vì +1/4.']
        },
        examples: [
          {
            title: 'Ví dụ: Tính lũy thừa',
            problem: 'Tính: (-1/2)³',
            steps: [
              { stepNumber: 1, instruction: 'Áp dụng công thức lũy thừa', formula: '(-1)³ / 2³' },
              { stepNumber: 2, instruction: 'Tính kết quả', formula: '-1 / 8' }
            ]
          }
        ],
        questions: [
          {
            id: 'q3-1',
            lessonId: 'c1-l3',
            type: 'fill_in_blank',
            category: 'Lũy thừa',
            difficulty: 'Cơ bản',
            prompt: 'Tính giá trị của (-1/2)³ (nhập dạng a/b):',
            correctAnswer: '-1/8',
            adminHint: 'Mũ 3 là mũ lẻ nên kết quả âm. 1³=1, 2³=8.',
            stepByStepSolution: 'Bước 1: (-1/2)³ = (-1)³ / 2³.\nBước 2: (-1)³ = -1 và 2³ = 8.\nBước 3: Kết quả là -1/8.',
            explanation: '(-1/2)³ = -1/8.',
            pointsXP: 20
          }
        ]
      },
      {
        id: 'c1-l4',
        chapterId: 'ch-1',
        number: 4,
        title: 'Thứ tự thực hiện phép tính và quy tắc chuyển vế',
        description: 'Thứ tự ngoặc (), [], {}, ưu tiên lũy thừa -> nhân chia -> cộng trừ, đổi dấu khi chuyển vế.',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Không ngoặc: Lũy thừa → Nhân & Chia → Cộng & Trừ.',
            'Có ngoặc: ( ) → [ ] → { }.',
            'Quy tắc chuyển vế: Khi chuyển một số hạng từ vế này sang vế kia, ta phải đổi dấu: dấu "+" đổi thành "-", dấu "-" đổi thành "+".'
          ],
          formulaSummary: ['A + B = C ⇔ A = C - B', 'A - B = C ⇔ A = C + B'],
          rules: ['Luôn kiểm tra dấu đằng trước số hạng khi chuyển vế.'],
          commonMistakes: ['Chuyển vế nhưng giữ nguyên dấu cũ.']
        },
        examples: [
          {
            title: 'Ví dụ: Tìm x',
            problem: 'Tìm x biết: x - 1/2 = 3/4',
            steps: [
              { stepNumber: 1, instruction: 'Chuyển -1/2 sang vế phải thành +1/2', formula: 'x = 3/4 + 1/2' },
              { stepNumber: 2, instruction: 'Quy đồng và cộng', formula: 'x = 3/4 + 2/4 = 5/4' }
            ]
          }
        ],
        questions: [
          {
            id: 'q4-1',
            lessonId: 'c1-l4',
            type: 'fill_in_blank',
            category: 'Tìm x',
            difficulty: 'Trung bình',
            prompt: 'Tìm x biết: x - 1/2 = 3/4 (nhập phân số a/b):',
            correctAnswer: '5/4',
            adminHint: 'Chuyển -1/2 sang vế phải đổi thành +1/2. 3/4 + 2/4 = 5/4.',
            stepByStepSolution: 'Bước 1: Chuyển vế số hạng -1/2 sang vế phải đổi dấu thành +1/2: x = 3/4 + 1/2.\nBước 2: Quy đồng mẫu 4: 1/2 = 2/4.\nBước 3: x = 3/4 + 2/4 = 5/4.',
            explanation: 'x = 3/4 + 1/2 = 5/4.',
            pointsXP: 25
          }
        ]
      }
    ]
  },

  // ==========================================
  // CHƯƠNG II: SỐ THỰC
  // ==========================================
  {
    id: 'ch-2',
    code: 'CHƯƠNG II',
    title: 'Số Thực',
    description: 'Số thập phân vô hạn tuần hoàn, số vô tỉ, căn bậc hai số học và giá trị tuyệt đối.',
    iconName: 'Sparkles',
    color: 'indigo',
    lessons: [
      {
        id: 'c2-l1',
        chapterId: 'ch-2',
        number: 5,
        title: 'Làm quen với số thập phân vô hạn tuần hoàn',
        description: 'Phân số sang số thập phân hữu hạn/tuần hoàn, chu kỳ trong ngoặc và quy tắc làm tròn số.',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Số thập phân hữu hạn: Phân số tối giản có mẫu chỉ chứa ước nguyên tố 2 và 5 (VD: 12/5 = 2,4).',
            'Số thập phân vô hạn tuần hoàn: Phân số tối giản có mẫu chứa ước nguyên tố khác 2 và 5 (VD: 5/3 = 1,(6)).',
            'Làm tròn số thập phân căn cứ vào độ chính xác cho trước.'
          ],
          formulaSummary: ['5/3 = 1,(6) (chu kỳ 6)', '7/33 = 0,(21) (chu kỳ 21)'],
          rules: ['Đặt chu kỳ lặp lại trong dấu ngoặc đơn.'],
          commonMistakes: ['Nhầm số thập phân vô hạn tuần hoàn thành số vô tỉ (tuần hoàn vẫn là số hữu tỉ ℚ).']
        },
        examples: [
          {
            title: 'Ví dụ: Viết gọn số thập phân tuần hoàn',
            problem: 'Viết số 0,363636... dưới dạng thu gọn',
            steps: [
              { stepNumber: 1, instruction: 'Xác định chu kỳ lặp lại', formula: 'Chu kỳ là 36' },
              { stepNumber: 2, instruction: 'Viết dạng thu gọn', formula: '0,(36)' }
            ]
          }
        ],
        questions: [
          {
            id: 'q5-1',
            lessonId: 'c2-l1',
            type: 'multiple_choice',
            category: 'Nhận biết',
            difficulty: 'Cơ bản',
            prompt: 'Số thập phân 2,212121... được viết thu gọn với chu kỳ trong dấu ngoặc là:',
            options: ['2,(21)', '2,2(1)', '2,(12)', '2,21(2)'],
            correctAnswer: '2,(21)',
            adminHint: 'Nhóm chữ số 21 lặp lại liên tục sau dấu phẩy nên chu kỳ là (21).',
            stepByStepSolution: 'Bước 1: Quan sát phần thập phân sau dấu phẩy: 21, 21, 21...\nBước 2: Nhóm số 21 lặp lại tuần hoàn.\nBước 3: Viết chu kỳ trong dấu ngoặc đơn: 2,(21).',
            explanation: 'Số thập phân tuần hoàn 2,212121... viết gọn là 2,(21).',
            pointsXP: 20
          }
        ]
      },
      {
        id: 'c2-l2',
        chapterId: 'ch-2',
        number: 6,
        title: 'Số vô tỉ và căn bậc hai số học',
        description: 'Số vô tỉ không tuần hoàn (như π, √2), định nghĩa √a = x với x ≥ 0 và x² = a.',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Số vô tỉ là số thập phân vô hạn không tuần hoàn, tập hợp ký hiệu 𝕀.',
            'Căn bậc hai số học của a ≥ 0 là số x ≥ 0 sao cho x² = a. Ký hiệu là √a.',
            'Không tồn tại căn bậc hai số học của số âm.'
          ],
          formulaSummary: ['√a = x ⇔ x ≥ 0 và x² = a'],
          rules: ['Căn bậc hai số học luôn trả về giá trị không âm.'],
          commonMistakes: ['Nghĩ rằng √16 = ±4 (Sai: căn bậc hai số học chỉ là số dương 4).']
        },
        examples: [
          {
            title: 'Ví dụ: Tính căn bậc hai',
            problem: 'Tính: √144',
            steps: [
              { stepNumber: 1, instruction: 'Tìm số không âm có bình phương bằng 144', formula: '12² = 144 và 12 ≥ 0' },
              { stepNumber: 2, instruction: 'Kết luận', formula: '√144 = 12' }
            ]
          }
        ],
        questions: [
          {
            id: 'q6-1',
            lessonId: 'c2-l2',
            type: 'fill_in_blank',
            category: 'Căn bậc hai',
            difficulty: 'Cơ bản',
            prompt: 'Tính giá trị của căn bậc hai số học: √144. Nhập giá trị số:',
            correctAnswer: '12',
            adminHint: 'Tìm số dương bình phương bằng 144: 12² = 144.',
            stepByStepSolution: 'Bước 1: Tìm số x ≥ 0 sao cho x² = 144.\nBước 2: Ta có 12² = 144 và 12 ≥ 0.\nBước 3: Vậy √144 = 12.',
            explanation: 'Vì 12 ≥ 0 và 12² = 144 nên √144 = 12.',
            pointsXP: 20
          }
        ]
      },
      {
        id: 'c2-l3',
        chapterId: 'ch-2',
        number: 7,
        title: 'Tập hợp các số thực và giá trị tuyệt đối',
        description: 'Tập ℝ = ℚ ∪ 𝕀, trục số thực, khái niệm khoảng cách và |x|.',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Tập hợp số thực ℝ gồm cả số hữu tỉ và số vô tỉ: ℝ = ℚ ∪ 𝕀.',
            'Giá trị tuyệt đối |x| là khoảng cách từ điểm x đến gốc 0 trên trục số.',
            '|x| = x nếu x ≥ 0; |x| = -x nếu x < 0. |x| luôn ≥ 0.'
          ],
          formulaSummary: ['|x| = a (a ≥ 0) ⇔ x = a hoặc x = -a'],
          rules: ['Phương trình |x| = -k (k > 0) luôn vô nghiệm vì |x| ≥ 0.'],
          commonMistakes: ['Quên xét trường hợp âm khi giải phương trình |x| = a.']
        },
        examples: [
          {
            title: 'Ví dụ: Tìm x trong giá trị tuyệt đối',
            problem: 'Tìm x biết: |x - 2/5| = 1',
            steps: [
              { stepNumber: 1, instruction: 'TH1: x - 2/5 = 1', formula: 'x = 1 + 2/5 = 7/5' },
              { stepNumber: 2, instruction: 'TH2: x - 2/5 = -1', formula: 'x = -1 + 2/5 = -3/5' }
            ]
          }
        ],
        questions: [
          {
            id: 'q7-1',
            lessonId: 'c2-l3',
            type: 'multiple_choice',
            category: 'Giá trị tuyệt đối',
            difficulty: 'Cơ bản',
            prompt: 'Giá trị của |-3,26| là:',
            options: ['3,26', '-3,26', '0', '±3,26'],
            correctAnswer: '3,26',
            adminHint: 'Khoảng cách trên trục số luôn không âm: |-a| = a.',
            stepByStepSolution: 'Bước 1: Theo định nghĩa, giá trị tuyệt đối là khoảng cách từ điểm -3,26 đến điểm 0.\nBước 2: Khoảng cách là 3,26 đơn vị (luôn ≥ 0).\nBước 3: Vậy |-3,26| = 3,26.',
            explanation: 'Khoảng cách từ -3,26 đến 0 là 3,26 nên |-3,26| = 3,26.',
            pointsXP: 20
          }
        ]
      }
    ]
  },

  // ==========================================
  // CHƯƠNG III: GÓC VÀ ĐƯỜNG THẲNG SONG SONG
  // ==========================================
  {
    id: 'ch-3',
    code: 'CHƯƠNG III',
    title: 'Góc và Đường Thẳng Song Song',
    description: 'Góc kề bù, đối đỉnh, tia phân giác, góc so le trong, đồng vị, tiên đề Euclid và định lý.',
    iconName: 'Compass',
    color: 'amber',
    lessons: [
      {
        id: 'c3-l1',
        chapterId: 'ch-3',
        number: 8,
        title: 'Góc ở vị trí đặc biệt và tia phân giác',
        description: 'Hai góc kề bù (tổng 180°), hai góc đối đỉnh (bằng nhau), tia phân giác chia đôi góc.',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Hai góc kề bù có chung một cạnh, hai cạnh còn lại là hai tia đối nhau. Tổng số đo hai góc kề bù là 180°.',
            'Hai góc đối đỉnh thì bằng nhau.',
            'Tia phân giác của một góc là tia nằm giữa hai cạnh và tạo với hai cạnh ấy hai góc bằng nhau.'
          ],
          formulaSummary: ['∠xOy + ∠yOz = 180°', '∠xOy = ∠mOn (đối đỉnh)'],
          rules: ['Góc tạo bởi hai tia phân giác của hai góc kề bù là góc vuông 90°.'],
          commonMistakes: ['Nhầm hai góc có tổng bằng 180° bất kỳ là kề bù.']
        },
        examples: [
          {
            title: 'Ví dụ: Tính góc kề bù',
            problem: 'Cho hai góc kề bù xOy và yOz, biết yOz = 100°. Tính xOy.',
            steps: [
              { stepNumber: 1, instruction: 'Tổng hai góc kề bù bằng 180°', formula: '∠xOy + 100° = 180°' },
              { stepNumber: 2, instruction: 'Tính ∠xOy', formula: '∠xOy = 180° - 100° = 80°' }
            ]
          }
        ],
        questions: [
          {
            id: 'q8-1',
            lessonId: 'c3-l1',
            type: 'fill_in_blank',
            category: 'Góc đối đỉnh',
            difficulty: 'Cơ bản',
            prompt: 'Hai đường thẳng cắt nhau tạo thành một góc có số đo 44°. Số đo góc đối đỉnh với nó là bao nhiêu độ (nhập số nguyên)?',
            correctAnswer: '44',
            adminHint: 'Tính chất: Hai góc đối đỉnh luôn có số đo bằng nhau.',
            stepByStepSolution: 'Bước 1: Nhớ lại tính chất hai góc đối đỉnh.\nBước 2: Hai góc đối đỉnh thì bằng nhau.\nBước 3: Góc đã cho là 44° nên góc đối đỉnh với nó cũng là 44°.',
            explanation: 'Hai góc đối đỉnh thì bằng nhau, do đó số đo là 44°.',
            pointsXP: 20
          }
        ]
      },
      {
        id: 'c3-l2',
        chapterId: 'ch-3',
        number: 9,
        title: 'Hai đường thẳng song song và dấu hiệu nhận biết',
        description: 'Cặp góc so le trong bằng nhau, cặp góc đồng vị bằng nhau, trong cùng phía bù nhau.',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Đường thẳng c cắt a và b tạo ra các góc so le trong, đồng vị, trong cùng phía.',
            'Dấu hiệu: Nếu tạo thành 1 cặp góc so le trong bằng nhau (hoặc đồng vị bằng nhau) thì a // b.'
          ],
          formulaSummary: ['∠A₁ = ∠B₁ (so le trong) ⟹ a // b'],
          rules: ['Khi a // b: Các cặp góc so le trong bằng nhau, đồng vị bằng nhau, trong cùng phía bù nhau.'],
          commonMistakes: ['Xác định sai góc đồng vị và so le trong.']
        },
        examples: [
          {
            title: 'Ví dụ: Nhận biết song song',
            problem: 'Đường thẳng c cắt a và b có 1 cặp góc đồng vị cùng bằng 60°. Hỏi a và b có song song không?',
            steps: [
              { stepNumber: 1, instruction: 'Xét cặp góc đồng vị', formula: 'Cùng bằng 60°' },
              { stepNumber: 2, instruction: 'Kết luận theo dấu hiệu', formula: 'a // b' }
            ]
          }
        ],
        questions: [
          {
            id: 'q9-1',
            lessonId: 'c3-l2',
            type: 'multiple_choice',
            category: 'Góc song song',
            difficulty: 'Cơ bản',
            prompt: 'Nếu a // b và một góc so le trong bằng 72° thì góc so le trong còn lại bằng:',
            options: ['72°', '108°', '18°', '90°'],
            correctAnswer: '72°',
            adminHint: 'Khi hai đường thẳng song song, các cặp góc so le trong luôn bằng nhau.',
            stepByStepSolution: 'Bước 1: Áp dụng tính chất của hai đường thẳng song song.\nBước 2: Hai đường thẳng song song thì hai góc so le trong bằng nhau.\nBước 3: Góc thứ nhất bằng 72° nên góc còn lại cũng bằng 72°.',
            explanation: 'Hai góc so le trong của hai đường thẳng song song luôn bằng nhau (72°).',
            pointsXP: 20
          }
        ]
      },
      {
        id: 'c3-l3',
        chapterId: 'ch-3',
        number: 10,
        title: 'Tiên đề Euclid. Tính chất của hai đường thẳng song song',
        description: 'Tiên đề Euclid về đường thẳng song song duy nhất, tính chất từ vuông góc đến song song (PDF trang 57-63).',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Tiên đề Euclid: Qua một điểm ở ngoài một đường thẳng, chỉ có MỘT đường thẳng song song với đường thẳng đó.',
            'Tính chất 1: Nếu một đường thẳng vuông góc với một trong hai đường thẳng song song thì nó cũng vuông góc với đường thẳng kia: a // b và c ⊥ a ⟹ c ⊥ b.',
            'Tính chất 2: Hai đường thẳng phân biệt cùng song song với một đường thẳng thứ ba thì chúng song song với nhau: a // c và b // c ⟹ a // b.'
          ],
          formulaSummary: [
            'Qua M ∉ a, tồn tại duy nhất đường thẳng b // a',
            'a // b, c ⊥ a ⟹ c ⊥ b',
            'a // c, b // c ⟹ a // b'
          ],
          rules: ['Ứng dụng tiên đề Euclid để chứng minh 3 điểm thẳng hàng: Nếu qua A có AB // d và AC // d thì A, B, C thẳng hàng.'],
          commonMistakes: ['Nghĩ rằng có thể kẻ được nhiều đường thẳng song song qua cùng một điểm ngoài đường thẳng.']
        },
        examples: [
          {
            title: 'Ví dụ 1 (PDF trang 57): Chứng minh thẳng hàng',
            problem: 'Cho điểm A nằm ngoài đường thẳng n. Biết đường thẳng AD // n và AC // n. Chứng minh ba điểm D, A, C thẳng hàng.',
            steps: [
              { stepNumber: 1, instruction: 'Xét vị trí điểm A đối với đường thẳng n', formula: 'A nằm ngoài đường thẳng n' },
              { stepNumber: 2, instruction: 'Áp dụng Tiên đề Euclid', formula: 'Qua A chỉ có duy nhất 1 đường thẳng song song với n' },
              { stepNumber: 3, instruction: 'Kết luận sự trùng nhau', formula: 'Đường thẳng AD và AC trùng nhau ⟹ D, A, C thẳng hàng' }
            ]
          }
        ],
        questions: [
          {
            id: 'q10-1',
            lessonId: 'c3-l3',
            type: 'multiple_choice',
            category: 'Tiên đề Euclid',
            difficulty: 'Cơ bản',
            prompt: 'Theo tiên đề Euclid, qua một điểm nằm ngoài một đường thẳng cho trước, ta vẽ được bao nhiêu đường thẳng song song với đường thẳng đó?',
            options: ['Duy nhất 1 đường thẳng', 'Vô số đường thẳng', '2 đường thẳng', 'Không vẽ được đường nào'],
            correctAnswer: 'Duy nhất 1 đường thẳng',
            adminHint: 'Nội dung tiên đề Euclid khẳng định tính duy nhất của đường thẳng song song qua 1 điểm ngoài đường thẳng.',
            stepByStepSolution: 'Bước 1: Nhớ lại phát biểu tiên đề Euclid.\nBước 2: Qua một điểm ở ngoài một đường thẳng, chỉ có MỘT đường thẳng song song với đường thẳng đó.\nBước 3: Chọn đáp án "Duy nhất 1 đường thẳng".',
            explanation: 'Tiên đề Euclid khẳng định chỉ có duy nhất 1 đường thẳng song song đi qua điểm đó.',
            pointsXP: 20
          },
          {
            id: 'q10-2',
            lessonId: 'c3-l3',
            type: 'multiple_choice',
            category: 'Từ vuông góc đến song song',
            difficulty: 'Trung bình',
            prompt: 'Cho a // b. Nếu đường thẳng c vuông góc với đường thẳng a tại A thì khẳng định nào sau đây là ĐÚNG?',
            options: ['c vuông góc với b', 'c song song với b', 'c trùng với b', 'c không cắt b'],
            correctAnswer: 'c vuông góc với b',
            adminHint: 'Một đường thẳng vuông góc với một trong hai đường thẳng song song thì cũng vuông góc với đường thẳng kia.',
            stepByStepSolution: 'Bước 1: Ta có a // b.\nBước 2: Đường thẳng c vuông góc với a (c ⊥ a).\nBước 3: Theo tính chất liên hệ giữa vuông góc và song song: c ⊥ b.',
            explanation: 'Một đường thẳng vuông góc với một trong hai đường thẳng song song thì nó cũng vuông góc với đường thẳng còn lại.',
            pointsXP: 25
          }
        ]
      },
      {
        id: 'c3-l4',
        chapterId: 'ch-3',
        number: 11,
        title: 'Định lí và chứng minh định lí',
        description: 'Khái niệm định lý, cấu trúc Giả thiết (GT) và Kết luận (KL), phương pháp lập luận chứng minh (PDF trang 64).',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Định lí là một khẳng định được suy ra từ những khẳng định đúng đã biết. Mỗi định lí phát biểu dưới dạng: "Nếu ...(1)... thì ...(2)...".',
            'Phần sau chữ "Nếu" và trước chữ "thì" là GIẢ THIẾT (GT).',
            'Phần sau chữ "thì" là KẾT LUẬN (KL).',
            'Chứng minh định lí là dùng lập luận suy diễn từ giả thiết và các kiến thức đã biết để suy ra kết luận.'
          ],
          formulaSummary: [
            'Cấu trúc: Nếu P thì Q',
            'GT: Điều đã cho (P) | KL: Điều cần chứng minh (Q)'
          ],
          rules: ['Khi viết giả thiết và kết luận, dùng ký hiệu toán học ngắn gọn.'],
          commonMistakes: ['Đảo ngược vị trí giữa giả thiết và kết luận.']
        },
        examples: [
          {
            title: 'Ví dụ (PDF trang 64): Viết GT và KL',
            problem: 'Viết GT và KL của định lí: "Góc tạo bởi hai tia phân giác của hai góc kề bù là một góc vuông".',
            steps: [
              { stepNumber: 1, instruction: 'Xác định giả thiết GT', formula: 'xOy và yOz kề bù; Om là phân giác xOy; On là phân giác yOz' },
              { stepNumber: 2, instruction: 'Xác định kết luận KL', formula: '∠mOn = 90°' }
            ]
          }
        ],
        questions: [
          {
            id: 'q11-1',
            lessonId: 'c3-l4',
            type: 'multiple_choice',
            category: 'Giả thiết và kết luận',
            difficulty: 'Cơ bản',
            prompt: 'Trong định lí: "Nếu hai đường thẳng phân biệt cùng vuông góc với đường thẳng thứ ba thì chúng song song với nhau", Kết luận (KL) là:',
            options: [
              'Hai đường thẳng đó song song với nhau',
              'Hai đường thẳng phân biệt',
              'Cùng vuông góc với đường thẳng thứ ba',
              'Đường thẳng thứ ba cắt hai đường thẳng'
            ],
            correctAnswer: 'Hai đường thẳng đó song song với nhau',
            adminHint: 'Kết luận là mệnh đề đứng sau chữ "thì".',
            stepByStepSolution: 'Bước 1: Xác định cấu trúc "Nếu [GT] thì [KL]".\nBước 2: Mệnh đề sau chữ "Nếu" là GT: "hai đường thẳng phân biệt cùng vuông góc với đường thẳng thứ ba".\nBước 3: Mệnh đề sau chữ "thì" là KL: "chúng song song với nhau".',
            explanation: 'Phần kết luận của định lý là mệnh đề đứng sau từ "thì": "hai đường thẳng đó song song với nhau".',
            pointsXP: 20
          }
        ]
      }
    ]
  },

  // ==========================================
  // CHƯƠNG IV: TAM GIÁC BẰNG NHAU
  // ==========================================
  {
    id: 'ch-4',
    code: 'CHƯƠNG IV',
    title: 'Tam Giác Bằng Nhau',
    description: 'Tổng 3 góc tam giác (180°), các trường hợp bằng nhau c-c-c, c-g-c, g-c-g, tam giác vuông và tam giác cân.',
    iconName: 'Triangle',
    color: 'rose',
    lessons: [
      {
        id: 'c4-l1',
        chapterId: 'ch-4',
        number: 12,
        title: 'Tổng các góc trong một tam giác',
        description: 'Tổng ba góc của một tam giác bằng 180°, góc ngoài bằng tổng hai góc trong không kề nó.',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Tổng ba góc của một tam giác bằng 180°: Trong ΔABC, ∠A + ∠B + ∠C = 180°.',
            'Trong tam giác vuông, hai góc nhọn phụ nhau: ∠B + ∠C = 90°.',
            'Góc ngoài của tam giác là góc kề bù với 1 góc của tam giác. Góc ngoài bằng tổng 2 góc trong không kề với nó.'
          ],
          formulaSummary: ['∠A + ∠B + ∠C = 180°', '∠ACD_ngoài = ∠A + ∠B'],
          rules: ['Tam giác có 3 góc nhọn là tam giác nhọn, có 1 góc vuông là tam giác vuông, có 1 góc tù là tam giác tù.'],
          commonMistakes: ['Quên tính chất góc ngoài của tam giác.']
        },
        examples: [
          {
            title: 'Ví dụ: Tính góc trong tam giác',
            problem: 'Cho ΔABC có ∠A = 40°, ∠B = 70°. Tính ∠C.',
            steps: [
              { stepNumber: 1, instruction: 'Tổng 3 góc bằng 180°', formula: '∠C = 180° - (∠A + ∠B)' },
              { stepNumber: 2, instruction: 'Tính kết quả', formula: '180° - (40° + 70°) = 70°' }
            ]
          }
        ],
        questions: [
          {
            id: 'q12-1',
            lessonId: 'c4-l1',
            type: 'fill_in_blank',
            category: 'Góc tam giác',
            difficulty: 'Cơ bản',
            prompt: 'Cho tam giác ABC có ∠A = 40°, ∠B = 70°. Tính số đo góc C (nhập số nguyên độ):',
            correctAnswer: '70',
            adminHint: 'Tổng ba góc trong tam giác bằng 180°. ∠C = 180° - (40° + 70°).',
            stepByStepSolution: 'Bước 1: Trong ΔABC có ∠A + ∠B + ∠C = 180°.\nBước 2: Thay số: 40° + 70° + ∠C = 180°.\nBước 3: ∠C = 180° - 110° = 70°.',
            explanation: 'Số đo góc C là 70°.',
            pointsXP: 20
          }
        ]
      },
      {
        id: 'c4-l2',
        chapterId: 'ch-4',
        number: 13,
        title: 'Hai tam giác bằng nhau. Trường hợp thứ nhất (c-c-c)',
        description: 'Định nghĩa 2 tam giác bằng nhau, viết đúng thứ tự đỉnh tương ứng, trường hợp cạnh - cạnh - cạnh (PDF trang 71-76).',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Hai tam giác bằng nhau là hai tam giác có các cạnh tương ứng bằng nhau và các góc tương ứng bằng nhau.',
            'Khi ký hiệu hai tam giác bằng nhau, thứ tự các đỉnh tương ứng phải được viết theo cùng một thứ tự: ΔABC = ΔMNQ.',
            'Trường hợp bằng nhau thứ nhất (cạnh - cạnh - cạnh: c.c.c): Nếu ba cạnh của tam giác này bằng ba cạnh của tam giác kia thì hai tam giác đó bằng nhau.'
          ],
          formulaSummary: [
            'ΔABC = ΔMNQ ⇔ AB=MN, BC=NQ, AC=MQ và ∠A=∠M, ∠B=∠N, ∠C=∠Q',
            'AB=A\'B\', BC=B\'C\', AC=A\'C\' ⟹ ΔABC = ΔA\'B\'C\' (c.c.c)'
          ],
          rules: ['Luôn kiểm tra thứ tự đỉnh: A tương ứng M, B tương ứng N, C tương ứng Q.'],
          commonMistakes: ['Viết sai thứ tự đỉnh tương ứng (ví dụ: viết ΔABC = ΔNMQ khi A tương ứng M).']
        },
        examples: [
          {
            title: 'Ví dụ (PDF trang 71): Các cạnh tương ứng',
            problem: 'Cho ΔABC = ΔHIK, trong đó AB = 2cm, ∠B = 40°, BC = 4cm. Suy ra số đo của HI, HK và góc I của ΔHIK.',
            steps: [
              { stepNumber: 1, instruction: 'Xác định các cặp tương ứng', formula: 'HI tương ứng AB; IK tương ứng BC; ∠I tương ứng ∠B' },
              { stepNumber: 2, instruction: 'Suy ra độ dài và góc', formula: 'HI = 2cm; IK = 4cm; ∠I = 40°' }
            ]
          }
        ],
        questions: [
          {
            id: 'q13-1',
            lessonId: 'c4-l2',
            type: 'multiple_choice',
            category: 'Đỉnh tương ứng',
            difficulty: 'Cơ bản',
            prompt: 'Biết ΔABC = ΔDEF. Cặp cạnh tương ứng nào sau đây là ĐÚNG?',
            options: ['AB = DE', 'AC = EF', 'BC = DF', 'AB = EF'],
            correctAnswer: 'AB = DE',
            adminHint: 'Thứ tự đỉnh: A tương ứng D, B tương ứng E, C tương ứng F.',
            stepByStepSolution: 'Bước 1: Từ ký hiệu ΔABC = ΔDEF, ta có các cặp đỉnh tương ứng: A-D, B-E, C-F.\nBước 2: Cạnh AB gồm đỉnh thứ 1 và 2 tương ứng với cạnh DE gồm đỉnh thứ 1 và 2.\nBước 3: Do đó AB = DE là khẳng định đúng.',
            explanation: 'Theo thứ tự đỉnh tương ứng, AB = DE.',
            pointsXP: 20
          },
          {
            id: 'q13-2',
            lessonId: 'c4-l2',
            type: 'fill_in_blank',
            category: 'Chu vi tam giác',
            difficulty: 'Trung bình',
            prompt: 'Cho ΔABC = ΔDEF. Biết AB = 4cm, BC = 6cm, DF = 5cm. Chu vi của tam giác ABC là bao nhiêu cm (nhập số nguyên)?',
            correctAnswer: '15',
            adminHint: 'Vì ΔABC = ΔDEF nên AC = DF = 5cm. Chu vi = 4 + 6 + 5.',
            stepByStepSolution: 'Bước 1: Hai tam giác bằng nhau thì các cạnh tương ứng bằng nhau: AC = DF = 5 cm.\nBước 2: Chu vi tam giác ABC là tổng 3 cạnh: P = AB + BC + AC.\nBước 3: P = 4 + 6 + 5 = 15 cm.',
            explanation: 'Chu vi ΔABC là 15 cm.',
            pointsXP: 25
          }
        ]
      },
      {
        id: 'c4-l3',
        chapterId: 'ch-4',
        number: 14,
        title: 'Trường hợp bằng nhau thứ hai (c-g-c) và thứ ba (g-c-g)',
        description: 'Trường hợp cạnh - góc xen giữa - cạnh và góc - cạnh xen giữa - góc của hai tam giác (PDF trang 77-95).',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Trường hợp c.g.c: Nếu hai cạnh và góc XEN GIỮA của tam giác này bằng hai cạnh và góc xen giữa của tam giác kia thì hai tam giác đó bằng nhau.',
            'Trường hợp g.c.g: Nếu một cạnh và hai góc KỀ của tam giác này bằng một cạnh và hai góc kề của tam giác kia thì hai tam giác đó bằng nhau.'
          ],
          formulaSummary: [
            'AB=A\'B\', ∠B=∠B\', BC=B\'C\' ⟹ ΔABC = ΔA\'B\'C\' (c.g.c)',
            '∠B=∠B\', BC=B\'C\', ∠C=∠C\' ⟹ ΔABC = ΔA\'B\'C\' (g.c.g)'
          ],
          rules: ['Góc phải là góc xen giữa hai cạnh (tạo bởi hai cạnh đó).'],
          commonMistakes: ['Dùng góc không xen giữa mà vẫn kết luận bằng nhau theo c-g-c.']
        },
        examples: [
          {
            title: 'Ví dụ (PDF trang 77): Góc xen giữa',
            problem: 'Trong tam giác ABC, góc xen giữa hai cạnh AB và AC là góc nào?',
            steps: [
              { stepNumber: 1, instruction: 'Xác định đỉnh chung của hai cạnh AB và AC', formula: 'Đỉnh chung là A' },
              { stepNumber: 2, instruction: 'Kết luận góc xen giữa', formula: 'Góc A (hay ∠BAC)' }
            ]
          }
        ],
        questions: [
          {
            id: 'q14-1',
            lessonId: 'c4-l3',
            type: 'multiple_choice',
            category: 'Góc xen giữa',
            difficulty: 'Cơ bản',
            prompt: 'Để ΔABC = ΔMNP theo trường hợp cạnh - góc - cạnh (c.g.c), khi đã có AB = MN và BC = NP thì cần thêm điều kiện nào?',
            options: ['∠B = ∠N', '∠A = ∠M', '∠C = ∠P', 'AC = MP'],
            correctAnswer: '∠B = ∠N',
            adminHint: 'Góc xen giữa hai cạnh AB và BC là góc B. Góc xen giữa MN và NP là góc N.',
            stepByStepSolution: 'Bước 1: Góc xen giữa hai cạnh AB và BC chính là góc B.\nBước 2: Góc xen giữa hai cạnh MN và NP chính là góc N.\nBước 3: Do đó để áp dụng trường hợp c.g.c cần có ∠B = ∠N.',
            explanation: 'Điều kiện cần thêm là góc xen giữa hai cạnh: ∠B = ∠N.',
            pointsXP: 20
          }
        ]
      },
      {
        id: 'c4-l4',
        chapterId: 'ch-4',
        number: 15,
        title: 'Các trường hợp bằng nhau của tam giác vuông',
        description: 'Ba trường hợp suy ra từ tam giác thường và trường hợp đặc biệt: Cạnh huyền - góc nhọn, Cạnh huyền - cạnh góc vuông (PDF trang 96-102).',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            '1. Hai cạnh góc vuông (c.g.c): Hai cạnh góc vuông của tam giác vuông này bằng hai cạnh góc vuông của tam giác vuông kia.',
            '2. Cạnh góc vuông - góc nhọn kề (g.c.g).',
            '3. Cạnh huyền - góc nhọn: Cạnh huyền và một góc nhọn của tam giác vuông này bằng cạnh huyền và một góc nhọn của tam giác vuông kia.',
            '4. Cạnh huyền - cạnh góc vuông: Cạnh huyền và một cạnh góc vuông của tam giác vuông này bằng cạnh huyền và một cạnh góc vuông của tam giác vuông kia.'
          ],
          formulaSummary: [
            'Hai cạnh góc vuông ⟹ ΔABC = ΔDEF',
            'Cạnh huyền - góc nhọn ⟹ ΔABC = ΔHIK',
            'Cạnh huyền - cạnh góc vuông ⟹ ΔABC = ΔMNQ'
          ],
          rules: ['Khi xét hai tam giác vuông, chỉ cần chỉ ra 2 yếu tố tương ứng (vì đã có sẵn góc vuông 90°).'],
          commonMistakes: ['Quên ghi rõ điều kiện góc vuông khi chứng minh.']
        },
        examples: [
          {
            title: 'Ví dụ (PDF trang 96): Cạnh huyền - góc nhọn',
            problem: 'Cho ΔABC vuông tại A và ΔHIK vuông tại H có BC = IK và ∠B = ∠I. Kết luận gì về hai tam giác này?',
            steps: [
              { stepNumber: 1, instruction: 'Xác định cạnh huyền', formula: 'BC và IK là hai cạnh huyền, BC = IK' },
              { stepNumber: 2, instruction: 'Xác định góc nhọn', formula: '∠B = ∠I là hai góc nhọn tương ứng' },
              { stepNumber: 3, instruction: 'Kết luận', formula: 'ΔABC = ΔHIK (cạnh huyền - góc nhọn)' }
            ]
          }
        ],
        questions: [
          {
            id: 'q15-1',
            lessonId: 'c4-l4',
            type: 'multiple_choice',
            category: 'Tam giác vuông',
            difficulty: 'Cơ bản',
            prompt: 'Trường hợp bằng nhau ĐẶC BIỆT của hai tam giác vuông là:',
            options: [
              'Cạnh huyền - cạnh góc vuông',
              'Hai góc nhọn bằng nhau',
              'Một cạnh góc vuông bằng nhau',
              'Góc vuông - góc nhọn'
            ],
            correctAnswer: 'Cạnh huyền - cạnh góc vuông',
            adminHint: 'Trường hợp đặc biệt chỉ riêng tam giác vuông có là cạnh huyền - cạnh góc vuông.',
            stepByStepSolution: 'Bước 1: Tam giác thường cần 3 yếu tố.\nBước 2: Tam giác vuông có trường hợp đặc biệt không áp dụng cho tam giác thường: Cạnh huyền - cạnh góc vuông.\nBước 3: Chọn đáp án A.',
            explanation: 'Trường hợp đặc biệt của tam giác vuông là Cạnh huyền - Cạnh góc vuông.',
            pointsXP: 20
          }
        ]
      },
      {
        id: 'c4-l5',
        chapterId: 'ch-4',
        number: 16,
        title: 'Tam giác cân. Đường trung trực của đoạn thẳng',
        description: 'Định nghĩa tam giác cân, tính chất hai góc ở đáy bằng nhau, tam giác đều và đường trung trực (PDF trang 103-119).',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Tam giác cân là tam giác có hai cạnh bằng nhau: AB = AC ⟹ ΔABC cân tại A.',
            'Tính chất: Trong tam giác cân, hai góc ở đáy bằng nhau (∠B = ∠C). Ngược lại, tam giác có hai góc bằng nhau là tam giác cân.',
            'Tam giác đều có ba cạnh bằng nhau, ba góc bằng nhau và mỗi góc bằng 60°.',
            'Đường trung trực của đoạn thẳng là đường thẳng vuông góc với đoạn thẳng tại trung điểm của nó. Điểm nằm trên đường trung trực thì cách đều hai đầu mút.'
          ],
          formulaSummary: [
            'ΔABC cân tại A ⇔ AB = AC ⇔ ∠B = ∠C',
            '∠B = ∠C = (180° - ∠A) / 2',
            'M ∈ d (trung trực AB) ⇔ MA = MB'
          ],
          rules: ['Tam giác cân có 1 góc bằng 60° thì là tam giác đều.'],
          commonMistakes: ['Tính nhầm góc đáy tam giác cân khi biết góc ở đỉnh.']
        },
        examples: [
          {
            title: 'Ví dụ (PDF trang 103): Tính góc đáy tam giác cân',
            problem: 'Cho ΔABC cân tại A có góc A = 80°. Tính số đo góc B và góc C.',
            steps: [
              { stepNumber: 1, instruction: 'Áp dụng tính chất tam giác cân', formula: '∠B = ∠C' },
              { stepNumber: 2, instruction: 'Tổng 3 góc bằng 180°', formula: '∠B + ∠C = 180° - 80° = 100°' },
              { stepNumber: 3, instruction: 'Tính góc đáy', formula: '∠B = ∠C = 100° / 2 = 50°' }
            ]
          }
        ],
        questions: [
          {
            id: 'q16-1',
            lessonId: 'c4-l5',
            type: 'fill_in_blank',
            category: 'Tam giác cân',
            difficulty: 'Cơ bản',
            prompt: 'Cho tam giác ABC cân tại A có số đo góc ở đỉnh ∠A = 50°. Số đo của góc ở đáy ∠B là bao nhiêu độ (nhập số nguyên)?',
            correctAnswer: '65',
            adminHint: 'Góc đáy = (180° - 50°) / 2 = 130° / 2 = 65°.',
            stepByStepSolution: 'Bước 1: ΔABC cân tại A nên ∠B = ∠C.\nBước 2: Tổng ba góc: ∠A + ∠B + ∠C = 180° ⟹ 2∠B = 180° - ∠A = 180° - 50° = 130°.\nBước 3: ∠B = 130° / 2 = 65°.',
            explanation: 'Góc ở đáy của tam giác cân là 65°.',
            pointsXP: 20
          }
        ]
      }
    ]
  },

  // ==========================================
  // CHƯƠNG V: THU THẬP VÀ BIỂU DIỄN DỮ LIỆU
  // ==========================================
  {
    id: 'ch-5',
    code: 'CHƯƠNG V',
    title: 'Thu Thập & Biểu Diễn Dữ Liệu',
    description: 'Dữ liệu số (định lượng), dữ liệu không phải số (định tính), biểu đồ hình quạt tròn và biểu đồ đoạn thẳng.',
    iconName: 'PieChart',
    color: 'teal',
    lessons: [
      {
        id: 'c5-l1',
        chapterId: 'ch-5',
        number: 17,
        title: 'Thu thập và phân loại dữ liệu',
        description: 'Phân loại dữ liệu định tính và định lượng, tính đại diện của dữ liệu điều tra (PDF trang 120-122).',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Dữ liệu gồm: Dữ liệu là số (dữ liệu định lượng) và Dữ liệu không là số (dữ liệu định tính).',
            'Dữ liệu không là số gồm 2 loại: Không thể sắp thứ tự (Hà Nội, Nam Định...) và Có thể sắp thứ tự (Tốt, Khá, Đạt, Chưa đạt).',
            'Tính đại diện: Dữ liệu thu được phải đại diện cho toàn bộ đối tượng quan tâm mới đưa ra kết luận hợp lý.'
          ],
          formulaSummary: [
            'Dữ liệu = Định lượng (số đo, chiều cao, điểm) + Định tính (màu sắc, tên gọi, xếp loại)'
          ],
          rules: ['Để có kết luận đại diện, mẫu khảo sát phải đủ lớn và ngẫu nhiên.'],
          commonMistakes: ['Chỉ khảo sát 1 nhóm bạn thân rồi đưa ra kết luận cho toàn trường (thiếu tính đại diện).']
        },
        examples: [
          {
            title: 'Ví dụ (PDF trang 120): Phân loại dữ liệu',
            problem: 'Chiều cao của 4 học sinh: 1,2m; 1,4m; 1,3m; 1,35m là loại dữ liệu gì?',
            steps: [
              { stepNumber: 1, instruction: 'Xem xét các giá trị', formula: '1,2; 1,4; 1,3; 1,35 là các con số' },
              { stepNumber: 2, instruction: 'Kết luận', formula: 'Dữ liệu số (Dữ liệu định lượng)' }
            ]
          }
        ],
        questions: [
          {
            id: 'q17-1',
            lessonId: 'c5-l1',
            type: 'multiple_choice',
            category: 'Phân loại dữ liệu',
            difficulty: 'Cơ bản',
            prompt: 'Dãy dữ liệu nào sau đây là DỮ LIỆU ĐỊNH LƯỢNG (dữ liệu là số)?',
            options: [
              'Điểm kiểm tra Toán: 8; 9; 7,5; 10',
              'Màu sơn tường: Xanh, Đỏ, Vàng, Trắng',
              'Phương tiện đi lại: Xe đạp, Xe máy, Xe buýt',
              'Mức độ yêu thích môn học: Rất thích, Thích, Không thích'
            ],
            correctAnswer: 'Điểm kiểm tra Toán: 8; 9; 7,5; 10',
            adminHint: 'Dữ liệu định lượng là dữ liệu biểu diễn bằng các con số đo lường được.',
            stepByStepSolution: 'Bước 1: Phân biệt dữ liệu số (định lượng) và dữ liệu chữ (định tính).\nBước 2: Điểm kiểm tra (8; 9; 7,5; 10) là các con số đo lường được.\nBước 3: Chọn đáp án A.',
            explanation: 'Điểm kiểm tra là dữ liệu số (định lượng).',
            pointsXP: 20
          }
        ]
      },
      {
        id: 'c5-l2',
        chapterId: 'ch-5',
        number: 18,
        title: 'Biểu đồ hình quạt tròn',
        description: 'Đọc và mô tả biểu đồ hình quạt tròn, biểu diễn tỉ lệ phần trăm ứng với 100% (PDF trang 123-125).',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Biểu đồ hình quạt tròn dùng để so sánh các phần trong toàn bộ dữ liệu.',
            'Cả hình tròn biểu diễn toàn bộ dữ liệu ứng với 100%. Mỗi hình quạt biểu diễn một tỉ lệ phần trăm.',
            'Cách tính số lượng: Số lượng phần tử = Tổng số × Tỉ lệ phần trăm.'
          ],
          formulaSummary: [
            'Tổng các hình quạt = 100%',
            'Giá trị = Tổng số × (% / 100)'
          ],
          rules: ['Tổng tất cả các tỉ lệ phần trăm trên các hình quạt luôn bằng 100%.'],
          commonMistakes: ['Tính sai tỉ lệ phần trăm khi quên chia cho 100.']
        },
        examples: [
          {
            title: 'Ví dụ (PDF trang 124): Tính số học sinh từ biểu đồ',
            problem: 'Lớp 7A có 45 học sinh. Biểu đồ quạt tròn cho biết có 20% học sinh tham gia bơi lội. Hỏi có bao nhiêu học sinh tham gia bơi lội?',
            steps: [
              { stepNumber: 1, instruction: 'Áp dụng công thức tính số lượng', formula: 'Số học sinh = 45 × 20%' },
              { stepNumber: 2, instruction: 'Tính kết quả', formula: '45 × 20 / 100 = 9 học sinh' }
            ]
          }
        ],
        questions: [
          {
            id: 'q18-1',
            lessonId: 'c5-l2',
            type: 'fill_in_blank',
            category: 'Biểu đồ hình quạt',
            difficulty: 'Trung bình',
            prompt: 'Một cửa hàng nhập về 200 kg trái cây. Biểu đồ quạt tròn cho biết Cam chiếm 50% tổng số trái cây. Khối lượng Cam là bao nhiêu kg (nhập số nguyên)?',
            correctAnswer: '100',
            adminHint: 'Lấy 200 × 50% = 200 × 0,5 = 100 kg.',
            stepByStepSolution: 'Bước 1: Khối lượng cam chiếm 50% của 200 kg.\nBước 2: Khối lượng Cam = 200 × 50 / 100 = 100 kg.',
            explanation: 'Khối lượng cam là 100 kg.',
            pointsXP: 20
          }
        ]
      },
      {
        id: 'c5-l3',
        chapterId: 'ch-5',
        number: 19,
        title: 'Biểu đồ đoạn thẳng',
        description: 'Biểu diễn sự thay đổi của đại lượng theo thời gian, đọc xu hướng tăng giảm (PDF trang 126-129).',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Biểu đồ đoạn thẳng dùng để biểu diễn sự thay đổi của một đại lượng theo thời gian.',
            'Trục nằm ngang (hoành) biểu diễn thời gian; Trục thẳng đứng (tung) biểu diễn đại lượng quan tâm.',
            'Đoạn đi lên biểu diễn xu hướng tăng, đoạn đi xuống biểu diễn xu hướng giảm.'
          ],
          formulaSummary: ['Trục ngang: Thời gian | Trục dọc: Giá trị đo lường'],
          rules: ['Đọc kỹ đơn vị đo trên trục tung (ví dụ: nghìn đồng/kg, triệu tấn, °C).'],
          commonMistakes: ['Nhầm lẫn mốc thời gian trên trục ngang.']
        },
        examples: [
          {
            title: 'Ví dụ (PDF trang 126): Đọc nhiệt độ',
            problem: 'Nhiệt độ đo được trong 3 ngày: Thứ Hai (37°C), Thứ Ba (35°C), Thứ Tư (36°C). Ngày nào có nhiệt độ cao nhất?',
            steps: [
              { stepNumber: 1, instruction: 'So sánh các điểm trên trục dọc', formula: '37°C > 36°C > 35°C' },
              { stepNumber: 2, instruction: 'Kết luận ngày cao nhất', formula: 'Thứ Hai (37°C)' }
            ]
          }
        ],
        questions: [
          {
            id: 'q19-1',
            lessonId: 'c5-l3',
            type: 'multiple_choice',
            category: 'Biểu đồ đoạn thẳng',
            difficulty: 'Cơ bản',
            prompt: 'Biểu đồ đoạn thẳng thường được sử dụng hiệu quả nhất để biểu diễn thông tin nào?',
            options: [
              'Sự thay đổi của một đại lượng theo thời gian',
              'Tỉ lệ phần trăm các thành phần trong tổng thể',
              'Cơ cấu dân số theo độ tuổi',
              'Số lượng các loại phương tiện tĩnh'
            ],
            correctAnswer: 'Sự thay đổi của một đại lượng theo thời gian',
            adminHint: 'Biểu đồ đoạn thẳng có trục ngang là trục thời gian.',
            stepByStepSolution: 'Bước 1: Đặc trưng của biểu đồ đoạn thẳng là nối các mốc thời gian liên tiếp bằng các đoạn thẳng.\nBước 2: Mục đích là quan sát xu hướng tăng, giảm của đại lượng theo thời gian.',
            explanation: 'Biểu đồ đoạn thẳng dùng để biểu diễn sự thay đổi của một đại lượng theo thời gian.',
            pointsXP: 20
          }
        ]
      }
    ]
  },

  // ==========================================
  // CHƯƠNG VI: TỈ LỆ THỨC VÀ ĐẠI LƯỢNG TỈ LỆ
  // ==========================================
  {
    id: 'ch-6',
    code: 'CHƯƠNG VI',
    title: 'Tỉ Lệ Thức & Đại Lượng Tỉ Lệ',
    description: 'Tỉ lệ thức, tính chất dãy tỉ số bằng nhau, bài toán thực tế tỉ lệ thuận và tỉ lệ nghịch.',
    iconName: 'Scale',
    color: 'blue',
    lessons: [
      {
        id: 'c6-l1',
        chapterId: 'ch-6',
        number: 20,
        title: 'Tỉ lệ thức',
        description: 'Định nghĩa a/b = c/d, tính chất tích chéo a·d = b·c và tìm x trong tỉ lệ thức (PDF trang 130-133).',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Tỉ lệ thức là đẳng thức của hai tỉ số a/b = c/d (viết là a:b = c:d).',
            'Tính chất cơ bản: a/b = c/d ⇔ a · d = b · c (tích trung tỉ bằng tích ngoại tỉ).',
            'Từ a · d = b · c (với a, b, c, d ≠ 0) ta lập được 4 tỉ lệ thức: a/b = c/d; a/c = b/d; d/b = c/a; d/c = b/a.'
          ],
          formulaSummary: ['a/b = c/d ⇔ a · d = b · c', 'x/b = c/d ⟹ x = (b · c) / d'],
          rules: ['Khi tìm x: x = (tích hai số trên đường chéo kia) chia cho số đối diện với x.'],
          commonMistakes: ['Nhân chéo nhầm tử với tử hoặc mẫu với mẫu.']
        },
        examples: [
          {
            title: 'Ví dụ (PDF trang 130): Tìm x trong tỉ lệ thức',
            problem: 'Tìm x biết: x/6 = 5/3',
            steps: [
              { stepNumber: 1, instruction: 'Nhân chéo hai vế', formula: '3 · x = 6 · 5 = 30' },
              { stepNumber: 2, instruction: 'Tìm x', formula: 'x = 30 / 3 = 10' }
            ]
          }
        ],
        questions: [
          {
            id: 'q20-1',
            lessonId: 'c6-l1',
            type: 'fill_in_blank',
            category: 'Tìm x',
            difficulty: 'Cơ bản',
            prompt: 'Tìm x từ tỉ lệ thức sau: x/6 = 5/3. Nhập giá trị của x:',
            correctAnswer: '10',
            adminHint: '3x = 6 × 5 = 30 ⟹ x = 10.',
            stepByStepSolution: 'Bước 1: Áp dụng tính chất tích chéo: x · 3 = 6 · 5.\nBước 2: 3x = 30.\nBước 3: x = 30 : 3 = 10.',
            explanation: 'Theo tính chất tỉ lệ thức: x = 10.',
            pointsXP: 20
          }
        ]
      },
      {
        id: 'c6-l2',
        chapterId: 'ch-6',
        number: 21,
        title: 'Tính chất của dãy tỉ số bằng nhau',
        description: 'Mở rộng tính chất a/b = c/d = (a±c)/(b±d) và giải bài toán thực tế chia phần (PDF trang 134-142).',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Từ a/b = c/d ⟹ a/b = c/d = (a + c)/(b + d) = (a - c)/(b - d) (giả thiết mẫu ≠ 0).',
            'Mở rộng dãy 3 tỉ số: a/b = c/d = e/f = (a + c + e)/(b + d + f) = (a - c + e)/(b - d + f).',
            'Khi a, b, c tỉ lệ với m, n, p ta viết: a/m = b/n = c/p (hoặc a:b:c = m:n:p).'
          ],
          formulaSummary: ['x/a = y/b = z/c = (x + y + z)/(a + b + c)'],
          rules: ['Dấu ở tử số như thế nào thì dấu ở mẫu số phải tương ứng như thế.'],
          commonMistakes: ['Cộng ở tử số nhưng lại trừ ở mẫu số.']
        },
        examples: [
          {
            title: 'Ví dụ (PDF trang 134): Tìm hai số',
            problem: 'Tìm hai số x và y biết x/5 = y/3 và x + y = 16',
            steps: [
              { stepNumber: 1, instruction: 'Áp dụng tính chất dãy tỉ số bằng nhau', formula: 'x/5 = y/3 = (x + y)/(5 + 3) = 16/8 = 2' },
              { stepNumber: 2, instruction: 'Tìm x', formula: 'x = 5 · 2 = 10' },
              { stepNumber: 3, instruction: 'Tìm y', formula: 'y = 3 · 2 = 6' }
            ]
          }
        ],
        questions: [
          {
            id: 'q21-1',
            lessonId: 'c6-l2',
            type: 'multiple_choice',
            category: 'Dãy tỉ số',
            difficulty: 'Trung bình',
            prompt: 'Hai bạn An và Bình có số viên bi tỉ lệ với 3 và 5. Biết Bình có nhiều hơn An 12 viên bi. Số viên bi của An là:',
            options: ['18 viên', '30 viên', '15 viên', '24 viên'],
            correctAnswer: '18 viên',
            adminHint: 'x/3 = y/5 = (y - x)/(5 - 3) = 12/2 = 6 ⟹ x = 3 × 6 = 18.',
            stepByStepSolution: 'Bước 1: Gọi số bi của An và Bình lần lượt là x và y: x/3 = y/5 và y - x = 12.\nBước 2: Theo tính chất dãy tỉ số: x/3 = y/5 = (y - x)/(5 - 3) = 12/2 = 6.\nBước 3: Số bi của An là x = 3 · 6 = 18 viên.',
            explanation: 'Số bi của An là 18 viên.',
            pointsXP: 25
          }
        ]
      },
      {
        id: 'c6-l3',
        chapterId: 'ch-6',
        number: 22,
        title: 'Đại lượng tỉ lệ thuận',
        description: 'Định nghĩa y = k·x (k ≠ 0), tính chất tỉ số tương ứng không đổi và bài toán thực tế (PDF trang 143-155).',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Nếu đại lượng y liên hệ với đại lượng x theo công thức y = k·x (k là hằng số ≠ 0) thì y tỉ lệ thuận với x theo hệ số k.',
            'Khi y tỉ lệ thuận với x theo hệ số k thì x tỉ lệ thuận với y theo hệ số 1/k.',
            'Tính chất: y₁/x₁ = y₂/x₂ = ... = yₙ/xₙ = k; x₁/x₂ = y₁/y₂.'
          ],
          formulaSummary: ['y = k · x', 'y₁/x₁ = y₂/x₂ = k'],
          rules: ['Đại lượng tỉ lệ thuận: khi một đại lượng tăng lên bao nhiêu lần thì đại lượng kia cũng tăng lên bấy nhiêu lần.'],
          commonMistakes: ['Nhầm hệ số tỉ lệ của y đối với x và hệ số của x đối với y.']
        },
        examples: [
          {
            title: 'Ví dụ (PDF trang 143): Xác định hệ số k',
            problem: 'Cho x và y tỉ lệ thuận, khi x = 3 thì y = 15. Tìm hệ số tỉ lệ k của y đối với x.',
            steps: [
              { stepNumber: 1, instruction: 'Công thức tỉ lệ thuận', formula: 'y = k · x' },
              { stepNumber: 2, instruction: 'Thay số tìm k', formula: '15 = k · 3 ⟹ k = 15/3 = 5' }
            ]
          }
        ],
        questions: [
          {
            id: 'q22-1',
            lessonId: 'c6-l3',
            type: 'fill_in_blank',
            category: 'Tỉ lệ thuận',
            difficulty: 'Cơ bản',
            prompt: 'Biết hai đại lượng y và x tỉ lệ thuận với nhau và khi x = 5 thì y = 20. Hệ số tỉ lệ k của y đối với x là (nhập số nguyên):',
            correctAnswer: '4',
            adminHint: 'k = y / x = 20 / 5 = 4.',
            stepByStepSolution: 'Bước 1: Vì y tỉ lệ thuận với x nên y = k · x.\nBước 2: Thay x = 5, y = 20 ta có: 20 = k · 5.\nBước 3: k = 20 : 5 = 4.',
            explanation: 'Hệ số tỉ lệ k của y đối với x là 4.',
            pointsXP: 20
          }
        ]
      },
      {
        id: 'c6-l4',
        chapterId: 'ch-6',
        number: 23,
        title: 'Đại lượng tỉ lệ nghịch',
        description: 'Định nghĩa y = a/x (a ≠ 0), tính chất x₁·y₁ = x₂·y₂ = a và bài toán năng suất lao động (PDF trang 156-168).',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Nếu đại lượng y liên hệ với đại lượng x theo công thức y = a/x hay x·y = a (a là hằng số ≠ 0) thì y tỉ lệ nghịch với x theo hệ số a.',
            'Khi y tỉ lệ nghịch với x theo hệ số a thì x cũng tỉ lệ nghịch với y theo cùng hệ số a.',
            'Tính chất: x₁ · y₁ = x₂ · y₂ = ... = xₙ · yₙ = a; x₁/x₂ = y₂/y₁.'
          ],
          formulaSummary: ['y = a / x ⇔ x · y = a', 'x₁ · y₁ = x₂ · y₂'],
          rules: ['Đại lượng tỉ lệ nghịch: Khi một đại lượng tăng gấp bao nhiêu lần thì đại lượng kia giảm đi bấy nhiêu lần.'],
          commonMistakes: ['Áp dụng nhầm tính chất tỉ lệ thuận cho bài toán tỉ lệ nghịch (ví dụ số người và thời gian hoàn thành).']
        },
        examples: [
          {
            title: 'Ví dụ (PDF trang 156): Xác định hệ số a',
            problem: 'Cho x và y là hai đại lượng tỉ lệ nghịch và khi x = 8 thì y = 15. Tìm hệ số tỉ lệ a.',
            steps: [
              { stepNumber: 1, instruction: 'Công thức tỉ lệ nghịch', formula: 'x · y = a' },
              { stepNumber: 2, instruction: 'Tính a', formula: 'a = 8 · 15 = 120' }
            ]
          }
        ],
        questions: [
          {
            id: 'q23-1',
            lessonId: 'c6-l4',
            type: 'fill_in_blank',
            category: 'Tỉ lệ nghịch',
            difficulty: 'Trung bình',
            prompt: 'Cho biết 35 công nhân xây một ngôi nhà hết 168 ngày. Hỏi 28 công nhân xây ngôi nhà đó hết bao nhiêu ngày (năng suất như nhau, nhập số nguyên)?',
            correctAnswer: '210',
            adminHint: 'Số công nhân và số ngày tỉ lệ nghịch: 35 × 168 = 28 × x ⟹ x = 5880 / 28 = 210.',
            stepByStepSolution: 'Bước 1: Số công nhân và số ngày hoàn thành công việc là hai đại lượng tỉ lệ nghịch.\nBước 2: Ta có: 35 · 168 = 28 · x.\nBước 3: x = (35 · 168) / 28 = 5880 / 28 = 210 ngày.',
            explanation: '28 công nhân sẽ hoàn thành trong 210 ngày.',
            pointsXP: 25
          }
        ]
      }
    ]
  },

  // ==========================================
  // CHƯƠNG VII: BIỂU THỨC ĐẠI SỐ VÀ ĐA THỨC MỘT BIẾN
  // ==========================================
  {
    id: 'ch-7',
    code: 'CHƯƠNG VII',
    title: 'Biểu Thức Đại Số & Đa Thức Một Biến',
    description: 'Biểu thức đại số, đơn thức, đa thức một biến, bậc, hệ số, nghiệm và các phép tính (PDF trang 169-186).',
    iconName: 'Variable',
    color: 'purple',
    lessons: [
      {
        id: 'c7-l1',
        chapterId: 'ch-7',
        number: 24,
        title: 'Biểu thức đại số',
        description: 'Khái niệm biến số, giá trị của biểu thức đại số khi thay số vào biến (PDF trang 169-171).',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Biểu thức đại số là biểu thức gồm các số, các chữ (biến số) và các phép toán cộng, trừ, nhân, chia, nâng lên lũy thừa.',
            'Cách viết gọn: 2 · x viết là 2x; a · b viết là ab; 1 · a viết là a.',
            'Tính giá trị biểu thức: Thay giá trị cho trước của các biến vào biểu thức rồi thực hiện phép tính theo đúng thứ tự.'
          ],
          formulaSummary: ['A = 3x² - 5x + 1; khi x = 1 thì A = 3(1)² - 5(1) + 1 = -1'],
          rules: ['Khi thay số âm vào biến phải đặt trong dấu ngoặc đơn: ví dụ (-1)².'],
          commonMistakes: ['Quên ngoặc đơn khi bình phương số âm dẫn đến sai dấu (-1² = -1 thay vì (-1)² = 1).']
        },
        examples: [
          {
            title: 'Ví dụ (PDF trang 169): Tính giá trị biểu thức',
            problem: 'Tính giá trị của biểu thức A = 3x² - 5x + 1 tại x = 2',
            steps: [
              { stepNumber: 1, instruction: 'Thay x = 2 vào biểu thức A', formula: 'A = 3 · 2² - 5 · 2 + 1' },
              { stepNumber: 2, instruction: 'Thực hiện lũy thừa trước', formula: 'A = 3 · 4 - 10 + 1' },
              { stepNumber: 3, instruction: 'Tính kết quả', formula: 'A = 12 - 10 + 1 = 3' }
            ]
          }
        ],
        questions: [
          {
            id: 'q24-1',
            lessonId: 'c7-l1',
            type: 'fill_in_blank',
            category: 'Giá trị biểu thức',
            difficulty: 'Cơ bản',
            prompt: 'Tính giá trị của biểu thức A = 3x² - 3 tại x = 2 (nhập số nguyên):',
            correctAnswer: '9',
            adminHint: 'A = 3·(2)² - 3 = 3·4 - 3 = 12 - 3 = 9.',
            stepByStepSolution: 'Bước 1: Thay x = 2 vào biểu thức A = 3x² - 3.\nBước 2: A = 3 · 2² - 3 = 3 · 4 - 3.\nBước 3: A = 12 - 3 = 9.',
            explanation: 'Giá trị của biểu thức A tại x = 2 là 9.',
            pointsXP: 20
          }
        ]
      },
      {
        id: 'c7-l2',
        chapterId: 'ch-7',
        number: 25,
        title: 'Đa thức một biến, bậc và nghiệm',
        description: 'Thu gọn đa thức, sắp xếp lũy thừa giảm dần, tìm bậc, hệ số cao nhất, hệ số tự do và tìm nghiệm (PDF trang 172-177).',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Đa thức một biến là tổng của những đơn thức cùng một biến.',
            'Thu gọn đa thức bằng cách cộng trừ các hạng tử cùng bậc.',
            'Bậc của đa thức một biến (khác đa thức không) là số mũ lớn nhất của biến trong đa thức đã thu gọn.',
            'Nghiệm của đa thức: Nếu tại x = a mà A(a) = 0 thì a là nghiệm của đa thức A(x).'
          ],
          formulaSummary: [
            'A(x) = aₙxⁿ + ... + a₁x + a₀',
            'x = a là nghiệm ⇔ A(a) = 0'
          ],
          rules: ['Luôn thu gọn đa thức trước khi xác định bậc và hệ số.'],
          commonMistakes: ['Nhầm bậc của đa thức chưa thu gọn khi các hạng tử bậc cao nhất triệt tiêu nhau.']
        },
        examples: [
          {
            title: 'Ví dụ: Tìm nghiệm',
            problem: 'Tìm nghiệm của đa thức P(x) = 2x - 6',
            steps: [
              { stepNumber: 1, instruction: 'Cho P(x) = 0', formula: '2x - 6 = 0' },
              { stepNumber: 2, instruction: 'Giải tìm x', formula: '2x = 6 ⟹ x = 3' }
            ]
          }
        ],
        questions: [
          {
            id: 'q25-1',
            lessonId: 'c7-l2',
            type: 'fill_in_blank',
            category: 'Nghiệm đa thức',
            difficulty: 'Cơ bản',
            prompt: 'Tìm nghiệm của đa thức P(x) = 3x - 12. Nhập giá trị x =',
            correctAnswer: '4',
            adminHint: 'Cho 3x - 12 = 0 ⟹ 3x = 12 ⟹ x = 4.',
            stepByStepSolution: 'Bước 1: Cho đa thức bằng 0: 3x - 12 = 0.\nBước 2: Chuyển vế: 3x = 12.\nBước 3: x = 12 : 3 = 4.',
            explanation: 'Nghiệm của đa thức là x = 4.',
            pointsXP: 20
          }
        ]
      }
    ]
  }
];
