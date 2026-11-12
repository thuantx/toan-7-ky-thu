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
    code: 'Chương I',
    title: 'Số Hữu Tỉ',
    description: 'Tập hợp các số hữu tỉ, các phép toán cộng trừ nhân chia, lũy thừa và quy tắc chuyển vế tìm x.',
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
            'Tập hợp các số hữu tỉ kí hiệu là ℚ. Tập hợp các số hữu tỉ khác 0 kí hiệu là ℚ*.',
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
            problem: 'Tìm số đối của các số: 2,4; 4/(-9); -11/3; (-5)/(-8)',
            steps: [
              { stepNumber: 1, instruction: 'Số đối của 2,4', formula: '-2,4' },
              { stepNumber: 2, instruction: 'Chuyển dấu âm lên tử 4/(-9) = -4/9, số đối là', formula: '4/9' },
              { stepNumber: 3, instruction: 'Số đối của -11/3 là', formula: '11/3' },
              { stepNumber: 4, instruction: 'Ta có (-5)/(-8) = 5/8, số đối là', formula: '-5/8' }
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
          },
          {
            id: 'q1-3',
            lessonId: 'c1-l1',
            type: 'multiple_choice',
            category: 'So sánh',
            difficulty: 'Trung bình',
            prompt: 'So sánh hai số hữu tỉ: x = -3/5 và y = -2/5. Khẳng định nào đúng?',
            options: [
              'x > y',
              'x < y',
              'x = y',
              'Không so sánh được'
            ],
            correctAnswer: 'x < y',
            adminHint: 'Hai phân số cùng mẫu dương 5, so sánh tử số: -3 < -2.',
            stepByStepSolution: 'Bước 1: Hai phân số có cùng mẫu số dương là 5.\nBước 2: So sánh tử số: vì -3 < -2 nên -3/5 < -2/5.\nBước 3: Vậy x < y.',
            explanation: 'Vì -3 < -2 nên -3/5 < -2/5 hay x < y.',
            pointsXP: 20
          },
          {
            id: 'q1-4',
            lessonId: 'c1-l1',
            type: 'fill_in_blank',
            category: 'Biểu diễn phân số',
            difficulty: 'Cơ bản',
            prompt: 'Viết số thập phân -0,75 dưới dạng phân số tối giản a/b (với mẫu số dương):',
            correctAnswer: '-3/4',
            adminHint: '-0,75 = -75/100, chia cả tử và mẫu cho 25.',
            stepByStepSolution: 'Bước 1: Đổi -0,75 = -75/100.\nBước 2: Rút gọn cho ƯCLN(75, 100) = 25: -75:25 / 100:25 = -3/4.\nBước 3: Kết quả phân số tối giản là -3/4.',
            explanation: '-0,75 = -75/100 = -3/4.',
            pointsXP: 25
          },
          {
            id: 'q1-5',
            lessonId: 'c1-l1',
            type: 'multiple_choice',
            category: 'Nhận biết',
            difficulty: 'Cơ bản',
            prompt: 'Trong các số sau, số nào KHÔNG PHẢI là số hữu tỉ?',
            options: [
              '0',
              '-2,5',
              '3/0',
              '-11/7'
            ],
            correctAnswer: '3/0',
            adminHint: 'Mẫu số của phân số phải khác 0 (b ≠ 0). Phép chia cho 0 không có nghĩa.',
            stepByStepSolution: 'Bước 1: Kiểm tra định nghĩa a/b với b ≠ 0.\nBước 2: Số 3/0 có mẫu số bằng 0 nên biểu thức này vô nghĩa, không phải là số hữu tỉ.',
            explanation: 'Mẫu số phải khác 0 nên 3/0 không phải là số hữu tỉ.',
            pointsXP: 20
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
            prompt: 'Tính kết quả phép cộng: 1/3 + 1/4 (nhập phân số tối giản a/b):',
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
          },
          {
            id: 'q2-3',
            lessonId: 'c1-l2',
            type: 'fill_in_blank',
            category: 'Tính toán',
            difficulty: 'Cơ bản',
            prompt: 'Tính kết quả phép trừ: 2/15 - 7/10 (nhập phân số tối giản a/b):',
            correctAnswer: '-17/30',
            adminHint: 'Mẫu số chung của 15 và 10 là 30. Quy đồng: 4/30 - 21/30.',
            stepByStepSolution: 'Bước 1: BCNN(15, 10) = 30.\nBước 2: Quy đồng: 2/15 = 4/30; 7/10 = 21/30.\nBước 3: Trừ: 4/30 - 21/30 = -17/30.',
            explanation: '2/15 - 7/10 = 4/30 - 21/30 = -17/30.',
            pointsXP: 25
          },
          {
            id: 'q2-4',
            lessonId: 'c1-l2',
            type: 'multiple_choice',
            category: 'Phép nhân chia',
            difficulty: 'Trung bình',
            prompt: 'Tính kết quả: (-2/3) · (6/5):',
            options: ['-4/5', '4/5', '-12/15', '-5/4'],
            correctAnswer: '-4/5',
            adminHint: 'Rút gọn 6 với 3 trước khi nhân: (-2 · 2) / 5 = -4/5.',
            stepByStepSolution: 'Bước 1: Nhân tử với tử, mẫu với mẫu: (-2 · 6) / (3 · 5).\nBước 2: Rút gọn 6 chia cho 3 được 2: (-2 · 2) / 5 = -4/5.',
            explanation: '(-2/3) · (6/5) = -4/5.',
            pointsXP: 20
          },
          {
            id: 'q2-5',
            lessonId: 'c1-l2',
            type: 'fill_in_blank',
            category: 'Phép nhân chia',
            difficulty: 'Trung bình',
            prompt: 'Tính kết quả phép chia: (2/5) : (-4/15) (nhập phân số tối giản a/b):',
            correctAnswer: '-3/2',
            adminHint: 'Chia là nhân với phân số nghịch đảo: (2/5) · (-15/4).',
            stepByStepSolution: 'Bước 1: Đổi chia thành nhân đảo ngược: (2/5) · (-15/4).\nBước 2: Rút gọn 2 với 4 còn 2 ở mẫu, 15 với 5 còn 3 ở tử.\nBước 3: Kết quả là -3/2.',
            explanation: '(2/5) : (-4/15) = (2/5) · (-15/4) = -3/2.',
            pointsXP: 25
          }
        ]
      },
      {
        id: 'c1-l3',
        chapterId: 'ch-1',
        number: 3,
        title: 'Lũy thừa với số mũ tự nhiên của một số hữu tỉ',
        description: 'Định nghĩa lũy thừa x^n, tích và thương của hai lũy thừa cùng cơ số, lũy thừa của lũy thừa, lũy thừa của tích và thương.',
        status: 'IN_PROGRESS',
        accuracy: 88,
        totalAttempts: 15,
        correctCount: 13,
        timeSpentMinutes: 30,
        theory: {
          keyPoints: [
            'Lũy thừa bậc n của số hữu tỉ x là tích của n thừa số x: x^n = x · x · ... · x (n thừa số x, n ∈ ℕ, n > 1).',
            'Quy ước: x^1 = x; x^0 = 1 (với x ≠ 0).',
            'Tích hai lũy thừa cùng cơ số: x^m · x^n = x^(m+n).',
            'Thương hai lũy thừa cùng cơ số: x^m : x^n = x^(m-n) (với x ≠ 0, m ≥ n).',
            'Lũy thừa của lũy thừa: (x^m)^n = x^(m·n).',
            'Lũy thừa của một tích: (x · y)^n = x^n · y^n.',
            'Lũy thừa của một thương: (x / y)^n = x^n / y^n (y ≠ 0).'
          ],
          formulaSummary: [
            'x^m · x^n = x^(m+n)',
            'x^m : x^n = x^(m-n)',
            '(x^m)^n = x^(m·n)',
            '(x/y)^n = x^n / y^n'
          ],
          rules: ['Lũy thừa bậc chẵn của số âm luôn là số dương: (-a)^(2k) > 0.'],
          commonMistakes: ['Nhầm lẫn (-1/2)^2 = -1/4 (đúng là 1/4) do quên tính dấu ngoặc.']
        },
        examples: [
          {
            title: 'Ví dụ: Tính lũy thừa phân số',
            problem: 'Tính: (-2/3)^3 và (-1/2)^4',
            steps: [
              { stepNumber: 1, instruction: 'Tính (-2/3)^3 (mũ lẻ nên kết quả âm)', formula: '(-2)^3 / 3^3 = -8/27' },
              { stepNumber: 2, instruction: 'Tính (-1/2)^4 (mũ chẵn nên kết quả dương)', formula: '(-1)^4 / 2^4 = 1/16' }
            ]
          }
        ],
        questions: [
          {
            id: 'q3-1',
            lessonId: 'c1-l3',
            type: 'fill_in_blank',
            category: 'Tính toán',
            difficulty: 'Cơ bản',
            prompt: 'Tính giá trị: (-2/3)^3 (nhập phân số tối giản a/b):',
            correctAnswer: '-8/27',
            adminHint: '(-2/3)^3 = (-2)^3 / 3^3 = -8/27.',
            stepByStepSolution: 'Bước 1: Áp dụng công thức (a/b)^n = a^n / b^n.\nBước 2: (-2)^3 = -8; 3^3 = 27.\nBước 3: Kết quả là -8/27.',
            explanation: '(-2/3)^3 = -8/27.',
            pointsXP: 20
          },
          {
            id: 'q3-2',
            lessonId: 'c1-l3',
            type: 'multiple_choice',
            category: 'Quy tắc lũy thừa',
            difficulty: 'Cơ bản',
            prompt: 'Viết kết quả phép tính (0,5)^3 · (0,5)^2 dưới dạng một lũy thừa:',
            options: ['(0,5)^5', '(0,5)^6', '(0,5)^1', '(0,25)^5'],
            correctAnswer: '(0,5)^5',
            adminHint: 'Áp dụng quy tắc nhân hai lũy thừa cùng cơ số: x^m · x^n = x^(m+n).',
            stepByStepSolution: 'Bước 1: Giữ nguyên cơ số 0,5.\nBước 2: Cộng hai số mũ: 3 + 2 = 5.\nBước 3: Kết quả là (0,5)^5.',
            explanation: '(0,5)^3 · (0,5)^2 = (0,5)^(3+2) = (0,5)^5.',
            pointsXP: 20
          },
          {
            id: 'q3-3',
            lessonId: 'c1-l3',
            type: 'fill_in_blank',
            category: 'Quy ước số mũ',
            difficulty: 'Cơ bản',
            prompt: 'Tính giá trị của biểu thức: (-109/11)^0:',
            correctAnswer: '1',
            adminHint: 'Mọi số khác 0 nâng lên lũy thừa 0 đều bằng 1 (x^0 = 1).',
            stepByStepSolution: 'Bước 1: Nhớ lại quy ước x^0 = 1 với mọi x ≠ 0.\nBước 2: Vì -109/11 ≠ 0 nên (-109/11)^0 = 1.',
            explanation: 'Theo quy ước, với mọi x ≠ 0 thì x^0 = 1.',
            pointsXP: 20
          },
          {
            id: 'q3-4',
            lessonId: 'c1-l3',
            type: 'multiple_choice',
            category: 'Tìm x',
            difficulty: 'Trung bình',
            prompt: 'Tìm số tự nhiên n biết: 2^n = 32',
            options: ['n = 5', 'n = 4', 'n = 6', 'n = 16'],
            correctAnswer: 'n = 5',
            adminHint: 'Phân tích 32 = 2 · 2 · 2 · 2 · 2 = 2^5.',
            stepByStepSolution: 'Bước 1: Phân tích 32 ra thừa số nguyên tố: 32 = 2^5.\nBước 2: Ta có 2^n = 2^5, do đó n = 5.',
            explanation: 'Vì 2^5 = 32 nên n = 5.',
            pointsXP: 25
          },
          {
            id: 'q3-5',
            lessonId: 'c1-l3',
            type: 'fill_in_blank',
            category: 'Lũy thừa của tích',
            difficulty: 'Trung bình',
            prompt: 'Tính giá trị biểu thức: (3/4)^4 · (4/3)^4:',
            correctAnswer: '1',
            adminHint: 'Gộp lại thành [(3/4) · (4/3)]^4 = 1^4 = 1.',
            stepByStepSolution: 'Bước 1: Áp dụng công thức a^n · b^n = (a · b)^n.\nBước 2: [(3/4) · (4/3)]^4 = 1^4.\nBước 3: 1^4 = 1.',
            explanation: '(3/4)^4 · (4/3)^4 = 1^4 = 1.',
            pointsXP: 25
          }
        ]
      },
      {
        id: 'c1-l4',
        chapterId: 'ch-1',
        number: 4,
        title: 'Thứ tự thực hiện phép tính và quy tắc chuyển vế',
        description: 'Thứ tự ưu tiên các phép tính: ngoặc tròn -> vuông -> nhọn; lũy thừa -> nhân chia -> cộng trừ. Quy tắc chuyển vế đổi dấu trong giải phương trình.',
        status: 'IN_PROGRESS',
        accuracy: 85,
        totalAttempts: 12,
        correctCount: 10,
        timeSpentMinutes: 28,
        theory: {
          keyPoints: [
            'Thứ tự thực hiện phép tính: Trong ngoặc trước, ngoài ngoặc sau ( () -> [] -> {} ).',
            'Thứ tự phép tính: Lũy thừa -> Nhân và chia -> Cộng và trừ.',
            'Quy tắc chuyển vế: Khi chuyển một số hạng từ vế này sang vế kia của một đẳng thức, ta phải đổi dấu số hạng đó: x + a = b => x = b - a; x - a = b => x = b + a.'
          ],
          formulaSummary: [
            'x + a = b => x = b - a',
            'x - a = b => x = b + a'
          ],
          rules: ['Khi chuyển vế một số hạng, bắt buộc phải đổi dấu: cộng thành trừ, trừ thành cộng.'],
          commonMistakes: ['Chuyển vế mà quên đổi dấu số hạng.']
        },
        examples: [
          {
            title: 'Ví dụ: Tìm x bằng quy tắc chuyển vế',
            problem: 'Tìm x biết: x - 1/2 = 3/4',
            steps: [
              { stepNumber: 1, instruction: 'Chuyển -1/2 sang vế phải đổi thành +1/2', formula: 'x = 3/4 + 1/2' },
              { stepNumber: 2, instruction: 'Quy đồng mẫu số chung là 4', formula: 'x = 3/4 + 2/4 = 5/4' }
            ]
          }
        ],
        questions: [
          {
            id: 'q4-1',
            lessonId: 'c1-l4',
            type: 'fill_in_blank',
            category: 'Tìm x',
            difficulty: 'Cơ bản',
            prompt: 'Tìm x biết: x - 1/2 = 3/4 (nhập phân số tối giản a/b):',
            correctAnswer: '5/4',
            adminHint: 'Chuyển -1/2 sang vế phải: x = 3/4 + 1/2 = 5/4.',
            stepByStepSolution: 'Bước 1: Chuyển -1/2 sang vế phải đổi dấu thành +1/2: x = 3/4 + 1/2.\nBước 2: Quy đồng mẫu số là 4: 1/2 = 2/4.\nBước 3: x = 3/4 + 2/4 = 5/4.',
            explanation: 'x = 3/4 + 1/2 = 5/4.',
            pointsXP: 20
          },
          {
            id: 'q4-2',
            lessonId: 'c1-l4',
            type: 'multiple_choice',
            category: 'Quy tắc chuyển vế',
            difficulty: 'Cơ bản',
            prompt: 'Khi chuyển số hạng -2/3 từ vế trái sang vế phải của một đẳng thức, ta đổi thành:',
            options: ['+2/3', '-3/2', '+3/2', '-2/3'],
            correctAnswer: '+2/3',
            adminHint: 'Quy tắc chuyển vế: Đổi dấu trừ thành dấu cộng.',
            stepByStepSolution: 'Bước 1: Theo quy tắc chuyển vế, khi chuyển một số hạng từ vế này sang vế kia ta phải đổi dấu của số hạng đó.\nBước 2: Dấu âm (-) đổi thành dấu dương (+).\nBước 3: Do đó -2/3 đổi thành +2/3.',
            explanation: 'Theo quy tắc chuyển vế: dấu trừ (-) đổi thành dấu cộng (+), tức là +2/3.',
            pointsXP: 20
          },
          {
            id: 'q4-3',
            lessonId: 'c1-l4',
            type: 'fill_in_blank',
            category: 'Thứ tự phép tính',
            difficulty: 'Trung bình',
            prompt: 'Tính giá trị biểu thức: 1/2 + 3/2 · 2 (nhập kết quả số nguyên):',
            correctAnswer: '7/2',
            adminHint: 'Nhân chia trước cộng trừ sau: 3/2 · 2 = 3, sau đó 1/2 + 3 = 7/2.',
            stepByStepSolution: 'Bước 1: Thực hiện phép nhân trước: 3/2 · 2 = 3.\nBước 2: Thực hiện phép cộng: 1/2 + 3 = 1/2 + 6/2 = 7/2.',
            explanation: 'Thực hiện nhân trước: 3/2 · 2 = 3, sau đó cộng: 1/2 + 3 = 7/2.',
            pointsXP: 25
          },
          {
            id: 'q4-4',
            lessonId: 'c1-l4',
            type: 'multiple_choice',
            category: 'Tìm x',
            difficulty: 'Trung bình',
            prompt: 'Tìm x biết: 2/3 - x = 1/6',
            options: ['x = 1/2', 'x = 5/6', 'x = -1/2', 'x = 1/3'],
            correctAnswer: 'x = 1/2',
            adminHint: 'x = 2/3 - 1/6 = 4/6 - 1/6 = 3/6 = 1/2.',
            stepByStepSolution: 'Bước 1: Chuyển -x sang vế phải và 1/6 sang vế trái: x = 2/3 - 1/6.\nBước 2: Quy đồng mẫu chung 6: 2/3 = 4/6.\nBước 3: x = 4/6 - 1/6 = 3/6 = 1/2.',
            explanation: 'x = 2/3 - 1/6 = 3/6 = 1/2.',
            pointsXP: 25
          }
        ,
          {
            id: 'q4-5',
            lessonId: 'c1-l4',
            type: 'fill_in_blank',
            category: 'Tìm x',
            difficulty: 'Trung bình',
            prompt: 'Tìm x biết: x - 1/3 = 5/6 (Nhập kết quả dưới dạng phân số tối giản a/b):',
            correctAnswer: '7/6',
            adminHint: 'Chuyển vế -1/3 sang vế phải thành +1/3. 5/6 + 2/6 = 7/6.',
            stepByStepSolution: 'Bước 1: Chuyển vế: x = 5/6 + 1/3.\nBước 2: Quy đồng mẫu số: x = 5/6 + 2/6.\nBước 3: Cộng tử số: x = 7/6.',
            explanation: 'Áp dụng quy tắc chuyển vế đổi dấu, ta tìm được x = 7/6.',
            pointsXP: 25
          }
        ,
          {
            id: 'q4-5',
            lessonId: 'c1-l4',
            type: 'fill_in_blank',
            category: 'Tìm x',
            difficulty: 'Trung bình',
            prompt: 'Tìm x biết: x - 1/3 = 5/6 (Nhập kết quả dưới dạng phân số tối giản a/b):',
            correctAnswer: '7/6',
            adminHint: 'Chuyển vế -1/3 sang vế phải thành +1/3. 5/6 + 2/6 = 7/6.',
            stepByStepSolution: 'Bước 1: Chuyển vế: x = 5/6 + 1/3.\nBước 2: Quy đồng mẫu số: x = 5/6 + 2/6.\nBước 3: Cộng tử số: x = 7/6.',
            explanation: 'Áp dụng quy tắc chuyển vế đổi dấu, ta tìm được x = 7/6.',
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
    code: 'Chương II',
    title: 'Số Thực',
    description: 'Số thập phân vô hạn tuần hoàn, số vô tỉ, căn bậc hai số học, tập hợp số thực và giá trị tuyệt đối.',
    iconName: 'Pi',
    color: 'teal',
    lessons: [
      {
        id: 'c2-l5',
        chapterId: 'ch-2',
        number: 5,
        title: 'Làm quen với số thập phân vô hạn tuần hoàn',
        description: 'Số thập phân hữu hạn và số thập phân vô hạn tuần hoàn, chu kì và làm tròn số.',
        status: 'COMPLETED',
        accuracy: 90,
        totalAttempts: 10,
        correctCount: 9,
        timeSpentMinutes: 22,
        theory: {
          keyPoints: [
            'Số thập phân hữu hạn: Phân số tối giản có mẫu chỉ chứa ước nguyên tố 2 và 5.',
            'Số thập phân vô hạn tuần hoàn: Phân số tối giản có mẫu chứa ước nguyên tố khác 2 và 5.',
            'Chu kì: Nhóm chữ số lặp lại vô hạn lần, viết trong dấu ngoặc tròn (ví dụ: 0,(3) = 0,333...).'
          ],
          formulaSummary: [
            '1/3 = 0,333... = 0,(3) (chu kì 3)',
            '7/33 = 0,2121... = 0,(21) (chu kì 21)'
          ],
          rules: ['Khi làm tròn số: nếu chữ số ngay sau hàng làm tròn ≥ 5 thì cộng 1 vào hàng làm tròn.'],
          commonMistakes: ['Không rút gọn phân số về tối giản trước khi xét mẫu số.']
        },
        examples: [
          {
            title: 'Ví dụ: Viết phân số dưới dạng thập phân',
            problem: 'Viết các phân số 5/3 và 7/11 dưới dạng số thập phân vô hạn tuần hoàn',
            steps: [
              { stepNumber: 1, instruction: 'Chia 5 cho 3 được 1,666...', formula: '5/3 = 1,(6)' },
              { stepNumber: 2, instruction: 'Chia 7 cho 11 được 0,6363...', formula: '7/11 = 0,(63)' }
            ]
          }
        ],
        questions: [
          {
            id: 'q5-1',
            lessonId: 'c2-l5',
            type: 'multiple_choice',
            category: 'Nhận biết chu kì',
            difficulty: 'Cơ bản',
            prompt: 'Số thập phân vô hạn tuần hoàn 0,363636... được viết thu gọn là:',
            options: ['0,(36)', '0,3(6)', '0,(3)', '0,(363)'],
            correctAnswer: '0,(36)',
            adminHint: 'Nhóm chữ số lặp lại là 36 nên chu kì là 36, viết trong ngoặc: 0,(36).',
            stepByStepSolution: 'Bước 1: Quan sát phần thập phân lặp lại: 36, 36, 36...\nBước 2: Chu kì lặp lại là 36.\nBước 3: Viết gọn dưới dạng 0,(36).',
            explanation: 'Số 0,363636... có chu kì là 36, kí hiệu là 0,(36).',
            pointsXP: 20
          },
          {
            id: 'q5-2',
            lessonId: 'c2-l5',
            type: 'fill_in_blank',
            category: 'Đổi phân số sang thập phân',
            difficulty: 'Cơ bản',
            prompt: 'Viết phân số 5/3 dưới dạng số thập phân vô hạn tuần hoàn thu gọn (dùng dấu ngoặc đơn quanh chu kì, ví dụ 1,(6)):',
            correctAnswer: '1,(6)',
            adminHint: '5 : 3 = 1,666... = 1,(6).',
            stepByStepSolution: 'Bước 1: Thực hiện phép chia 5 cho 3: 5 = 3 · 1 + 2, 20:3 = 6 dư 2 lặp lại.\nBước 2: Kết quả là 1,666...\nBước 3: Viết thu gọn là 1,(6).',
            explanation: '5/3 = 1,666... = 1,(6).',
            pointsXP: 25
          },
          {
            id: 'q5-3',
            lessonId: 'c2-l5',
            type: 'multiple_choice',
            category: 'Làm tròn số',
            difficulty: 'Cơ bản',
            prompt: 'Làm tròn số 4,356 đến hàng phần mười (chữ số thập phân thứ nhất) được kết quả:',
            options: ['4,4', '4,3', '4,36', '4,0'],
            correctAnswer: '4,4',
            adminHint: 'Chữ số ngay sau hàng phần mười là 5 (≥ 5), nên tăng chữ số hàng phần mười lên 1: 3 + 1 = 4.',
            stepByStepSolution: 'Bước 1: Hàng phần mười là chữ số 3.\nBước 2: Chữ số ngay sau nó là 5 (≥ 5).\nBước 3: Làm tròn lên: 4,356 ≈ 4,4.',
            explanation: 'Chữ số ngay sau hàng phần mười là 5 nên làm tròn lên 4,4.',
            pointsXP: 20
          },
          {
            id: 'q5-4',
            lessonId: 'c2-l5',
            type: 'fill_in_blank',
            category: 'Phân số hữu hạn',
            difficulty: 'Trung bình',
            prompt: 'Viết phân số 7/5 dưới dạng số thập phân hữu hạn:',
            correctAnswer: '1,4',
            adminHint: '7 : 5 = 1,4.',
            stepByStepSolution: 'Bước 1: Chia 7 cho 5: 7 : 5 = 1,4.\nBước 2: Số thập phân hữu hạn thu được là 1,4.',
            explanation: '7/5 = 14/10 = 1,4.',
            pointsXP: 20
          }
        ,
          {
            id: 'q5-5',
            lessonId: 'c2-l5',
            type: 'fill_in_blank',
            category: 'Phân số sang số thập phân',
            difficulty: 'Cơ bản',
            prompt: 'Số thập phân vô hạn tuần hoàn 0,(3) được viết dưới dạng phân số tối giản là a/b. Giá trị của phân số đó là:',
            correctAnswer: '1/3',
            adminHint: '0,(3) = 3/9 = 1/3.',
            stepByStepSolution: 'Bước 1: Đặt x = 0,(3) => 10x = 3,(3).\nBước 2: Lấy 10x - x = 3 => 9x = 3.\nBước 3: Rút gọn: x = 3/9 = 1/3.',
            explanation: '0,(3) = 1/3.',
            pointsXP: 25
          }
        ,
          {
            id: 'q5-5',
            lessonId: 'c2-l5',
            type: 'fill_in_blank',
            category: 'Phân số sang số thập phân',
            difficulty: 'Cơ bản',
            prompt: 'Số thập phân vô hạn tuần hoàn 0,(3) được viết dưới dạng phân số tối giản là a/b. Giá trị của phân số đó là:',
            correctAnswer: '1/3',
            adminHint: '0,(3) = 3/9 = 1/3.',
            stepByStepSolution: 'Bước 1: Đặt x = 0,(3) => 10x = 3,(3).\nBước 2: Lấy 10x - x = 3 => 9x = 3.\nBước 3: Rút gọn: x = 3/9 = 1/3.',
            explanation: '0,(3) = 1/3.',
            pointsXP: 25
          }
        ]
      },
      {
        id: 'c2-l6',
        chapterId: 'ch-2',
        number: 6,
        title: 'Số vô tỉ và căn bậc hai số học',
        description: 'Số vô tỉ I, khái niệm căn bậc hai số học của một số không âm.',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Số vô tỉ là số viết được dưới dạng số thập phân vô hạn không tuần hoàn. Tập hợp số vô tỉ kí hiệu là 𝕀.',
            'Căn bậc hai số học của số a không âm (a ≥ 0) là số x không âm sao cho x^2 = a, kí hiệu là √a.',
            'Mỗi số dương a có đúng một căn bậc hai số học là √a. Số 0 có căn bậc hai số học là 0 (√0 = 0).'
          ],
          formulaSummary: [
            'x = √a <=> x ≥ 0 và x^2 = a',
            '(√a)^2 = a (với a ≥ 0)'
          ],
          rules: ['Không có căn bậc hai số học của một số âm trong tập số thực.'],
          commonMistakes: ['Nghĩ rằng √49 = ±7 (thực tế căn bậc hai số học chỉ lấy giá trị dương: √49 = 7).']
        },
        examples: [
          {
            title: 'Ví dụ: Tính căn bậc hai số học',
            problem: 'Tính: √36; √81; √(1/4)',
            steps: [
              { stepNumber: 1, instruction: 'Vì 6^2 = 36 và 6 > 0', formula: '√36 = 6' },
              { stepNumber: 2, instruction: 'Vì 9^2 = 81 và 9 > 0', formula: '√81 = 9' },
              { stepNumber: 3, instruction: 'Vì (1/2)^2 = 1/4', formula: '√(1/4) = 1/2' }
            ]
          }
        ],
        questions: [
          {
            id: 'q6-1',
            lessonId: 'c2-l6',
            type: 'fill_in_blank',
            category: 'Căn bậc hai',
            difficulty: 'Cơ bản',
            prompt: 'Tính giá trị của căn bậc hai số học: √49:',
            correctAnswer: '7',
            adminHint: 'Tìm số không âm x sao cho x^2 = 49. Vì 7^2 = 49 nên √49 = 7.',
            stepByStepSolution: 'Bước 1: Xét số 7 không âm.\nBước 2: Ta có 7^2 = 49.\nBước 3: Do đó √49 = 7.',
            explanation: 'Căn bậc hai số học của 49 là 7 vì 7 > 0 và 7^2 = 49.',
            pointsXP: 20
          },
          {
            id: 'q6-2',
            lessonId: 'c2-l6',
            type: 'multiple_choice',
            category: 'Nhận biết số vô tỉ',
            difficulty: 'Cơ bản',
            prompt: 'Số nào sau đây là số VÔ TỈ?',
            options: ['√2', '√4', '3/5', '-0,25'],
            correctAnswer: '√2',
            adminHint: '√2 ≈ 1,41421356... là số thập phân vô hạn không tuần hoàn, không viết được dưới dạng phân số.',
            stepByStepSolution: 'Bước 1: √4 = 2 ∈ ℚ.\nBước 2: 3/5 ∈ ℚ và -0,25 = -1/4 ∈ ℚ.\nBước 3: √2 là số thập phân vô hạn không tuần hoàn nên √2 là số vô tỉ.',
            explanation: '√2 là số vô tỉ vì phần thập phân của nó kéo dài vô hạn không tuần hoàn.',
            pointsXP: 20
          },
          {
            id: 'q6-3',
            lessonId: 'c2-l6',
            type: 'fill_in_blank',
            category: 'Căn bậc hai',
            difficulty: 'Trung bình',
            prompt: 'Tính giá trị của biểu thức: √121 - √64:',
            correctAnswer: '3',
            adminHint: '√121 = 11, √64 = 8. Lấy 11 - 8 = 3.',
            stepByStepSolution: 'Bước 1: Vì 11^2 = 121 nên √121 = 11.\nBước 2: Vì 8^2 = 64 nên √64 = 8.\nBước 3: 11 - 8 = 3.',
            explanation: '√121 - √64 = 11 - 8 = 3.',
            pointsXP: 25
          },
          {
            id: 'q6-4',
            lessonId: 'c2-l6',
            type: 'multiple_choice',
            category: 'So sánh căn',
            difficulty: 'Trung bình',
            prompt: 'So sánh: 3 và √10. Khẳng định nào đúng?',
            options: ['3 < √10', '3 > √10', '3 = √10', 'Không so sánh được'],
            correctAnswer: '3 < √10',
            adminHint: 'Viết 3 = √9. Vì 9 < 10 nên √9 < √10, do đó 3 < √10.',
            stepByStepSolution: 'Bước 1: Ta có 3 = √9.\nBước 2: Vì 9 < 10 nên √9 < √10.\nBước 3: Vậy 3 < √10.',
            explanation: '3 = √9 < √10.',
            pointsXP: 20
          }
        ,
          {
            id: 'q6-5',
            lessonId: 'c2-l6',
            type: 'fill_in_blank',
            category: 'Căn bậc hai số học',
            difficulty: 'Cơ bản',
            prompt: 'Căn bậc hai số học của số 144 là (nhập số nguyên):',
            correctAnswer: '12',
            adminHint: 'Vì 12 > 0 và 12^2 = 144 nên √144 = 12.',
            stepByStepSolution: 'Bước 1: Ta có 12^2 = 144 và 12 ≥ 0.\nBước 2: Theo định nghĩa căn bậc hai số học, √144 = 12.',
            explanation: 'Căn bậc hai số học của 144 là 12.',
            pointsXP: 20
          }
        ,
          {
            id: 'q6-5',
            lessonId: 'c2-l6',
            type: 'fill_in_blank',
            category: 'Căn bậc hai số học',
            difficulty: 'Cơ bản',
            prompt: 'Căn bậc hai số học của số 144 là (nhập số nguyên):',
            correctAnswer: '12',
            adminHint: 'Vì 12 > 0 và 12^2 = 144 nên √144 = 12.',
            stepByStepSolution: 'Bước 1: Ta có 12^2 = 144 và 12 ≥ 0.\nBước 2: Theo định nghĩa căn bậc hai số học, √144 = 12.',
            explanation: 'Căn bậc hai số học của 144 là 12.',
            pointsXP: 20
          }
        ]
      },
      {
        id: 'c2-l7',
        chapterId: 'ch-2',
        number: 7,
        title: 'Tập hợp các số thực và giá trị tuyệt đối',
        description: 'Tập hợp số thực ℝ = ℚ ∪ 𝕀, trục số thực, giá trị tuyệt đối |x| của một số thực.',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Số hữu tỉ và số vô tỉ gọi chung là số thực. Tập hợp số thực kí hiệu là ℝ.',
            'Mỗi số thực được biểu diễn bởi một điểm trên trục số. Ngược lại, mỗi điểm trên trục số đều biểu diễn một số thực.',
            'Giá trị tuyệt đối của số thực x, kí hiệu |x|, là khoảng cách từ điểm x đến gốc 0 trên trục số: |x| = x nếu x ≥ 0; |x| = -x nếu x < 0.'
          ],
          formulaSummary: [
            'ℝ = ℚ ∪ 𝕀',
            '|x| ≥ 0 với mọi x ∈ ℝ; |-x| = |x|'
          ],
          rules: ['Nếu |x| = a (a > 0) thì x = a hoặc x = -a.'],
          commonMistakes: ['Cho rằng |-3,5| = -3,5 (giá trị tuyệt đối của mọi số luôn không âm).']
        },
        examples: [
          {
            title: 'Ví dụ: Tính giá trị tuyệt đối',
            problem: 'Tính: |-3,5|; |0|; |√2|',
            steps: [
              { stepNumber: 1, instruction: 'Vì -3,5 < 0 nên |-3,5| = -(-3,5)', formula: '|-3,5| = 3,5' },
              { stepNumber: 2, instruction: 'Khoảng cách từ 0 đến 0', formula: '|0| = 0' },
              { stepNumber: 3, instruction: 'Vì √2 > 0 nên giữ nguyên', formula: '|√2| = √2' }
            ]
          }
        ],
        questions: [
          {
            id: 'q7-1',
            lessonId: 'c2-l7',
            type: 'fill_in_blank',
            category: 'Giá trị tuyệt đối',
            difficulty: 'Cơ bản',
            prompt: 'Tính giá trị của |-3,5|:',
            correctAnswer: '3,5',
            adminHint: 'Khoảng cách từ -3,5 đến 0 trên trục số là 3,5 đơn vị. Giá trị tuyệt đối luôn ≥ 0.',
            stepByStepSolution: 'Bước 1: Vì -3,5 < 0 nên theo định nghĩa |-3,5| = -(-3,5).\nBước 2: Kết quả là 3,5.',
            explanation: '|-3,5| = 3,5.',
            pointsXP: 20
          },
          {
            id: 'q7-2',
            lessonId: 'c2-l7',
            type: 'multiple_choice',
            category: 'Tập hợp số',
            difficulty: 'Cơ bản',
            prompt: 'Quan hệ bao hàm nào sau đây là ĐÚNG giữa các tập hợp số?',
            options: [
              'ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ',
              'ℝ ⊂ ℚ ⊂ ℤ ⊂ ℕ',
              'ℤ ⊂ ℕ ⊂ ℚ ⊂ ℝ',
              'ℚ ⊂ ℤ ⊂ ℕ ⊂ ℝ'
            ],
            correctAnswer: 'ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ',
            adminHint: 'Tự nhiên (ℕ) là con của Nguyên (ℤ), Nguyên là con của Hữu tỉ (ℚ), Hữu tỉ là con của Thực (ℝ).',
            stepByStepSolution: 'Bước 1: Mọi số tự nhiên đều là số nguyên: ℕ ⊂ ℤ.\nBước 2: Mọi số nguyên đều là số hữu tỉ: ℤ ⊂ ℚ.\nBước 3: Mọi số hữu tỉ đều là số thực: ℚ ⊂ ℝ.\nBước 4: Do đó ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ.',
            explanation: 'ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ là quan hệ bao hàm chuẩn xác.',
            pointsXP: 20
          },
          {
            id: 'q7-3',
            lessonId: 'c2-l7',
            type: 'multiple_choice',
            category: 'Tìm x',
            difficulty: 'Trung bình',
            prompt: 'Tìm tất cả các giá trị của x thỏa mãn: |x| = 2,5',
            options: [
              'x = 2,5 hoặc x = -2,5',
              'x = 2,5',
              'x = -2,5',
              'x = 5'
            ],
            correctAnswer: 'x = 2,5 hoặc x = -2,5',
            adminHint: 'Có hai điểm trên trục số cách gốc 0 một khoảng 2,5 đơn vị là 2,5 và -2,5.',
            stepByStepSolution: 'Bước 1: Phương trình |x| = a (a > 0) có 2 nghiệm: x = a hoặc x = -a.\nBước 2: Ở đây a = 2,5 nên x = 2,5 hoặc x = -2,5.',
            explanation: '|x| = 2,5 => x = 2,5 hoặc x = -2,5.',
            pointsXP: 25
          },
          {
            id: 'q7-4',
            lessonId: 'c2-l7',
            type: 'fill_in_blank',
            category: 'Tính toán giá trị tuyệt đối',
            difficulty: 'Trung bình',
            prompt: 'Tính giá trị của biểu thức: |-15| - |7| + |-2|:',
            correctAnswer: '10',
            adminHint: '|-15| = 15; |7| = 7; |-2| = 2. Tính: 15 - 7 + 2 = 10.',
            stepByStepSolution: 'Bước 1: |-15| = 15; |7| = 7; |-2| = 2.\nBước 2: Thực hiện phép tính: 15 - 7 + 2 = 8 + 2 = 10.',
            explanation: '15 - 7 + 2 = 10.',
            pointsXP: 25
          }
        ,
          {
            id: 'q7-5',
            lessonId: 'c2-l7',
            type: 'multiple_choice',
            category: 'Giá trị tuyệt đối',
            difficulty: 'Cơ bản',
            prompt: 'Tìm tất cả các giá trị của x thỏa mãn |x| = 7:',
            options: ['x = 7 hoặc x = -7', 'x = 7', 'x = -7', 'x = 49'],
            correctAnswer: 'x = 7 hoặc x = -7',
            adminHint: 'Giá trị tuyệt đối của hai số đối nhau là bằng nhau (|7| = |-7| = 7).',
            stepByStepSolution: 'Bước 1: Định nghĩa giá trị tuyệt đối |x| = a (với a > 0) thì x = a hoặc x = -a.\nBước 2: Với a = 7, ta có x = 7 hoặc x = -7.',
            explanation: 'Có hai giá trị thỏa mãn là x = 7 hoặc x = -7.',
            pointsXP: 20
          }
        ,
          {
            id: 'q7-5',
            lessonId: 'c2-l7',
            type: 'multiple_choice',
            category: 'Giá trị tuyệt đối',
            difficulty: 'Cơ bản',
            prompt: 'Tìm tất cả các giá trị của x thỏa mãn |x| = 7:',
            options: ['x = 7 hoặc x = -7', 'x = 7', 'x = -7', 'x = 49'],
            correctAnswer: 'x = 7 hoặc x = -7',
            adminHint: 'Giá trị tuyệt đối của hai số đối nhau là bằng nhau (|7| = |-7| = 7).',
            stepByStepSolution: 'Bước 1: Định nghĩa giá trị tuyệt đối |x| = a (với a > 0) thì x = a hoặc x = -a.\nBước 2: Với a = 7, ta có x = 7 hoặc x = -7.',
            explanation: 'Có hai giá trị thỏa mãn là x = 7 hoặc x = -7.',
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
    code: 'Chương III',
    title: 'Góc và Đường Thẳng Song Song',
    description: 'Góc kề bù, góc đối đỉnh, tia phân giác, góc so le trong, đồng vị, tiên đề Euclid và định lý.',
    iconName: 'Compass',
    color: 'indigo',
    lessons: [
      {
        id: 'c3-l8',
        chapterId: 'ch-3',
        number: 8,
        title: 'Góc ở vị trí đặc biệt và tia phân giác',
        description: 'Hai góc kề bù, hai góc đối đỉnh và định nghĩa tính chất tia phân giác của một góc.',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Hai góc kề bù là hai góc vừa kề nhau vừa bù nhau, có tổng số đo bằng 180°.',
            'Hai góc đối đỉnh là hai góc mà mỗi cạnh của góc này là tia đối của một cạnh của góc kia. Hai góc đối đỉnh thì bằng nhau.',
            'Tia phân giác của một góc là tia nằm giữa hai cạnh của góc và tạo với hai cạnh ấy hai góc bằng nhau.'
          ],
          formulaSummary: [
            'Góc kề bù: ∠xOy + ∠yOz = 180°',
            'Góc đối đỉnh: ∠O1 = ∠O2',
            'Tia phân giác Ot của ∠xOy: ∠xOt = ∠tOy = 1/2 ∠xOy'
          ],
          rules: ['Khi hai đường thẳng cắt nhau tạo thành 4 góc, các cặp góc đối đỉnh thì bằng nhau.'],
          commonMistakes: ['Nhầm hai góc có tổng bằng 180° là kề bù dù không có cạnh chung.']
        },
        examples: [
          {
            title: 'Ví dụ: Tính góc kề bù',
            problem: 'Cho hai góc kề bù xOy và yOz. Biết ∠yOz = 100°. Tính số đo góc xOy.',
            steps: [
              { stepNumber: 1, instruction: 'Vì xOy và yOz kề bù nên tổng bằng 180°', formula: '∠xOy + ∠yOz = 180°' },
              { stepNumber: 2, instruction: 'Thay số đo ∠yOz = 100°', formula: '∠xOy = 180° - 100° = 80°' }
            ]
          }
        ],
        questions: [
          {
            id: 'q8-1',
            lessonId: 'c3-l8',
            type: 'fill_in_blank',
            category: 'Góc kề bù',
            difficulty: 'Cơ bản',
            prompt: 'Cho hai góc kề bù xOy và yOz. Biết góc yOz = 100°. Tính số đo góc xOy (chỉ nhập số đo độ, ví dụ 80 hoặc 80°):',
            correctAnswer: '80',
            adminHint: 'Hai góc kề bù có tổng số đo là 180°. Lấy 180° - 100° = 80°.',
            stepByStepSolution: 'Bước 1: Vì xOy và yOz kề bù nên: ∠xOy + ∠yOz = 180°.\nBước 2: Thay số: ∠xOy + 100° = 180°.\nBước 3: ∠xOy = 180° - 100° = 80°.',
            explanation: 'Góc xOy = 180° - 100° = 80°.',
            pointsXP: 20
          },
          {
            id: 'q8-2',
            lessonId: 'c3-l8',
            type: 'multiple_choice',
            category: 'Góc đối đỉnh',
            difficulty: 'Cơ bản',
            prompt: 'Hai đường thẳng xx’ và yy’ cắt nhau tại O tạo thành góc xOy = 60°. Góc đối đỉnh với góc xOy có số đo là:',
            options: ['60°', '120°', '180°', '30°'],
            correctAnswer: '60°',
            adminHint: 'Tính chất: Hai góc đối đỉnh thì bằng nhau.',
            stepByStepSolution: 'Bước 1: Góc đối đỉnh với xOy là x’Oy’.\nBước 2: Hai góc đối đỉnh thì có số đo bằng nhau.\nBước 3: Do đó ∠x’Oy’ = ∠xOy = 60°.',
            explanation: 'Hai góc đối đỉnh thì bằng nhau nên có số đo là 60°.',
            pointsXP: 20
          },
          {
            id: 'q8-3',
            lessonId: 'c3-l8',
            type: 'fill_in_blank',
            category: 'Tia phân giác',
            difficulty: 'Cơ bản',
            prompt: 'Tia Ot là tia phân giác của góc xOy có số đo 70°. Tính số đo góc xOt (nhập số đo độ):',
            correctAnswer: '35',
            adminHint: 'Tia phân giác chia đôi góc: 70° : 2 = 35°.',
            stepByStepSolution: 'Bước 1: Ot là phân giác của góc xOy nên ∠xOt = ∠xOy / 2.\nBước 2: ∠xOt = 70° / 2 = 35°.',
            explanation: 'Tia phân giác chia góc 70° thành hai góc bằng nhau, mỗi góc 35°.',
            pointsXP: 20
          },
          {
            id: 'q8-4',
            lessonId: 'c3-l8',
            type: 'multiple_choice',
            category: 'Tính góc',
            difficulty: 'Trung bình',
            prompt: 'Cho hai góc kề bù aOb và bOc biết ∠aOb = 2 · ∠bOc. Số đo góc bOc là:',
            options: ['60°', '120°', '90°', '45°'],
            correctAnswer: '60°',
            adminHint: '∠aOb + ∠bOc = 180° <=> 2·∠bOc + ∠bOc = 180° <=> 3·∠bOc = 180°.',
            stepByStepSolution: 'Bước 1: Đặt số đo góc bOc là x, khi đó ∠aOb = 2x.\nBước 2: Vì hai góc kề bù nên: 2x + x = 180° <=> 3x = 180°.\nBước 3: x = 180° / 3 = 60°.',
            explanation: 'Góc bOc = 180° / 3 = 60°.',
            pointsXP: 25
          }
        ,
          {
            id: 'q8-5',
            lessonId: 'c3-l8',
            type: 'fill_in_blank',
            category: 'Tia phân giác góc vuông',
            difficulty: 'Cơ bản',
            prompt: 'Tia Oz là tia phân giác của góc vuông xOy (có số đo 90°). Số đo góc xOz là bao nhiêu độ (chỉ điền số):',
            correctAnswer: '45',
            adminHint: 'Góc vuông 90° chia 2 = 45°.',
            stepByStepSolution: 'Bước 1: Góc vuông có số đo 90°.\nBước 2: Tia phân giác chia đôi góc: 90° : 2 = 45°.',
            explanation: 'Số đo góc xOz = 45°.',
            pointsXP: 20
          }
        ,
          {
            id: 'q8-5',
            lessonId: 'c3-l8',
            type: 'fill_in_blank',
            category: 'Tia phân giác góc vuông',
            difficulty: 'Cơ bản',
            prompt: 'Tia Oz là tia phân giác của góc vuông xOy (có số đo 90°). Số đo góc xOz là bao nhiêu độ (chỉ điền số):',
            correctAnswer: '45',
            adminHint: 'Góc vuông 90° chia 2 = 45°.',
            stepByStepSolution: 'Bước 1: Góc vuông có số đo 90°.\nBước 2: Tia phân giác chia đôi góc: 90° : 2 = 45°.',
            explanation: 'Số đo góc xOz = 45°.',
            pointsXP: 20
          }
        ]
      },
      {
        id: 'c3-l9',
        chapterId: 'ch-3',
        number: 9,
        title: 'Hai đường thẳng song song và dấu hiệu nhận biết',
        description: 'Các cặp góc so le trong, đồng vị và dấu hiệu nhận biết hai đường thẳng song song.',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Nếu đường thẳng c cắt hai đường thẳng phân biệt a, b và trong các góc tạo thành có một cặp góc so le trong bằng nhau thì a // b.',
            'Nếu có một cặp góc đồng vị bằng nhau thì a // b.',
            'Nếu có một cặp góc trong cùng phía bù nhau (tổng bằng 180°) thì a // b.'
          ],
          formulaSummary: [
            '∠A1 = ∠B3 (so le trong) => a // b',
            '∠A1 = ∠B1 (đồng vị) => a // b'
          ],
          rules: ['Hai đường thẳng cùng vuông góc với một đường thẳng thứ ba thì song song với nhau.'],
          commonMistakes: ['Xác định nhầm cặp góc so le trong với cặp góc trong cùng phía.']
        },
        examples: [
          {
            title: 'Ví dụ: Dấu hiệu nhận biết song song',
            problem: 'Cho hình vẽ có ∠A1 = 50° và ∠B1 = 50° ở vị trí so le trong. Chứng minh a // b.',
            steps: [
              { stepNumber: 1, instruction: 'Nhận xét hai góc ∠A1 và ∠B1 nằm ở vị trí so le trong', formula: '∠A1 = ∠B1 = 50°' },
              { stepNumber: 2, instruction: 'Kết luận theo dấu hiệu nhận biết song song', formula: 'a // b' }
            ]
          }
        ],
        questions: [
          {
            id: 'q9-1',
            lessonId: 'c3-l9',
            type: 'multiple_choice',
            category: 'Dấu hiệu nhận biết',
            difficulty: 'Cơ bản',
            prompt: 'Đường thẳng c cắt hai đường thẳng a và b. Điều kiện nào sau đây chứng tỏ a song song với b?',
            options: [
              'Một cặp góc so le trong bằng nhau',
              'Một cặp góc trong cùng phía bằng nhau',
              'Hai góc đối đỉnh bằng nhau',
              'Một cặp góc kề bù bằng nhau'
            ],
            correctAnswer: 'Một cặp góc so le trong bằng nhau',
            adminHint: 'Dấu hiệu nhận biết: một cặp góc so le trong bằng nhau hoặc đồng vị bằng nhau.',
            stepByStepSolution: 'Bước 1: Xem lại dấu hiệu nhận biết hai đường thẳng song song.\nBước 2: Nếu đường thẳng c cắt a và b tạo ra một cặp góc so le trong bằng nhau (hoặc đồng vị bằng nhau) thì a // b.',
            explanation: 'Một cặp góc so le trong bằng nhau là dấu hiệu nhận biết hai đường thẳng song song.',
            pointsXP: 20
          },
          {
            id: 'q9-2',
            lessonId: 'c3-l9',
            type: 'fill_in_blank',
            category: 'Tính góc',
            difficulty: 'Cơ bản',
            prompt: 'Cho a // b bị cắt bởi đường thẳng c. Biết một góc so le trong có số đo 55°. Góc so le trong còn lại có số đo là bao nhiêu độ (nhập số nguyên):',
            correctAnswer: '55',
            adminHint: 'Tính chất hai đường thẳng song song: Các góc so le trong thì bằng nhau.',
            stepByStepSolution: 'Bước 1: Vì a // b nên các cặp góc so le trong bằng nhau.\nBước 2: Góc so le trong đã cho là 55°, nên góc so le trong còn lại cũng bằng 55°.',
            explanation: 'Hai góc so le trong bằng nhau nên có số đo là 55°.',
            pointsXP: 20
          },
          {
            id: 'q9-3',
            lessonId: 'c3-l9',
            type: 'multiple_choice',
            category: 'Góc trong cùng phía',
            difficulty: 'Trung bình',
            prompt: 'Cho a // b. Biết một góc trong cùng phía bằng 110°. Góc trong cùng phía còn lại có số đo là:',
            options: ['70°', '110°', '90°', '180°'],
            correctAnswer: '70°',
            adminHint: 'Hai góc trong cùng phía của hai đường thẳng song song thì bù nhau: tổng bằng 180°.',
            stepByStepSolution: 'Bước 1: Vì a // b nên hai góc trong cùng phía bù nhau: tổng bằng 180°.\nBước 2: Góc còn lại = 180° - 110° = 70°.',
            explanation: 'Hai góc trong cùng phía bù nhau: 180° - 110° = 70°.',
            pointsXP: 25
          }
        ,
          {
            id: 'q9-4',
            lessonId: 'c3-l9',
            type: 'fill_in_blank',
            category: 'Góc so le trong và đồng vị',
            difficulty: 'Cơ bản',
            prompt: 'Một đường thẳng c cắt hai đường thẳng song song a và b. Nếu một góc so le trong có số đo 55° thì góc đồng vị tương ứng có số đo là bao nhiêu độ (chỉ điền số):',
            correctAnswer: '55',
            adminHint: 'Nếu hai đường thẳng song song thì các cặp góc so le trong bằng nhau và các cặp góc đồng vị cũng bằng nhau.',
            stepByStepSolution: 'Bước 1: Khi hai đường thẳng song song, các góc so le trong và các góc đồng vị đều có số đo bằng nhau.\nBước 2: Do đó góc đồng vị = góc so le trong = 55°.',
            explanation: 'Góc đồng vị có số đo 55°.',
            pointsXP: 20
          },
          {
            id: 'q9-5',
            lessonId: 'c3-l9',
            type: 'multiple_choice',
            category: 'Góc trong cùng phía',
            difficulty: 'Cơ bản',
            prompt: 'Nếu một đường thẳng cắt hai đường thẳng song song thì hai góc trong cùng phía:',
            options: ['Bù nhau (tổng bằng 180°)', 'Bằng nhau', 'Phụ nhau (tổng bằng 90°)', 'Kề nhau'],
            correctAnswer: 'Bù nhau (tổng bằng 180°)',
            adminHint: 'Tính chất hai đường thẳng song song: hai góc trong cùng phía bù nhau (tổng số đo bằng 180°).',
            stepByStepSolution: 'Bước 1: Nhớ lại định lí hai đường thẳng song song: hai góc so le trong bằng nhau, hai góc đồng vị bằng nhau, hai góc trong cùng phía bù nhau.\nBước 2: Bù nhau nghĩa là tổng bằng 180°.',
            explanation: 'Hai góc trong cùng phía bù nhau (tổng bằng 180°).',
            pointsXP: 20
          }
        ,
          {
            id: 'q9-4',
            lessonId: 'c3-l9',
            type: 'fill_in_blank',
            category: 'Góc so le trong và đồng vị',
            difficulty: 'Cơ bản',
            prompt: 'Một đường thẳng c cắt hai đường thẳng song song a và b. Nếu một góc so le trong có số đo 55° thì góc đồng vị tương ứng có số đo là bao nhiêu độ (chỉ điền số):',
            correctAnswer: '55',
            adminHint: 'Nếu hai đường thẳng song song thì các cặp góc so le trong bằng nhau và các cặp góc đồng vị cũng bằng nhau.',
            stepByStepSolution: 'Bước 1: Khi hai đường thẳng song song, các góc so le trong và các góc đồng vị đều có số đo bằng nhau.\nBước 2: Do đó góc đồng vị = góc so le trong = 55°.',
            explanation: 'Góc đồng vị có số đo 55°.',
            pointsXP: 20
          },
          {
            id: 'q9-5',
            lessonId: 'c3-l9',
            type: 'multiple_choice',
            category: 'Góc trong cùng phía',
            difficulty: 'Cơ bản',
            prompt: 'Nếu một đường thẳng cắt hai đường thẳng song song thì hai góc trong cùng phía:',
            options: ['Bù nhau (tổng bằng 180°)', 'Bằng nhau', 'Phụ nhau (tổng bằng 90°)', 'Kề nhau'],
            correctAnswer: 'Bù nhau (tổng bằng 180°)',
            adminHint: 'Tính chất hai đường thẳng song song: hai góc trong cùng phía bù nhau (tổng số đo bằng 180°).',
            stepByStepSolution: 'Bước 1: Nhớ lại định lí hai đường thẳng song song: hai góc so le trong bằng nhau, hai góc đồng vị bằng nhau, hai góc trong cùng phía bù nhau.\nBước 2: Bù nhau nghĩa là tổng bằng 180°.',
            explanation: 'Hai góc trong cùng phía bù nhau (tổng bằng 180°).',
            pointsXP: 20
          }
        ]
      },
      {
        id: 'c3-l10',
        chapterId: 'ch-3',
        number: 10,
        title: 'Tiên đề Euclid. Tính chất của hai đường thẳng song song',
        description: 'Nội dung tiên đề Euclid về đường thẳng song song, tính chất từ vuông góc đến song song và tính chất ba đường thẳng song song.',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Tiên đề Euclid: Qua một điểm ở ngoài một đường thẳng, chỉ có một đường thẳng song song với đường thẳng đó.',
            'Tính chất 1: Hai đường thẳng phân biệt cùng song song với một đường thẳng thứ ba thì chúng song song với nhau (a // c và b // c => a // b).',
            'Tính chất 2: Một đường thẳng vuông góc với một trong hai đường thẳng song song thì nó cũng vuông góc với đường thẳng kia (a // b, c ⊥ a => c ⊥ b).'
          ],
          formulaSummary: [
            'a // c và b // c => a // b',
            'a // b và c ⊥ a => c ⊥ b'
          ],
          rules: ['Qua điểm A ngoài đường thẳng d, chỉ vẽ được duy nhất 1 đường thẳng song song với d.'],
          commonMistakes: ['Nghĩ rằng qua một điểm ngoài đường thẳng có thể vẽ được vô số đường thẳng song song với đường thẳng đó.']
        },
        examples: [
          {
            title: 'Ví dụ: Từ vuông góc đến song song',
            problem: 'Cho a // b. Đường thẳng c vuông góc với a tại A. Hỏi c có vuông góc với b không? Vì sao?',
            steps: [
              { stepNumber: 1, instruction: 'Áp dụng tính chất quan hệ giữa tính vuông góc và tính song song', formula: 'a // b và c ⊥ a' },
              { stepNumber: 2, instruction: 'Kết luận', formula: 'c ⊥ b' }
            ]
          }
        ],
        questions: [
          {
            id: 'q10-1',
            lessonId: 'c3-l10',
            type: 'multiple_choice',
            category: 'Tiên đề Euclid',
            difficulty: 'Cơ bản',
            prompt: 'Theo Tiên đề Euclid, qua một điểm M nằm ngoài đường thẳng a:',
            options: [
              'Chỉ có duy nhất một đường thẳng song song với a',
              'Có ít nhất hai đường thẳng song song với a',
              'Có vô số đường thẳng song song với a',
              'Không có đường thẳng nào song song với a'
            ],
            correctAnswer: 'Chỉ có duy nhất một đường thẳng song song với a',
            adminHint: 'Tiên đề Euclid khẳng định tính duy nhất của đường thẳng song song đi qua một điểm ngoài đường thẳng.',
            stepByStepSolution: 'Bước 1: Nhớ lại nội dung Tiên đề Euclid.\nBước 2: Qua một điểm ở ngoài một đường thẳng, chỉ có MỘT đường thẳng song song với đường thẳng đó.',
            explanation: 'Theo Tiên đề Euclid: Qua một điểm ở ngoài một đường thẳng chỉ có duy nhất một đường thẳng song song với đường thẳng đó.',
            pointsXP: 20
          },
          {
            id: 'q10-2',
            lessonId: 'c3-l10',
            type: 'multiple_choice',
            category: 'Từ vuông góc đến song song',
            difficulty: 'Trung bình',
            prompt: 'Cho hai đường thẳng phân biệt a và b cùng vuông góc với đường thẳng d (a ⊥ d và b ⊥ d). Kết luận nào đúng?',
            options: [
              'a song song với b (a // b)',
              'a cắt b',
              'a trùng với b',
              'a vuông góc với b'
            ],
            correctAnswer: 'a song song với b (a // b)',
            adminHint: 'Tính chất: Hai đường thẳng phân biệt cùng vuông góc với một đường thẳng thứ ba thì song song với nhau.',
            stepByStepSolution: 'Bước 1: Xét đường thẳng d cắt a và b.\nBước 2: Vì a ⊥ d và b ⊥ d nên các góc đồng vị đều bằng 90° (bằng nhau).\nBước 3: Do đó a // b.',
            explanation: 'Hai đường thẳng phân biệt cùng vuông góc với đường thẳng thứ ba thì song song với nhau.',
            pointsXP: 25
          },
          {
            id: 'q10-3',
            lessonId: 'c3-l10',
            type: 'fill_in_blank',
            category: 'Tính góc',
            difficulty: 'Trung bình',
            prompt: 'Cho a // b, đường thẳng c cắt a tại A tạo góc 130°. Góc đồng vị với góc 130° tại điểm B trên đường thẳng b có số đo là bao nhiêu độ:',
            correctAnswer: '130',
            adminHint: 'Vì a // b nên các góc đồng vị bằng nhau.',
            stepByStepSolution: 'Bước 1: Do a // b nên hai góc đồng vị có số đo bằng nhau.\nBước 2: Góc tại A là 130°, nên góc đồng vị tại B cũng có số đo là 130°.',
            explanation: 'Hai góc đồng vị của hai đường thẳng song song thì bằng nhau: 130°.',
            pointsXP: 20
          }
        ,
          {
            id: 'q10-4',
            lessonId: 'c3-l10',
            type: 'multiple_choice',
            category: 'Tiên đề Euclid',
            difficulty: 'Cơ bản',
            prompt: 'Theo Tiên đề Euclid, qua một điểm A nằm ngoài đường thẳng d, có thể kẻ được bao nhiêu đường thẳng song song với d?',
            options: ['Duy nhất một đường thẳng', 'Vô số đường thẳng', 'Hai đường thẳng phân biệt', 'Không có đường thẳng nào'],
            correctAnswer: 'Duy nhất một đường thẳng',
            adminHint: 'Nội dung tiên đề Euclid: Qua một điểm nằm ngoài một đường thẳng, chỉ có duy nhất một đường thẳng song song với đường thẳng đó.',
            stepByStepSolution: 'Bước 1: Phát biểu tiên đề Euclid: Qua một điểm ở ngoài một đường thẳng chỉ có một đường thẳng song song với đường thẳng đó.',
            explanation: 'Chỉ có duy nhất một đường thẳng song song với d qua điểm A.',
            pointsXP: 20
          },
          {
            id: 'q10-5',
            lessonId: 'c3-l10',
            type: 'fill_in_blank',
            category: 'Tính chất bắc cầu song song',
            difficulty: 'Trung bình',
            prompt: 'Cho ba đường thẳng a, b, c phân biệt thỏa mãn a // b và b // c. Biết góc so le trong giữa a và một cát tuyến là 65°. Góc so le trong tương ứng giữa c và cát tuyến đó bằng bao nhiêu độ (chỉ điền số):',
            correctAnswer: '65',
            adminHint: 'Vì a // b và b // c nên a // c. Do đó góc so le trong cũng bằng 65°.',
            stepByStepSolution: 'Bước 1: Tính chất ba đường thẳng song song: hai đường thẳng cùng song song với đường thẳng thứ ba thì chúng song song với nhau (a // c).\nBước 2: Vì a // c nên cặp góc so le trong bằng nhau = 65°.',
            explanation: 'Góc so le trong tương ứng có số đo bằng 65°.',
            pointsXP: 25
          }
        ,
          {
            id: 'q10-4',
            lessonId: 'c3-l10',
            type: 'multiple_choice',
            category: 'Tiên đề Euclid',
            difficulty: 'Cơ bản',
            prompt: 'Theo Tiên đề Euclid, qua một điểm A nằm ngoài đường thẳng d, có thể kẻ được bao nhiêu đường thẳng song song với d?',
            options: ['Duy nhất một đường thẳng', 'Vô số đường thẳng', 'Hai đường thẳng phân biệt', 'Không có đường thẳng nào'],
            correctAnswer: 'Duy nhất một đường thẳng',
            adminHint: 'Nội dung tiên đề Euclid: Qua một điểm nằm ngoài một đường thẳng, chỉ có duy nhất một đường thẳng song song với đường thẳng đó.',
            stepByStepSolution: 'Bước 1: Phát biểu tiên đề Euclid: Qua một điểm ở ngoài một đường thẳng chỉ có một đường thẳng song song với đường thẳng đó.',
            explanation: 'Chỉ có duy nhất một đường thẳng song song với d qua điểm A.',
            pointsXP: 20
          },
          {
            id: 'q10-5',
            lessonId: 'c3-l10',
            type: 'fill_in_blank',
            category: 'Tính chất bắc cầu song song',
            difficulty: 'Trung bình',
            prompt: 'Cho ba đường thẳng a, b, c phân biệt thỏa mãn a // b và b // c. Biết góc so le trong giữa a và một cát tuyến là 65°. Góc so le trong tương ứng giữa c và cát tuyến đó bằng bao nhiêu độ (chỉ điền số):',
            correctAnswer: '65',
            adminHint: 'Vì a // b và b // c nên a // c. Do đó góc so le trong cũng bằng 65°.',
            stepByStepSolution: 'Bước 1: Tính chất ba đường thẳng song song: hai đường thẳng cùng song song với đường thẳng thứ ba thì chúng song song với nhau (a // c).\nBước 2: Vì a // c nên cặp góc so le trong bằng nhau = 65°.',
            explanation: 'Góc so le trong tương ứng có số đo bằng 65°.',
            pointsXP: 25
          }
        ]
      },
      {
        id: 'c3-l11',
        chapterId: 'ch-3',
        number: 11,
        title: 'Định lí và chứng minh một định lí',
        description: 'Cấu trúc của một định lí gồm Giả thiết (GT) và Kết luận (KL). Phương pháp dùng lập luận suy diễn để chứng minh định lí.',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Định lí là một khẳng định được coi là đúng thông qua lập luận suy diễn.',
            'Cấu trúc định lí gồm 2 phần: Giả thiết (GT) là điều cho biết trước; Kết luận (KL) là điều cần suy ra.',
            'Chứng minh định lí là dùng lập luận để từ giả thiết suy ra kết luận.'
          ],
          formulaSummary: [
            'Nếu [Giả thiết] thì [Kết luận]'
          ],
          rules: ['Trong định lí có dạng "Nếu... thì...", phần sau chữ "Nếu" là GT, phần sau chữ "thì" là KL.'],
          commonMistakes: ['Đảo ngược vị trí giữa Giả thiết và Kết luận.']
        },
        examples: [
          {
            title: 'Ví dụ: Xác định GT và KL của định lí',
            problem: 'Xác định GT và KL của định lí: "Nếu hai đường thẳng phân biệt cùng song song với một đường thẳng thứ ba thì chúng song song với nhau."',
            steps: [
              { stepNumber: 1, instruction: 'Giả thiết (phần sau chữ Nếu)', formula: 'GT: a // c và b // c (a, b phân biệt)' },
              { stepNumber: 2, instruction: 'Kết luận (phần sau chữ thì)', formula: 'KL: a // b' }
            ]
          }
        ],
        questions: [
          {
            id: 'q11-1',
            lessonId: 'c3-l11',
            type: 'multiple_choice',
            category: 'Cấu trúc định lí',
            difficulty: 'Cơ bản',
            prompt: 'Trong định lí "Nếu một đường thẳng cắt hai đường thẳng song song thì hai góc so le trong bằng nhau", phần Giả thiết (GT) là:',
            options: [
              'Một đường thẳng cắt hai đường thẳng song song',
              'Hai góc so le trong bằng nhau',
              'Hai đường thẳng song song',
              'Cả câu trên'
            ],
            correctAnswer: 'Một đường thẳng cắt hai đường thẳng song song',
            adminHint: 'Phần nằm giữa từ "Nếu" và từ "thì" chính là Giả thiết của định lí.',
            stepByStepSolution: 'Bước 1: Định lí có dạng "Nếu P thì Q".\nBước 2: P là Giả thiết, Q là Kết luận.\nBước 3: Sau chữ "Nếu" là "một đường thẳng cắt hai đường thẳng song song", đó là Giả thiết.',
            explanation: 'Phần sau từ "Nếu" là Giả thiết (GT) của định lí.',
            pointsXP: 20
          },
          {
            id: 'q11-2',
            lessonId: 'c3-l11',
            type: 'multiple_choice',
            category: 'Khái niệm định lí',
            difficulty: 'Cơ bản',
            prompt: 'Khẳng định nào sau đây là ĐÚNG về việc chứng minh định lí?',
            options: [
              'Chứng minh định lí là dùng lập luận suy diễn từ Giả thiết để suy ra Kết luận',
              'Chứng minh định lí là dùng thước đo kiểm tra thực tế',
              'Chỉ cần kiểm tra đúng cho 1 hình vẽ là định lí được chứng minh',
              'Không cần chứng minh vì định lí tự nhiên đúng'
            ],
            correctAnswer: 'Chứng minh định lí là dùng lập luận suy diễn từ Giả thiết để suy ra Kết luận',
            adminHint: 'Chứng minh là quá trình dùng các lập luận logic từ GT để khẳng định KL là đúng.',
            stepByStepSolution: 'Bước 1: Nhớ lại định nghĩa chứng minh định lí.\nBước 2: Phải dùng các định nghĩa, tiên đề, tính chất đã biết để lập luận suy diễn từ GT suy ra KL.',
            explanation: 'Chứng minh định lí là dùng lập luận logic suy diễn từ Giả thiết để suy ra Kết luận.',
            pointsXP: 20
          }
        ,
          {
            id: 'q11-3',
            lessonId: 'c3-l11',
            type: 'multiple_choice',
            category: 'Cấu trúc định lí',
            difficulty: 'Cơ bản',
            prompt: 'Trong một định lí toán học viết dưới dạng "Nếu ... thì ...", phần nằm sau từ "thì" là:',
            options: ['Kết luận (KL)', 'Giả thiết (GT)', 'Chứng minh', 'Hình vẽ minh họa'],
            correctAnswer: 'Kết luận (KL)',
            adminHint: 'Nếu [Giả thiết] thì [Kết luận].',
            stepByStepSolution: 'Bước 1: Một định lí gồm 2 phần:\n- Giả thiết: phần nằm sau từ "Nếu" và trước từ "thì".\n- Kết luận: phần nằm sau từ "thì".',
            explanation: 'Phần sau từ "thì" là Kết luận của định lí.',
            pointsXP: 20
          },
          {
            id: 'q11-4',
            lessonId: 'c3-l11',
            type: 'multiple_choice',
            category: 'Giả thiết - Kết luận',
            difficulty: 'Cơ bản',
            prompt: 'Cho định lí: "Hai góc cùng bù với một góc thứ ba thì bằng nhau". Giả thiết (GT) của định lí là gì?',
            options: ['Hai góc cùng bù với một góc thứ ba', 'Hai góc bằng nhau', 'Tổng số đo ba góc bằng 180°', 'Hai góc đối đỉnh'],
            correctAnswer: 'Hai góc cùng bù với một góc thứ ba',
            adminHint: 'Điều cho trước là "hai góc cùng bù với một góc thứ ba", điều được suy ra là "bằng nhau".',
            stepByStepSolution: 'Bước 1: Viết lại dưới dạng: Nếu hai góc cùng bù với góc thứ ba thì hai góc đó bằng nhau.\nBước 2: GT: Hai góc cùng bù với một góc thứ ba; KL: Chúng bằng nhau.',
            explanation: 'Giả thiết là điều kiện ban đầu cho trước: hai góc cùng bù với góc thứ ba.',
            pointsXP: 20
          },
          {
            id: 'q11-5',
            lessonId: 'c3-l11',
            type: 'fill_in_blank',
            category: 'Định lí vuông góc - song song',
            difficulty: 'Trung bình',
            prompt: 'Định lí: "Một đường thẳng vuông góc với một trong hai đường thẳng song song thì nó cũng vuông góc với đường thẳng kia". Góc tạo bởi đường thẳng đó với đường thẳng kia có số đo bằng bao nhiêu độ (chỉ điền số):',
            correctAnswer: '90',
            adminHint: 'Vuông góc nghĩa là tạo thành một góc 90°.',
            stepByStepSolution: 'Bước 1: Hai đường thẳng vuông góc với nhau tạo thành góc 90°.\nBước 2: Do đó góc tạo thành có số đo 90°.',
            explanation: 'Góc vuông có số đo 90°.',
            pointsXP: 25
          }
        ,
          {
            id: 'q11-3',
            lessonId: 'c3-l11',
            type: 'multiple_choice',
            category: 'Cấu trúc định lí',
            difficulty: 'Cơ bản',
            prompt: 'Trong một định lí toán học viết dưới dạng "Nếu ... thì ...", phần nằm sau từ "thì" là:',
            options: ['Kết luận (KL)', 'Giả thiết (GT)', 'Chứng minh', 'Hình vẽ minh họa'],
            correctAnswer: 'Kết luận (KL)',
            adminHint: 'Nếu [Giả thiết] thì [Kết luận].',
            stepByStepSolution: 'Bước 1: Một định lí gồm 2 phần:\n- Giả thiết: phần nằm sau từ "Nếu" và trước từ "thì".\n- Kết luận: phần nằm sau từ "thì".',
            explanation: 'Phần sau từ "thì" là Kết luận của định lí.',
            pointsXP: 20
          },
          {
            id: 'q11-4',
            lessonId: 'c3-l11',
            type: 'multiple_choice',
            category: 'Giả thiết - Kết luận',
            difficulty: 'Cơ bản',
            prompt: 'Cho định lí: "Hai góc cùng bù với một góc thứ ba thì bằng nhau". Giả thiết (GT) của định lí là gì?',
            options: ['Hai góc cùng bù với một góc thứ ba', 'Hai góc bằng nhau', 'Tổng số đo ba góc bằng 180°', 'Hai góc đối đỉnh'],
            correctAnswer: 'Hai góc cùng bù với một góc thứ ba',
            adminHint: 'Điều cho trước là "hai góc cùng bù với một góc thứ ba", điều được suy ra là "bằng nhau".',
            stepByStepSolution: 'Bước 1: Viết lại dưới dạng: Nếu hai góc cùng bù với góc thứ ba thì hai góc đó bằng nhau.\nBước 2: GT: Hai góc cùng bù với một góc thứ ba; KL: Chúng bằng nhau.',
            explanation: 'Giả thiết là điều kiện ban đầu cho trước: hai góc cùng bù với góc thứ ba.',
            pointsXP: 20
          },
          {
            id: 'q11-5',
            lessonId: 'c3-l11',
            type: 'fill_in_blank',
            category: 'Định lí vuông góc - song song',
            difficulty: 'Trung bình',
            prompt: 'Định lí: "Một đường thẳng vuông góc với một trong hai đường thẳng song song thì nó cũng vuông góc với đường thẳng kia". Góc tạo bởi đường thẳng đó với đường thẳng kia có số đo bằng bao nhiêu độ (chỉ điền số):',
            correctAnswer: '90',
            adminHint: 'Vuông góc nghĩa là tạo thành một góc 90°.',
            stepByStepSolution: 'Bước 1: Hai đường thẳng vuông góc với nhau tạo thành góc 90°.\nBước 2: Do đó góc tạo thành có số đo 90°.',
            explanation: 'Góc vuông có số đo 90°.',
            pointsXP: 25
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
    code: 'Chương IV',
    title: 'Tam Giác Bằng Nhau',
    description: 'Tổng 3 góc trong tam giác, các trường hợp bằng nhau c-c-c, c-g-c, g-c-g, tam giác vuông, tam giác cân và đường trung trực.',
    iconName: 'Triangle',
    color: 'amber',
    lessons: [
      {
        id: 'c4-l12',
        chapterId: 'ch-4',
        number: 12,
        title: 'Tổng các góc trong một tam giác',
        description: 'Định lí tổng 3 góc trong một tam giác bằng 180°, góc ngoài của tam giác.',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Định lí: Tổng ba góc trong một tam giác bằng 180°: ∠A + ∠B + ∠C = 180°.',
            'Trong tam giác vuông, hai góc nhọn phụ nhau (tổng bằng 90°).',
            'Góc ngoài của một tam giác là góc kề bù với một góc trong của tam giác đó. Số đo góc ngoài bằng tổng hai góc trong không kề với nó.'
          ],
          formulaSummary: [
            '∠A + ∠B + ∠C = 180°',
            'Góc ngoài: ∠ACx = ∠A + ∠B'
          ],
          rules: ['Trong tam giác vuông có một góc 90°, tổng hai góc nhọn còn lại luôn là 90°.'],
          commonMistakes: ['Quên rằng góc ngoài bằng TỔNG hai góc trong không kề nó.']
        },
        examples: [
          {
            title: 'Ví dụ: Tính góc trong tam giác',
            problem: 'Cho tam giác ABC có ∠A = 60°, ∠B = 70°. Tính số đo góc C.',
            steps: [
              { stepNumber: 1, instruction: 'Áp dụng định lí tổng 3 góc tam giác', formula: '∠A + ∠B + ∠C = 180°' },
              { stepNumber: 2, instruction: 'Tính số đo góc C', formula: '∠C = 180° - (60° + 70°) = 50°' }
            ]
          }
        ],
        questions: [
          {
            id: 'q12-1',
            lessonId: 'c4-l12',
            type: 'fill_in_blank',
            category: 'Tính góc',
            difficulty: 'Cơ bản',
            prompt: 'Cho tam giác ABC có góc A = 60°, góc B = 75°. Tính số đo góc C (nhập số đo độ):',
            correctAnswer: '45',
            adminHint: 'Tổng ba góc bằng 180°. Góc C = 180° - (60° + 75°) = 45°.',
            stepByStepSolution: 'Bước 1: Tổng ba góc trong tam giác ABC: ∠A + ∠B + ∠C = 180°.\nBước 2: Thay số: 60° + 75° + ∠C = 180° <=> 135° + ∠C = 180°.\nBước 3: ∠C = 180° - 135° = 45°.',
            explanation: 'Góc C = 180° - (60° + 75°) = 45°.',
            pointsXP: 20
          },
          {
            id: 'q12-2',
            lessonId: 'c4-l12',
            type: 'multiple_choice',
            category: 'Tam giác vuông',
            difficulty: 'Cơ bản',
            prompt: 'Cho tam giác DEF vuông tại D, có góc E = 35°. Số đo góc F là:',
            options: ['55°', '65°', '145°', '45°'],
            correctAnswer: '55°',
            adminHint: 'Trong tam giác vuông, hai góc nhọn phụ nhau: ∠F = 90° - ∠E = 90° - 35° = 55°.',
            stepByStepSolution: 'Bước 1: Tam giác DEF vuông tại D nên ∠E + ∠F = 90°.\nBước 2: Thay số: 35° + ∠F = 90°.\nBước 3: ∠F = 90° - 35° = 55°.',
            explanation: 'Trong tam giác vuông, hai góc nhọn phụ nhau nên góc F = 90° - 35° = 55°.',
            pointsXP: 20
          },
          {
            id: 'q12-3',
            lessonId: 'c4-l12',
            type: 'fill_in_blank',
            category: 'Góc ngoài tam giác',
            difficulty: 'Trung bình',
            prompt: 'Cho tam giác ABC có góc A = 50° và góc B = 65°. Số đo góc ngoài tại đỉnh C là bao nhiêu độ:',
            correctAnswer: '115',
            adminHint: 'Góc ngoài tại đỉnh C bằng tổng hai góc trong không kề: ∠A + ∠B = 50° + 65° = 115°.',
            stepByStepSolution: 'Bước 1: Áp dụng tính chất góc ngoài của tam giác: góc ngoài tại C = ∠A + ∠B.\nBước 2: Thay số: 50° + 65° = 115°.',
            explanation: 'Góc ngoài tại đỉnh C = 50° + 65° = 115°.',
            pointsXP: 25
          }
        ,
          {
            id: 'q12-4',
            lessonId: 'c4-l12',
            type: 'fill_in_blank',
            category: 'Góc trong tam giác vuông',
            difficulty: 'Cơ bản',
            prompt: 'Cho tam giác ABC vuông tại A có ∠B = 35°. Số đo của góc C là bao nhiêu độ (chỉ điền số):',
            correctAnswer: '55',
            adminHint: 'Trong tam giác vuông, hai góc nhọn phụ nhau: ∠B + ∠C = 90° => ∠C = 90° - 35° = 55°.',
            stepByStepSolution: 'Bước 1: Tam giác ABC vuông tại A nên ∠B + ∠C = 90°.\nBước 2: ∠C = 90° - ∠B = 90° - 35° = 55°.',
            explanation: 'Góc C = 90° - 35° = 55°.',
            pointsXP: 20
          },
          {
            id: 'q12-5',
            lessonId: 'c4-l12',
            type: 'multiple_choice',
            category: 'Góc ngoài của tam giác',
            difficulty: 'Trung bình',
            prompt: 'Mỗi góc ngoài của một tam giác có số đo bằng:',
            options: ['Tổng số đo hai góc trong không kề với nó', 'Tổng số đo ba góc trong của tam giác', 'Số đo góc trong kề bù với nó', 'Hiệu số đo hai góc trong không kề với nó'],
            correctAnswer: 'Tổng số đo hai góc trong không kề với nó',
            adminHint: 'Định lí góc ngoài tam giác: Góc ngoài tại một đỉnh bằng tổng hai góc trong không kề với đỉnh đó.',
            stepByStepSolution: 'Bước 1: Góc ngoài kề bù với góc trong tại đỉnh đó: ∠ngoài + ∠trong = 180°.\nBước 2: Mặt khác, tổng 3 góc trong = 180° => 2 góc trong còn lại + ∠trong = 180°.\nBước 3: Suy ra: ∠ngoài = tổng hai góc trong không kề với nó.',
            explanation: 'Mỗi góc ngoài bằng tổng hai góc trong không kề với nó.',
            pointsXP: 25
          }
        ,
          {
            id: 'q12-4',
            lessonId: 'c4-l12',
            type: 'fill_in_blank',
            category: 'Góc trong tam giác vuông',
            difficulty: 'Cơ bản',
            prompt: 'Cho tam giác ABC vuông tại A có ∠B = 35°. Số đo của góc C là bao nhiêu độ (chỉ điền số):',
            correctAnswer: '55',
            adminHint: 'Trong tam giác vuông, hai góc nhọn phụ nhau: ∠B + ∠C = 90° => ∠C = 90° - 35° = 55°.',
            stepByStepSolution: 'Bước 1: Tam giác ABC vuông tại A nên ∠B + ∠C = 90°.\nBước 2: ∠C = 90° - ∠B = 90° - 35° = 55°.',
            explanation: 'Góc C = 90° - 35° = 55°.',
            pointsXP: 20
          },
          {
            id: 'q12-5',
            lessonId: 'c4-l12',
            type: 'multiple_choice',
            category: 'Góc ngoài của tam giác',
            difficulty: 'Trung bình',
            prompt: 'Mỗi góc ngoài của một tam giác có số đo bằng:',
            options: ['Tổng số đo hai góc trong không kề với nó', 'Tổng số đo ba góc trong của tam giác', 'Số đo góc trong kề bù với nó', 'Hiệu số đo hai góc trong không kề với nó'],
            correctAnswer: 'Tổng số đo hai góc trong không kề với nó',
            adminHint: 'Định lí góc ngoài tam giác: Góc ngoài tại một đỉnh bằng tổng hai góc trong không kề với đỉnh đó.',
            stepByStepSolution: 'Bước 1: Góc ngoài kề bù với góc trong tại đỉnh đó: ∠ngoài + ∠trong = 180°.\nBước 2: Mặt khác, tổng 3 góc trong = 180° => 2 góc trong còn lại + ∠trong = 180°.\nBước 3: Suy ra: ∠ngoài = tổng hai góc trong không kề với nó.',
            explanation: 'Mỗi góc ngoài bằng tổng hai góc trong không kề với nó.',
            pointsXP: 25
          }
        ]
      },
      {
        id: 'c4-l13',
        chapterId: 'ch-4',
        number: 13,
        title: 'Hai tam giác bằng nhau. Trường hợp thứ nhất (c-c-c)',
        description: 'Định nghĩa hai tam giác bằng nhau và trường hợp bằng nhau thứ nhất Cạnh - Cạnh - Cạnh (c.c.c).',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Hai tam giác bằng nhau là hai tam giác có các cạnh tương ứng bằng nhau và các góc tương ứng bằng nhau.',
            'Trường hợp bằng nhau C.C.C: Nếu ba cạnh của tam giác này bằng ba cạnh của tam giác kia thì hai tam giác đó bằng nhau.'
          ],
          formulaSummary: [
            'AB = A’B’, AC = A’C’, BC = B’C’ => ΔABC = ΔA’B’C’ (c.c.c)'
          ],
          rules: ['Khi viết hai tam giác bằng nhau, phải viết các đỉnh tương ứng theo đúng thứ tự.'],
          commonMistakes: ['Viết sai thứ tự các đỉnh tương ứng (ví dụ: ΔABC = ΔB’A’C’).']
        },
        examples: [
          {
            title: 'Ví dụ: Chứng minh tam giác bằng nhau c.c.c',
            problem: 'Cho đoạn thẳng AB. Vẽ cung tròn tâm A bán kính R và cung tròn tâm B bán kính R cắt nhau tại C và D. Chứng minh ΔACD = ΔBCD.',
            steps: [
              { stepNumber: 1, instruction: 'Liệt kê các cặp cạnh bằng nhau', formula: 'AC = BC (= R) và AD = BD (= R)' },
              { stepNumber: 2, instruction: 'Cạnh chung', formula: 'CD là cạnh chung' },
              { stepNumber: 3, instruction: 'Kết luận', formula: 'ΔACD = ΔBCD (c.c.c)' }
            ]
          }
        ],
        questions: [
          {
            id: 'q13-1',
            lessonId: 'c4-l13',
            type: 'multiple_choice',
            category: 'Trường hợp c.c.c',
            difficulty: 'Cơ bản',
            prompt: 'Cho ΔABC = ΔMNP theo trường hợp cạnh - cạnh - cạnh (c.c.c). Khẳng định nào sau đây là ĐÚNG?',
            options: [
              'AB = MN, BC = NP, AC = MP',
              'AB = NP, BC = MN, AC = MP',
              'AB = MP, BC = NP, AC = MN',
              '∠A = ∠N'
            ],
            correctAnswer: 'AB = MN, BC = NP, AC = MP',
            adminHint: 'Các cạnh tương ứng theo thứ tự đỉnh: A tương ứng M, B tương ứng N, C tương ứng P.',
            stepByStepSolution: 'Bước 1: Từ ký hiệu ΔABC = ΔMNP ta có các đỉnh tương ứng: A <-> M, B <-> N, C <-> P.\nBước 2: Các cạnh tương ứng bằng nhau: AB = MN, BC = NP, AC = MP.',
            explanation: 'ΔABC = ΔMNP => AB = MN, BC = NP, AC = MP.',
            pointsXP: 20
          },
          {
            id: 'q13-2',
            lessonId: 'c4-l13',
            type: 'fill_in_blank',
            category: 'Tìm góc tương ứng',
            difficulty: 'Cơ bản',
            prompt: 'Cho ΔABC = ΔDEF. Biết góc A = 55°. Số đo góc D bằng bao nhiêu độ:',
            correctAnswer: '55',
            adminHint: 'Vì hai tam giác bằng nhau nên các góc tương ứng bằng nhau: ∠D = ∠A = 55°.',
            stepByStepSolution: 'Bước 1: Đỉnh A tương ứng với đỉnh D.\nBước 2: Vì ΔABC = ΔDEF nên góc D = góc A = 55°.',
            explanation: 'Góc D = góc A = 55° vì là hai góc tương ứng.',
            pointsXP: 20
          },
          {
            id: 'q13-3',
            lessonId: 'c4-l13',
            type: 'multiple_choice',
            category: 'Chứng minh c.c.c',
            difficulty: 'Trung bình',
            prompt: 'Cho tam giác ABC có AB = AC, gọi M là trung điểm của BC. Ta chứng minh được ΔABM = ΔACM theo trường hợp nào?',
            options: ['c.c.c', 'c.g.c', 'g.c.g', 'cạnh huyền - góc nhọn'],
            correctAnswer: 'c.c.c',
            adminHint: 'AB = AC (giả thiết), MB = MC (M là trung điểm), AM là cạnh chung => 3 cạnh bằng nhau (c.c.c).',
            stepByStepSolution: 'Bước 1: AB = AC (giả thiết).\nBước 2: MB = MC (do M là trung điểm BC).\nBước 3: AM là cạnh chung.\nBước 4: Do đó ΔABM = ΔACM (c.c.c).',
            explanation: 'ΔABM = ΔACM theo trường hợp c.c.c vì có 3 cạnh tương ứng bằng nhau.',
            pointsXP: 25
          }
        ,
          {
            id: 'q13-4',
            lessonId: 'c4-l13',
            type: 'fill_in_blank',
            category: 'Đỉnh và cạnh tương ứng',
            difficulty: 'Cơ bản',
            prompt: 'Cho ΔABC = ΔDEF. Biết AB = 5cm, BC = 7cm, AC = 6cm. Chu vi của tam giác DEF bằng bao nhiêu cm (chỉ điền số):',
            correctAnswer: '18',
            adminHint: 'Hai tam giác bằng nhau thì chu vi bằng nhau: 5 + 7 + 6 = 18 cm.',
            stepByStepSolution: 'Bước 1: Vì ΔABC = ΔDEF nên DE = AB = 5cm, EF = BC = 7cm, DF = AC = 6cm.\nBước 2: Chu vi ΔDEF = DE + EF + DF = 5 + 7 + 6 = 18 cm.',
            explanation: 'Chu vi tam giác DEF là 18 cm.',
            pointsXP: 20
          },
          {
            id: 'q13-5',
            lessonId: 'c4-l13',
            type: 'multiple_choice',
            category: 'Chứng minh tam giác bằng nhau c.c.c',
            difficulty: 'Trung bình',
            prompt: 'Cho tam giác ABC có AB = AC. Gọi M là trung điểm của đoạn thẳng BC. Yếu tố chung khi chứng minh ΔABM = ΔACM theo trường hợp c.c.c là:',
            options: ['Cạnh AM là cạnh chung', 'Cạnh BC là cạnh chung', 'Góc A là góc chung', 'Góc M bằng 90°'],
            correctAnswer: 'Cạnh AM là cạnh chung',
            adminHint: 'Xét ΔABM và ΔACM có: AB = AC (giả thiết), BM = CM (M là trung điểm), AM là cạnh chung.',
            stepByStepSolution: 'Bước 1: Liệt kê 3 cặp cạnh:\n- AB = AC (gt)\n- BM = CM (M là trung điểm BC)\n- AM là cạnh chung.\nBước 2: Kết luận ΔABM = ΔACM (c.c.c).',
            explanation: 'AM là cạnh chung của cả hai tam giác.',
            pointsXP: 25
          }
        ,
          {
            id: 'q13-4',
            lessonId: 'c4-l13',
            type: 'fill_in_blank',
            category: 'Đỉnh và cạnh tương ứng',
            difficulty: 'Cơ bản',
            prompt: 'Cho ΔABC = ΔDEF. Biết AB = 5cm, BC = 7cm, AC = 6cm. Chu vi của tam giác DEF bằng bao nhiêu cm (chỉ điền số):',
            correctAnswer: '18',
            adminHint: 'Hai tam giác bằng nhau thì chu vi bằng nhau: 5 + 7 + 6 = 18 cm.',
            stepByStepSolution: 'Bước 1: Vì ΔABC = ΔDEF nên DE = AB = 5cm, EF = BC = 7cm, DF = AC = 6cm.\nBước 2: Chu vi ΔDEF = DE + EF + DF = 5 + 7 + 6 = 18 cm.',
            explanation: 'Chu vi tam giác DEF là 18 cm.',
            pointsXP: 20
          },
          {
            id: 'q13-5',
            lessonId: 'c4-l13',
            type: 'multiple_choice',
            category: 'Chứng minh tam giác bằng nhau c.c.c',
            difficulty: 'Trung bình',
            prompt: 'Cho tam giác ABC có AB = AC. Gọi M là trung điểm của đoạn thẳng BC. Yếu tố chung khi chứng minh ΔABM = ΔACM theo trường hợp c.c.c là:',
            options: ['Cạnh AM là cạnh chung', 'Cạnh BC là cạnh chung', 'Góc A là góc chung', 'Góc M bằng 90°'],
            correctAnswer: 'Cạnh AM là cạnh chung',
            adminHint: 'Xét ΔABM và ΔACM có: AB = AC (giả thiết), BM = CM (M là trung điểm), AM là cạnh chung.',
            stepByStepSolution: 'Bước 1: Liệt kê 3 cặp cạnh:\n- AB = AC (gt)\n- BM = CM (M là trung điểm BC)\n- AM là cạnh chung.\nBước 2: Kết luận ΔABM = ΔACM (c.c.c).',
            explanation: 'AM là cạnh chung của cả hai tam giác.',
            pointsXP: 25
          }
        ]
      },
      {
        id: 'c4-l14',
        chapterId: 'ch-4',
        number: 14,
        title: 'Trường hợp bằng nhau thứ hai (c-g-c) và thứ ba (g-c-g)',
        description: 'Trường hợp Cạnh - Góc - Cạnh (c.g.c) với góc xen giữa và trường hợp Góc - Cạnh - Góc (g.c.g) với cạnh xen giữa.',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Trường hợp c.g.c: Nếu hai cạnh và góc XEN GIỮA của tam giác này bằng hai cạnh và góc XEN GIỮA của tam giác kia thì hai tam giác đó bằng nhau.',
            'Trường hợp g.c.g: Nếu một cạnh và hai góc KỀ CẠNH ĐÓ của tam giác này bằng một cạnh và hai góc kề của tam giác kia thì hai tam giác đó bằng nhau.'
          ],
          formulaSummary: [
            'AB = A’B’, ∠A = ∠A’, AC = A’C’ => ΔABC = ΔA’B’C’ (c.g.c)',
            '∠B = ∠B’, BC = B’C’, ∠C = ∠C’ => ΔABC = ΔA’B’C’ (g.c.g)'
          ],
          rules: ['Góc phải là góc xen giữa hai cạnh (trong c.g.c); cạnh phải là cạnh xen giữa hai góc (trong g.c.g).'],
          commonMistakes: ['Lấy góc không xen giữa hai cạnh mà vẫn kết luận hai tam giác bằng nhau theo c.g.c.']
        },
        examples: [
          {
            title: 'Ví dụ: Trường hợp c.g.c',
            problem: 'Cho đoạn thẳng AB, O là trung điểm của AB. Qua O kẻ đường thẳng d. Trên d lấy C và D sao cho OC = OD. Chứng minh ΔAOC = ΔBOD.',
            steps: [
              { stepNumber: 1, instruction: 'Liệt kê các yếu tố bằng nhau', formula: 'OA = OB, OC = OD' },
              { stepNumber: 2, instruction: 'Góc xen giữa là hai góc đối đỉnh', formula: '∠AOC = ∠BOD (đối đỉnh)' },
              { stepNumber: 3, instruction: 'Kết luận', formula: 'ΔAOC = ΔBOD (c.g.c)' }
            ]
          }
        ],
        questions: [
          {
            id: 'q14-1',
            lessonId: 'c4-l14',
            type: 'multiple_choice',
            category: 'Trường hợp c.g.c',
            difficulty: 'Cơ bản',
            prompt: 'Điều kiện cần để áp dụng trường hợp bằng nhau c.g.c là:',
            options: [
              'Góc bằng nhau phải là góc xen giữa hai cạnh',
              'Góc có thể là bất kỳ góc nào',
              'Cả ba góc phải bằng nhau',
              'Hai cạnh phải là cạnh đáy'
            ],
            correctAnswer: 'Góc bằng nhau phải là góc xen giữa hai cạnh',
            adminHint: 'Quy tắc: Góc phải nằm xen giữa hai cạnh tương ứng bằng nhau.',
            stepByStepSolution: 'Bước 1: Xem lại định lí c.g.c: hai cạnh và góc xen giữa của tam giác này bằng hai cạnh và góc xen giữa của tam giác kia.',
            explanation: 'Góc bằng nhau bắt buộc phải là góc xen giữa hai cạnh tương ứng.',
            pointsXP: 20
          },
          {
            id: 'q14-2',
            lessonId: 'c4-l14',
            type: 'multiple_choice',
            category: 'Trường hợp g.c.g',
            difficulty: 'Trung bình',
            prompt: 'Cho ΔABC và ΔMNP có ∠B = ∠N, BC = NP. Để ΔABC = ΔMNP theo trường hợp g.c.g thì cần thêm điều kiện gì?',
            options: ['∠C = ∠P', '∠A = ∠M', 'AB = MN', 'AC = MP'],
            correctAnswer: '∠C = ∠P',
            adminHint: 'Cạnh BC có hai góc kề là ∠B và ∠C. Cạnh NP có hai góc kề là ∠N và ∠P.',
            stepByStepSolution: 'Bước 1: Cạnh đã cho là BC và NP.\nBước 2: Hai góc kề cạnh BC là góc B và góc C.\nBước 3: Do đó để đủ điều kiện g.c.g cần thêm góc C = góc P.',
            explanation: 'Cần thêm góc kề còn lại là ∠C = ∠P để tạo thành trường hợp g.c.g.',
            pointsXP: 25
          }
        ,
          {
            id: 'q14-3',
            lessonId: 'c4-l14',
            type: 'fill_in_blank',
            category: 'Trường hợp c.g.c',
            difficulty: 'Cơ bản',
            prompt: 'Cho ΔABC = ΔMNP theo trường hợp c.g.c với AB = MN = 6cm, góc A = góc M = 70°, AC = MP. Biết cạnh BC = 8cm. Độ dài cạnh NP là bao nhiêu cm (chỉ điền số):',
            correctAnswer: '8',
            adminHint: 'Hai tam giác bằng nhau thì các cạnh tương ứng bằng nhau: NP = BC = 8cm.',
            stepByStepSolution: 'Bước 1: Vì ΔABC = ΔMNP nên các cạnh tương ứng bằng nhau.\nBước 2: Cạnh tương ứng với BC là NP => NP = BC = 8cm.',
            explanation: 'Độ dài NP = 8 cm.',
            pointsXP: 20
          },
          {
            id: 'q14-4',
            lessonId: 'c4-l14',
            type: 'multiple_choice',
            category: 'Trường hợp g.c.g',
            difficulty: 'Trung bình',
            prompt: 'Cho đoạn thẳng AB và CD cắt nhau tại trung điểm O của mỗi đoạn. Để chứng minh ΔOAC = ΔOBD, ta sử dụng trường hợp bằng nhau nào?',
            options: ['c.g.c (cạnh - góc - cạnh)', 'c.c.c (cạnh - cạnh - cạnh)', 'g.c.g (góc - cạnh - góc)', 'Cạnh huyền - góc nhọn'],
            correctAnswer: 'c.g.c (cạnh - góc - cạnh)',
            adminHint: 'OA = OB, OC = OD (O là trung điểm) và hai góc xen giữa ∠AOC = ∠BOD (hai góc đối đỉnh).',
            stepByStepSolution: 'Bước 1: OA = OB, OC = OD (giả thiết trung điểm).\nBước 2: Góc ∠AOC = ∠BOD (hai góc đối đỉnh xen giữa hai cặp cạnh).\nBước 3: Kết luận ΔOAC = ΔOBD (c.g.c).',
            explanation: 'Áp dụng trường hợp cạnh - góc - cạnh (c.g.c).',
            pointsXP: 25
          },
          {
            id: 'q14-5',
            lessonId: 'c4-l14',
            type: 'fill_in_blank',
            category: 'Góc tương ứng',
            difficulty: 'Cơ bản',
            prompt: 'Cho ΔABC = ΔDEF. Biết góc B = 45°, góc C = 65°. Số đo của góc D là bao nhiêu độ (chỉ điền số):',
            correctAnswer: '70',
            adminHint: 'Góc A = 180° - 45° - 65° = 70°. Góc D tương ứng với góc A nên góc D = 70°.',
            stepByStepSolution: 'Bước 1: Tính góc A trong ΔABC: ∠A = 180° - (45° + 65°) = 70°.\nBước 2: Vì ΔABC = ΔDEF nên góc tương ứng ∠D = ∠A = 70°.',
            explanation: 'Góc D = 70°.',
            pointsXP: 25
          }
        ,
          {
            id: 'q14-3',
            lessonId: 'c4-l14',
            type: 'fill_in_blank',
            category: 'Trường hợp c.g.c',
            difficulty: 'Cơ bản',
            prompt: 'Cho ΔABC = ΔMNP theo trường hợp c.g.c với AB = MN = 6cm, góc A = góc M = 70°, AC = MP. Biết cạnh BC = 8cm. Độ dài cạnh NP là bao nhiêu cm (chỉ điền số):',
            correctAnswer: '8',
            adminHint: 'Hai tam giác bằng nhau thì các cạnh tương ứng bằng nhau: NP = BC = 8cm.',
            stepByStepSolution: 'Bước 1: Vì ΔABC = ΔMNP nên các cạnh tương ứng bằng nhau.\nBước 2: Cạnh tương ứng với BC là NP => NP = BC = 8cm.',
            explanation: 'Độ dài NP = 8 cm.',
            pointsXP: 20
          },
          {
            id: 'q14-4',
            lessonId: 'c4-l14',
            type: 'multiple_choice',
            category: 'Trường hợp g.c.g',
            difficulty: 'Trung bình',
            prompt: 'Cho đoạn thẳng AB và CD cắt nhau tại trung điểm O của mỗi đoạn. Để chứng minh ΔOAC = ΔOBD, ta sử dụng trường hợp bằng nhau nào?',
            options: ['c.g.c (cạnh - góc - cạnh)', 'c.c.c (cạnh - cạnh - cạnh)', 'g.c.g (góc - cạnh - góc)', 'Cạnh huyền - góc nhọn'],
            correctAnswer: 'c.g.c (cạnh - góc - cạnh)',
            adminHint: 'OA = OB, OC = OD (O là trung điểm) và hai góc xen giữa ∠AOC = ∠BOD (hai góc đối đỉnh).',
            stepByStepSolution: 'Bước 1: OA = OB, OC = OD (giả thiết trung điểm).\nBước 2: Góc ∠AOC = ∠BOD (hai góc đối đỉnh xen giữa hai cặp cạnh).\nBước 3: Kết luận ΔOAC = ΔOBD (c.g.c).',
            explanation: 'Áp dụng trường hợp cạnh - góc - cạnh (c.g.c).',
            pointsXP: 25
          },
          {
            id: 'q14-5',
            lessonId: 'c4-l14',
            type: 'fill_in_blank',
            category: 'Góc tương ứng',
            difficulty: 'Cơ bản',
            prompt: 'Cho ΔABC = ΔDEF. Biết góc B = 45°, góc C = 65°. Số đo của góc D là bao nhiêu độ (chỉ điền số):',
            correctAnswer: '70',
            adminHint: 'Góc A = 180° - 45° - 65° = 70°. Góc D tương ứng với góc A nên góc D = 70°.',
            stepByStepSolution: 'Bước 1: Tính góc A trong ΔABC: ∠A = 180° - (45° + 65°) = 70°.\nBước 2: Vì ΔABC = ΔDEF nên góc tương ứng ∠D = ∠A = 70°.',
            explanation: 'Góc D = 70°.',
            pointsXP: 25
          }
        ]
      },
      {
        id: 'c4-l15',
        chapterId: 'ch-4',
        number: 15,
        title: 'Các trường hợp bằng nhau của tam giác vuông',
        description: 'Trường hợp hai cạnh góc vuông, cạnh góc vuông - góc nhọn kề, cạnh huyền - góc nhọn, và cạnh huyền - cạnh góc vuông.',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Hai cạnh góc vuông: Hai cạnh góc vuông của tam giác này bằng hai cạnh góc vuông của tam giác kia.',
            'Cạnh góc vuông - góc nhọn: Một cạnh góc vuông và một góc nhọn kề cạnh ấy.',
            'Cạnh huyền - góc nhọn: Cạnh huyền và một góc nhọn của tam giác vuông này bằng cạnh huyền và một góc nhọn của tam giác vuông kia.',
            'Cạnh huyền - cạnh góc vuông: Cạnh huyền và một cạnh góc vuông của tam giác vuông này bằng cạnh huyền và một cạnh góc vuông của tam giác vuông kia.'
          ],
          formulaSummary: [
            'Huyền - Nhọn: BC = B’C’, ∠B = ∠B’ => ΔABC = ΔA’B’C’',
            'Huyền - Cạnh góc vuông: BC = B’C’, AB = A’B’ => ΔABC = ΔA’B’C’'
          ],
          rules: ['Khi xét tam giác vuông, chỉ cần 2 yếu tố tương ứng bằng nhau là đủ điều kiện kết luận.'],
          commonMistakes: ['Quên ghi rõ điều kiện góc vuông 90° trước khi áp dụng định lí.']
        },
        examples: [
          {
            title: 'Ví dụ: Cạnh huyền - góc nhọn',
            problem: 'Cho tam giác ABC cân tại A. Kẻ đường cao AH vuông góc với BC. Chứng minh ΔABH = ΔACH.',
            steps: [
              { stepNumber: 1, instruction: 'Xét hai tam giác vuông tại H', formula: '∠AHB = ∠AHC = 90°' },
              { stepNumber: 2, instruction: 'Cạnh huyền AB = AC (do ΔABC cân), AH là cạnh góc vuông chung', formula: 'ΔABH = ΔACH (cạnh huyền - cạnh góc vuông)' }
            ]
          }
        ],
        questions: [
          {
            id: 'q15-1',
            lessonId: 'c4-l15',
            type: 'multiple_choice',
            category: 'Tam giác vuông',
            difficulty: 'Cơ bản',
            prompt: 'Trường hợp bằng nhau đặc biệt nào sau đây chỉ áp dụng cho TAM GIÁC VUÔNG?',
            options: [
              'Cạnh huyền - góc nhọn',
              'Cạnh - Cạnh - Cạnh',
              'Cạnh - Góc - Cạnh',
              'Góc - Cạnh - Góc'
            ],
            correctAnswer: 'Cạnh huyền - góc nhọn',
            adminHint: 'Cạnh huyền chỉ có trong tam giác vuông.',
            stepByStepSolution: 'Bước 1: Cạnh huyền là cạnh đối diện với góc vuông trong tam giác vuông.\nBước 2: Trường hợp "cạnh huyền - góc nhọn" chỉ tồn tại ở tam giác vuông.',
            explanation: 'Trường hợp cạnh huyền - góc nhọn là trường hợp bằng nhau đặc biệt của tam giác vuông.',
            pointsXP: 20
          },
          {
            id: 'q15-2',
            lessonId: 'c4-l15',
            type: 'multiple_choice',
            category: 'Nhận diện tam giác vuông',
            difficulty: 'Trung bình',
            prompt: 'Cho tam giác ABC vuông tại A và tam giác DEF vuông tại D có BC = EF và AB = DE. Hai tam giác bằng nhau theo trường hợp:',
            options: [
              'Cạnh huyền - cạnh góc vuông',
              'Cạnh huyền - góc nhọn',
              'Hai cạnh góc vuông',
              'Cạnh - Góc - Cạnh'
            ],
            correctAnswer: 'Cạnh huyền - cạnh góc vuông',
            adminHint: 'BC và EF là cạnh huyền, AB và DE là cạnh góc vuông.',
            stepByStepSolution: 'Bước 1: BC và EF đối diện góc vuông nên là cạnh huyền.\nBước 2: AB và DE kề góc vuông nên là cạnh góc vuông.\nBước 3: Do đó bằng nhau theo trường hợp cạnh huyền - cạnh góc vuông.',
            explanation: 'Bằng nhau theo trường hợp: cạnh huyền - cạnh góc vuông.',
            pointsXP: 25
          }
        ,
          {
            id: 'q15-3',
            lessonId: 'c4-l15',
            type: 'multiple_choice',
            category: 'Cạnh huyền - góc nhọn',
            difficulty: 'Cơ bản',
            prompt: 'Cho tam giác vuông ABC (vuông tại A) và tam giác vuông DEF (vuông tại D) có BC = EF và góc B = góc E. Hai tam giác này bằng nhau theo trường hợp:',
            options: ['Cạnh huyền - góc nhọn', 'Cạnh huyền - cạnh góc vuông', 'Hai cạnh góc vuông', 'Cạnh - góc - cạnh'],
            correctAnswer: 'Cạnh huyền - góc nhọn',
            adminHint: 'BC và EF là cạnh huyền, góc B và góc E là góc nhọn tương ứng.',
            stepByStepSolution: 'Bước 1: BC và EF đối diện góc vuông nên là hai cạnh huyền.\nBước 2: ∠B và ∠E là hai góc nhọn kề cạnh huyền.\nBước 3: Do đó bằng nhau theo trường hợp cạnh huyền - góc nhọn.',
            explanation: 'Trường hợp cạnh huyền - góc nhọn.',
            pointsXP: 20
          },
          {
            id: 'q15-4',
            lessonId: 'c4-l15',
            type: 'fill_in_blank',
            category: 'Cạnh tương ứng tam giác vuông',
            difficulty: 'Cơ bản',
            prompt: 'Cho ΔABC vuông tại A và ΔDEF vuông tại D có cạnh huyền BC = EF = 10cm, AB = DE = 6cm, AC = 8cm. Độ dài cạnh DF của tam giác DEF là bao nhiêu cm (chỉ điền số):',
            correctAnswer: '8',
            adminHint: 'Hai tam giác vuông bằng nhau theo trường hợp cạnh huyền - cạnh góc vuông, nên DF = AC = 8cm.',
            stepByStepSolution: 'Bước 1: ΔABC = ΔDEF (cạnh huyền - cạnh góc vuông).\nBước 2: DF tương ứng với AC => DF = AC = 8cm.',
            explanation: 'Độ dài cạnh DF = 8 cm.',
            pointsXP: 20
          },
          {
            id: 'q15-5',
            lessonId: 'c4-l15',
            type: 'multiple_choice',
            category: 'Trường hợp đặc biệt tam giác vuông',
            difficulty: 'Trung bình',
            prompt: 'Trường hợp bằng nhau nào sau đây là trường hợp ĐẶC BIỆT CHỈ CÓ ở tam giác vuông?',
            options: ['Cạnh huyền - cạnh góc vuông', 'Cạnh - cạnh - cạnh (c.c.c)', 'Cạnh - góc - cạnh (c.g.c)', 'Góc - cạnh - góc (g.c.g)'],
            correctAnswer: 'Cạnh huyền - cạnh góc vuông',
            adminHint: 'Chỉ tam giác vuông mới có yếu tố cạnh huyền và cạnh góc vuông.',
            stepByStepSolution: 'Bước 1: Cạnh huyền và cạnh góc vuông chỉ tồn tại trong tam giác vuông nhờ định lí Pythagore ngầm bảo toàn cạnh còn lại.',
            explanation: 'Trường hợp cạnh huyền - cạnh góc vuông là đặc trưng riêng của tam giác vuông.',
            pointsXP: 25
          }
        ,
          {
            id: 'q15-3',
            lessonId: 'c4-l15',
            type: 'multiple_choice',
            category: 'Cạnh huyền - góc nhọn',
            difficulty: 'Cơ bản',
            prompt: 'Cho tam giác vuông ABC (vuông tại A) và tam giác vuông DEF (vuông tại D) có BC = EF và góc B = góc E. Hai tam giác này bằng nhau theo trường hợp:',
            options: ['Cạnh huyền - góc nhọn', 'Cạnh huyền - cạnh góc vuông', 'Hai cạnh góc vuông', 'Cạnh - góc - cạnh'],
            correctAnswer: 'Cạnh huyền - góc nhọn',
            adminHint: 'BC và EF là cạnh huyền, góc B và góc E là góc nhọn tương ứng.',
            stepByStepSolution: 'Bước 1: BC và EF đối diện góc vuông nên là hai cạnh huyền.\nBước 2: ∠B và ∠E là hai góc nhọn kề cạnh huyền.\nBước 3: Do đó bằng nhau theo trường hợp cạnh huyền - góc nhọn.',
            explanation: 'Trường hợp cạnh huyền - góc nhọn.',
            pointsXP: 20
          },
          {
            id: 'q15-4',
            lessonId: 'c4-l15',
            type: 'fill_in_blank',
            category: 'Cạnh tương ứng tam giác vuông',
            difficulty: 'Cơ bản',
            prompt: 'Cho ΔABC vuông tại A và ΔDEF vuông tại D có cạnh huyền BC = EF = 10cm, AB = DE = 6cm, AC = 8cm. Độ dài cạnh DF của tam giác DEF là bao nhiêu cm (chỉ điền số):',
            correctAnswer: '8',
            adminHint: 'Hai tam giác vuông bằng nhau theo trường hợp cạnh huyền - cạnh góc vuông, nên DF = AC = 8cm.',
            stepByStepSolution: 'Bước 1: ΔABC = ΔDEF (cạnh huyền - cạnh góc vuông).\nBước 2: DF tương ứng với AC => DF = AC = 8cm.',
            explanation: 'Độ dài cạnh DF = 8 cm.',
            pointsXP: 20
          },
          {
            id: 'q15-5',
            lessonId: 'c4-l15',
            type: 'multiple_choice',
            category: 'Trường hợp đặc biệt tam giác vuông',
            difficulty: 'Trung bình',
            prompt: 'Trường hợp bằng nhau nào sau đây là trường hợp ĐẶC BIỆT CHỈ CÓ ở tam giác vuông?',
            options: ['Cạnh huyền - cạnh góc vuông', 'Cạnh - cạnh - cạnh (c.c.c)', 'Cạnh - góc - cạnh (c.g.c)', 'Góc - cạnh - góc (g.c.g)'],
            correctAnswer: 'Cạnh huyền - cạnh góc vuông',
            adminHint: 'Chỉ tam giác vuông mới có yếu tố cạnh huyền và cạnh góc vuông.',
            stepByStepSolution: 'Bước 1: Cạnh huyền và cạnh góc vuông chỉ tồn tại trong tam giác vuông nhờ định lí Pythagore ngầm bảo toàn cạnh còn lại.',
            explanation: 'Trường hợp cạnh huyền - cạnh góc vuông là đặc trưng riêng của tam giác vuông.',
            pointsXP: 25
          }
        ]
      },
      {
        id: 'c4-l16',
        chapterId: 'ch-4',
        number: 16,
        title: 'Tam giác cân. Đường trung trực của đoạn thẳng',
        description: 'Định nghĩa tính chất tam giác cân, tam giác đều. Khái niệm và tính chất đường trung trực của đoạn thẳng.',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Tam giác cân là tam giác có hai cạnh bằng nhau. Hai góc ở đáy của tam giác cân thì bằng nhau.',
            'Tam giác đều là tam giác có ba cạnh bằng nhau. Mỗi góc của tam giác đều bằng 60°.',
            'Đường trung trực của một đoạn thẳng là đường thẳng vuông góc với đoạn thẳng ấy tại trung điểm của nó.',
            'Tính chất đường trung trực: Điểm nằm trên đường trung trực của một đoạn thẳng thì cách đều hai đầu mút của đoạn thẳng đó.'
          ],
          formulaSummary: [
            'ΔABC cân tại A <=> AB = AC <=> ∠B = ∠C',
            'Góc đáy tam giác cân: ∠B = (180° - ∠A) / 2',
            'MA = MB <=> M thuộc đường trung trực của AB'
          ],
          rules: ['Tam giác có hai góc bằng nhau là tam giác cân.'],
          commonMistakes: ['Nhầm đường trung tuyến với đường trung trực (đường trung trực phải vuông góc tại trung điểm).']
        },
        examples: [
          {
            title: 'Ví dụ: Tính góc ở đáy tam giác cân',
            problem: 'Cho tam giác ABC cân tại A có ∠A = 40°. Tính số đo góc B và góc C.',
            steps: [
              { stepNumber: 1, instruction: 'Vì ΔABC cân tại A nên ∠B = ∠C', formula: '∠B = ∠C' },
              { stepNumber: 2, instruction: 'Tính số đo góc B theo công thức', formula: '∠B = (180° - 40°) / 2 = 140° / 2 = 70°' }
            ]
          }
        ],
        questions: [
          {
            id: 'q16-1',
            lessonId: 'c4-l16',
            type: 'fill_in_blank',
            category: 'Tam giác cân',
            difficulty: 'Cơ bản',
            prompt: 'Cho tam giác ABC cân tại A có góc ở đỉnh A = 50°. Tính số đo góc đáy B (nhập số đo độ):',
            correctAnswer: '65',
            adminHint: 'Góc ở đáy B = (180° - 50°) / 2 = 130° / 2 = 65°.',
            stepByStepSolution: 'Bước 1: Trong tam giác cân tại A, hai góc ở đáy bằng nhau: ∠B = ∠C.\nBước 2: Tổng 3 góc: ∠A + 2·∠B = 180° => 2·∠B = 180° - 50° = 130°.\nBước 3: ∠B = 130° / 2 = 65°.',
            explanation: 'Góc B = (180° - 50°) / 2 = 65°.',
            pointsXP: 20
          },
          {
            id: 'q16-2',
            lessonId: 'c4-l16',
            type: 'multiple_choice',
            category: 'Tam giác đều',
            difficulty: 'Cơ bản',
            prompt: 'Mỗi góc trong một tam giác đều có số đo bằng bao nhiêu độ?',
            options: ['60°', '45°', '90°', '120°'],
            correctAnswer: '60°',
            adminHint: 'Tam giác đều có 3 góc bằng nhau: 180° / 3 = 60°.',
            stepByStepSolution: 'Bước 1: Tam giác đều có 3 góc bằng nhau.\nBước 2: Tổng 3 góc là 180°, do đó mỗi góc = 180° / 3 = 60°.',
            explanation: 'Mỗi góc trong tam giác đều bằng 60°.',
            pointsXP: 20
          },
          {
            id: 'q16-3',
            lessonId: 'c4-l16',
            type: 'multiple_choice',
            category: 'Đường trung trực',
            difficulty: 'Trung bình',
            prompt: 'Điểm M nằm trên đường trung trực của đoạn thẳng AB thì:',
            options: [
              'MA = MB (M cách đều hai đầu mút A và B)',
              'MA > MB',
              'MA + MB = AB',
              'M trùng với A'
            ],
            correctAnswer: 'MA = MB (M cách đều hai đầu mút A và B)',
            adminHint: 'Tính chất cơ bản: Điểm thuộc trung trực cách đều hai đầu mút đoạn thẳng.',
            stepByStepSolution: 'Bước 1: Theo định lí về tính chất đường trung trực của đoạn thẳng.\nBước 2: Điểm nằm trên đường trung trực của đoạn thẳng AB thì cách đều hai đầu mút: MA = MB.',
            explanation: 'MA = MB vì M nằm trên đường trung trực của AB.',
            pointsXP: 25
          }
        ,
          {
            id: 'q16-4',
            lessonId: 'c4-l16',
            type: 'fill_in_blank',
            category: 'Góc ở đáy tam giác cân',
            difficulty: 'Cơ bản',
            prompt: 'Một tam giác cân có góc ở đỉnh bằng 40°. Số đo mỗi góc ở đáy là bao nhiêu độ (chỉ điền số):',
            correctAnswer: '70',
            adminHint: 'Hai góc ở đáy bằng nhau: (180° - 40°) : 2 = 70°.',
            stepByStepSolution: 'Bước 1: Tổng 3 góc trong tam giác = 180°.\nBước 2: Tổng 2 góc ở đáy = 180° - 40° = 140°.\nBước 3: Số đo mỗi góc ở đáy = 140° : 2 = 70°.',
            explanation: 'Mỗi góc ở đáy có số đo là 70°.',
            pointsXP: 20
          },
          {
            id: 'q16-5',
            lessonId: 'c4-l16',
            type: 'multiple_choice',
            category: 'Tính chất đường trung trực',
            difficulty: 'Cơ bản',
            prompt: 'Điểm M nằm trên đường trung trực của đoạn thẳng AB thì có tính chất nào sau đây?',
            options: ['MA = MB (Cách đều hai đầu mút A và B)', 'MA > MB', 'MA + MB = AB', 'M là trung điểm của AB'],
            correctAnswer: 'MA = MB (Cách đều hai đầu mút A và B)',
            adminHint: 'Định lí: Điểm nằm trên đường trung trực của một đoạn thẳng thì cách đều hai mút của đoạn thẳng đó.',
            stepByStepSolution: 'Bước 1: Nhớ lại định lí về tính chất đường trung trực của đoạn thẳng: M thuộc đường trung trực của AB <=> MA = MB.',
            explanation: 'Điểm trên đường trung trực cách đều hai mút của đoạn thẳng: MA = MB.',
            pointsXP: 20
          }
        ,
          {
            id: 'q16-4',
            lessonId: 'c4-l16',
            type: 'fill_in_blank',
            category: 'Góc ở đáy tam giác cân',
            difficulty: 'Cơ bản',
            prompt: 'Một tam giác cân có góc ở đỉnh bằng 40°. Số đo mỗi góc ở đáy là bao nhiêu độ (chỉ điền số):',
            correctAnswer: '70',
            adminHint: 'Hai góc ở đáy bằng nhau: (180° - 40°) : 2 = 70°.',
            stepByStepSolution: 'Bước 1: Tổng 3 góc trong tam giác = 180°.\nBước 2: Tổng 2 góc ở đáy = 180° - 40° = 140°.\nBước 3: Số đo mỗi góc ở đáy = 140° : 2 = 70°.',
            explanation: 'Mỗi góc ở đáy có số đo là 70°.',
            pointsXP: 20
          },
          {
            id: 'q16-5',
            lessonId: 'c4-l16',
            type: 'multiple_choice',
            category: 'Tính chất đường trung trực',
            difficulty: 'Cơ bản',
            prompt: 'Điểm M nằm trên đường trung trực của đoạn thẳng AB thì có tính chất nào sau đây?',
            options: ['MA = MB (Cách đều hai đầu mút A và B)', 'MA > MB', 'MA + MB = AB', 'M là trung điểm của AB'],
            correctAnswer: 'MA = MB (Cách đều hai đầu mút A và B)',
            adminHint: 'Định lí: Điểm nằm trên đường trung trực của một đoạn thẳng thì cách đều hai mút của đoạn thẳng đó.',
            stepByStepSolution: 'Bước 1: Nhớ lại định lí về tính chất đường trung trực của đoạn thẳng: M thuộc đường trung trực của AB <=> MA = MB.',
            explanation: 'Điểm trên đường trung trực cách đều hai mút của đoạn thẳng: MA = MB.',
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
    code: 'Chương V',
    title: 'Thu Thập & Biểu Diễn Dữ Liệu',
    description: 'Thu thập phân loại dữ liệu định tính và định lượng, biểu đồ hình quạt tròn và biểu đồ đoạn thẳng.',
    iconName: 'BarChart2',
    color: 'blue',
    lessons: [
      {
        id: 'c5-l17',
        chapterId: 'ch-5',
        number: 17,
        title: 'Thu thập và phân loại dữ liệu',
        description: 'Dữ liệu là số (định lượng), dữ liệu không là số (định tính), tính đại diện của mẫu dữ liệu.',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Dữ liệu là số (số liệu / định lượng): điểm số, chiều cao, cân nặng, số lượng học sinh.',
            'Dữ liệu không là số (định tính): tên các môn học, màu sắc yêu thích, xếp loại học lực (Giỏi, Khá, Đạt).',
            'Tính đại diện: Dữ liệu thu thập cần đại diện khách quan cho toàn bộ đối tượng điều tra.'
          ],
          formulaSummary: [
            'Dữ liệu = Dữ liệu định tính (chữ) + Dữ liệu định lượng (số)'
          ],
          rules: ['Không dùng mẫu khảo sát quá hẹp hoặc thiên lệch khi đưa ra kết luận chung.'],
          commonMistakes: ['Nhầm lẫn giữa dữ liệu xếp loại (Định tính) với điểm số cụ thể (Định lượng).']
        },
        examples: [
          {
            title: 'Ví dụ: Phân loại dữ liệu',
            problem: 'Phân loại các dữ liệu sau: Chiều cao (cm), Loại sách yêu thích (Truyện tranh, Lịch sử), Điểm kiểm tra',
            steps: [
              { stepNumber: 1, instruction: 'Dữ liệu định lượng (số)', formula: 'Chiều cao, Điểm kiểm tra' },
              { stepNumber: 2, instruction: 'Dữ liệu định tính (chữ)', formula: 'Loại sách yêu thích' }
            ]
          }
        ],
        questions: [
          {
            id: 'q17-1',
            lessonId: 'c5-l17',
            type: 'multiple_choice',
            category: 'Phân loại dữ liệu',
            difficulty: 'Cơ bản',
            prompt: 'Dãy dữ liệu nào sau đây là dữ liệu ĐỊNH LƯỢNG (dữ liệu là số)?',
            options: [
              'Chiều cao (cm) của các học sinh trong lớp: 150, 155, 160',
              'Màu sắc yêu thích: Xanh, Đỏ, Tím, Vàng',
              'Xếp loại học lực: Xuất sắc, Giỏi, Khá',
              'Tên các tỉnh thành: Hà Nội, Đà Nẵng, TP.HCM'
            ],
            correctAnswer: 'Chiều cao (cm) của các học sinh trong lớp: 150, 155, 160',
            adminHint: 'Dữ liệu định lượng là dữ liệu biểu thị bằng số đo đếm được.',
            stepByStepSolution: 'Bước 1: Dữ liệu định lượng là dữ liệu dưới dạng số đo lường hoặc đếm được.\nBước 2: Chiều cao 150, 155, 160 cm là số nên là dữ liệu định lượng.',
            explanation: 'Chiều cao là dữ liệu định lượng (dữ liệu là số).',
            pointsXP: 20
          },
          {
            id: 'q17-2',
            lessonId: 'c5-l17',
            type: 'multiple_choice',
            category: 'Tính đại diện',
            difficulty: 'Trung bình',
            prompt: 'Để khảo sát môn thể thao yêu thích của học sinh toàn trường THCS, cách thu thập nào sau đây có tính ĐẠI DIỆN CAO NHẤT?',
            options: [
              'Chọn ngẫu nhiên 10 học sinh từ mỗi lớp trong trường',
              'Chỉ hỏi các bạn trong đội tuyển bóng rổ của trường',
              'Chỉ khảo sát các bạn học sinh lớp 7A1',
              'Hỏi các bạn nam đang đá bóng ở sân trường'
            ],
            correctAnswer: 'Chọn ngẫu nhiên 10 học sinh từ mỗi lớp trong trường',
            adminHint: 'Mẫu ngẫu nhiên từ mọi khối lớp đảm bảo tính khách quan và đại diện cho toàn trường.',
            stepByStepSolution: 'Bước 1: Để có tính đại diện cao, mẫu phải bao gồm ngẫu nhiên cả nam, nữ, từ tất cả các khối lớp.\nBước 2: Cách chọn ngẫu nhiên 10 học sinh từ mỗi lớp đại diện đồng đều cho toàn trường.',
            explanation: 'Chọn ngẫu nhiên học sinh từ tất cả các lớp sẽ đảm bảo tính khách quan và đại diện cao nhất.',
            pointsXP: 25
          }
        ,
          {
            id: 'q17-3',
            lessonId: 'c5-l17',
            type: 'multiple_choice',
            category: 'Phân loại dữ liệu định lượng',
            difficulty: 'Cơ bản',
            prompt: 'Dãy dữ liệu nào sau đây là dữ liệu định lượng (số liệu đo lường được)?',
            options: ['Điểm kiểm tra môn Toán của học sinh: 8; 7,5; 9; 10', 'Các môn thể thao yêu thích: Bóng đá, Bơi lội, Cầu lông', 'Tên các quận, huyện của thành phố Hà Nội', 'Mức độ hài lòng: Rất hài lòng, Hài lòng, Chưa hài lòng'],
            correctAnswer: 'Điểm kiểm tra môn Toán của học sinh: 8; 7,5; 9; 10',
            adminHint: 'Dữ liệu định lượng là dữ liệu dưới dạng số thực biểu thị số lượng hoặc phép đo.',
            stepByStepSolution: 'Bước 1: Dữ liệu định lượng là các con số cụ thể (điểm số, chiều cao, khối lượng).\nBước 2: Điểm kiểm tra là các con số đo lường được, còn tên môn và mức độ hài lòng là dữ liệu định tính.',
            explanation: 'Điểm kiểm tra 8; 7,5; 9; 10 là dữ liệu định lượng.',
            pointsXP: 20
          },
          {
            id: 'q17-4',
            lessonId: 'c5-l17',
            type: 'multiple_choice',
            category: 'Tính đại diện của dữ liệu',
            difficulty: 'Trung bình',
            prompt: 'Để khảo sát thời gian tự học ở nhà của học sinh khối 7 trường THCS Nguyễn Du, cách chọn mẫu nào sau đây có tính đại diện cao nhất?',
            options: ['Chọn ngẫu nhiên 15 học sinh từ mỗi lớp của khối 7', 'Chỉ chọn các bạn học sinh trong đội tuyển học sinh giỏi', 'Chỉ hỏi các bạn nam đang chơi bóng đá ở sân trường', 'Chỉ hỏi các bạn đi học muộn vào sáng thứ Hai'],
            correctAnswer: 'Chọn ngẫu nhiên 15 học sinh từ mỗi lớp của khối 7',
            adminHint: 'Mẫu đại diện cần phản ánh ngẫu nhiên, đa dạng mọi thành phần của tổng thể.',
            stepByStepSolution: 'Bước 1: Mẫu khảo sát muốn có tính đại diện phải bao quát ngẫu nhiên học sinh từ các lớp khác nhau (cả học sinh giỏi, khá, trung bình).\nBước 2: Chỉ hỏi một nhóm riêng biệt sẽ gây sai lệch kết quả.',
            explanation: 'Chọn ngẫu nhiên học sinh từ tất cả các lớp khối 7 đảm bảo tính đại diện khách quan.',
            pointsXP: 25
          },
          {
            id: 'q17-5',
            lessonId: 'c5-l17',
            type: 'fill_in_blank',
            category: 'Tính tổng từ bảng số liệu',
            difficulty: 'Cơ bản',
            prompt: 'Bảng thống kê số học sinh giỏi 4 lớp 7: 7A (12 bạn), 7B (15 bạn), 7C (10 bạn), 7D (13 bạn). Tổng số học sinh giỏi của 4 lớp là bao nhiêu bạn (chỉ điền số):',
            correctAnswer: '50',
            adminHint: 'Cộng số học sinh giỏi của 4 lớp lại: 12 + 15 + 10 + 13 = 50.',
            stepByStepSolution: 'Bước 1: Lấy tổng số học sinh giỏi: 12 + 15 + 10 + 13 = 50 bạn.',
            explanation: 'Tổng số học sinh giỏi là 50 bạn.',
            pointsXP: 20
          }
        ,
          {
            id: 'q17-3',
            lessonId: 'c5-l17',
            type: 'multiple_choice',
            category: 'Phân loại dữ liệu định lượng',
            difficulty: 'Cơ bản',
            prompt: 'Dãy dữ liệu nào sau đây là dữ liệu định lượng (số liệu đo lường được)?',
            options: ['Điểm kiểm tra môn Toán của học sinh: 8; 7,5; 9; 10', 'Các môn thể thao yêu thích: Bóng đá, Bơi lội, Cầu lông', 'Tên các quận, huyện của thành phố Hà Nội', 'Mức độ hài lòng: Rất hài lòng, Hài lòng, Chưa hài lòng'],
            correctAnswer: 'Điểm kiểm tra môn Toán của học sinh: 8; 7,5; 9; 10',
            adminHint: 'Dữ liệu định lượng là dữ liệu dưới dạng số thực biểu thị số lượng hoặc phép đo.',
            stepByStepSolution: 'Bước 1: Dữ liệu định lượng là các con số cụ thể (điểm số, chiều cao, khối lượng).\nBước 2: Điểm kiểm tra là các con số đo lường được, còn tên môn và mức độ hài lòng là dữ liệu định tính.',
            explanation: 'Điểm kiểm tra 8; 7,5; 9; 10 là dữ liệu định lượng.',
            pointsXP: 20
          },
          {
            id: 'q17-4',
            lessonId: 'c5-l17',
            type: 'multiple_choice',
            category: 'Tính đại diện của dữ liệu',
            difficulty: 'Trung bình',
            prompt: 'Để khảo sát thời gian tự học ở nhà của học sinh khối 7 trường THCS Nguyễn Du, cách chọn mẫu nào sau đây có tính đại diện cao nhất?',
            options: ['Chọn ngẫu nhiên 15 học sinh từ mỗi lớp của khối 7', 'Chỉ chọn các bạn học sinh trong đội tuyển học sinh giỏi', 'Chỉ hỏi các bạn nam đang chơi bóng đá ở sân trường', 'Chỉ hỏi các bạn đi học muộn vào sáng thứ Hai'],
            correctAnswer: 'Chọn ngẫu nhiên 15 học sinh từ mỗi lớp của khối 7',
            adminHint: 'Mẫu đại diện cần phản ánh ngẫu nhiên, đa dạng mọi thành phần của tổng thể.',
            stepByStepSolution: 'Bước 1: Mẫu khảo sát muốn có tính đại diện phải bao quát ngẫu nhiên học sinh từ các lớp khác nhau (cả học sinh giỏi, khá, trung bình).\nBước 2: Chỉ hỏi một nhóm riêng biệt sẽ gây sai lệch kết quả.',
            explanation: 'Chọn ngẫu nhiên học sinh từ tất cả các lớp khối 7 đảm bảo tính đại diện khách quan.',
            pointsXP: 25
          },
          {
            id: 'q17-5',
            lessonId: 'c5-l17',
            type: 'fill_in_blank',
            category: 'Tính tổng từ bảng số liệu',
            difficulty: 'Cơ bản',
            prompt: 'Bảng thống kê số học sinh giỏi 4 lớp 7: 7A (12 bạn), 7B (15 bạn), 7C (10 bạn), 7D (13 bạn). Tổng số học sinh giỏi của 4 lớp là bao nhiêu bạn (chỉ điền số):',
            correctAnswer: '50',
            adminHint: 'Cộng số học sinh giỏi của 4 lớp lại: 12 + 15 + 10 + 13 = 50.',
            stepByStepSolution: 'Bước 1: Lấy tổng số học sinh giỏi: 12 + 15 + 10 + 13 = 50 bạn.',
            explanation: 'Tổng số học sinh giỏi là 50 bạn.',
            pointsXP: 20
          }
        ]
      },
      {
        id: 'c5-l18',
        chapterId: 'ch-5',
        number: 18,
        title: 'Biểu đồ hình quạt tròn',
        description: 'Đọc và phân tích biểu đồ quạt tròn, tính tỉ lệ phần trăm và quy đổi số liệu.',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Biểu đồ quạt tròn dùng để so sánh các phần trong toàn bộ tổng thể.',
            'Cả hình tròn đại diện cho 100% (ứng với góc 360°).',
            'Mỗi hình quạt biểu diễn tỉ lệ phần trăm của một danh mục dữ liệu.'
          ],
          formulaSummary: [
            'Tổng các tỉ lệ % trên biểu đồ quạt = 100%',
            'Số lượng = Tổng số · Tỉ lệ %'
          ],
          rules: ['Luôn kiểm tra tổng các hình quạt có đúng bằng 100% không.'],
          commonMistakes: ['Quên nhân với tổng số lượng khi quy đổi từ phần trăm sang số cụ thể.']
        },
        examples: [
          {
            title: 'Ví dụ: Đọc biểu đồ quạt tròn',
            problem: 'Lớp 7A có 40 học sinh. Biểu đồ quạt cho biết tỉ lệ học sinh Giỏi là 25%. Hỏi có bao nhiêu học sinh Giỏi?',
            steps: [
              { stepNumber: 1, instruction: 'Tính số học sinh Giỏi', formula: '40 · 25% = 40 · 0,25 = 10 học sinh' }
            ]
          }
        ],
        questions: [
          {
            id: 'q18-1',
            lessonId: 'c5-l18',
            type: 'fill_in_blank',
            category: 'Tính số lượng từ %',
            difficulty: 'Cơ bản',
            prompt: 'Khảo sát 200 học sinh về phương tiện đến trường. Biểu đồ quạt cho biết có 30% đi xe đạp. Hỏi có bao nhiêu học sinh đi xe đạp:',
            correctAnswer: '60',
            adminHint: 'Lấy 200 · 30% = 200 · 0,3 = 60 học sinh.',
            stepByStepSolution: 'Bước 1: Tính 30% của 200 học sinh.\nBước 2: 200 · 30 / 100 = 60 học sinh.',
            explanation: 'Số học sinh đi xe đạp là 200 · 30% = 60 bạn.',
            pointsXP: 20
          },
          {
            id: 'q18-2',
            lessonId: 'c5-l18',
            type: 'multiple_choice',
            category: 'Tổng phần trăm',
            difficulty: 'Cơ bản',
            prompt: 'Trên một biểu đồ hình quạt tròn, tổng tỉ lệ phần trăm của tất cả các hình quạt hợp lại luôn bằng:',
            options: ['100%', '360%', '50%', '180%'],
            correctAnswer: '100%',
            adminHint: 'Toàn bộ hình tròn đại diện cho 100% dữ liệu khảo sát.',
            stepByStepSolution: 'Bước 1: Hình quạt tròn biểu diễn toàn bộ tổng thể.\nBước 2: Toàn bộ tổng thể luôn tương ứng với 100%.',
            explanation: 'Tổng phần trăm trên biểu đồ quạt tròn luôn bằng 100%.',
            pointsXP: 20
          }
        ,
          {
            id: 'q18-3',
            lessonId: 'c5-l18',
            type: 'fill_in_blank',
            category: 'Tính phần trăm còn lại',
            difficulty: 'Cơ bản',
            prompt: 'Một biểu đồ hình quạt tròn biểu diễn tỉ lệ học sinh thích thể thao: Bóng đá 45%, Cầu lông 30%, Bơi lội 15%, còn lại là Bóng bàn. Tỉ lệ học sinh thích Bóng bàn là bao nhiêu % (chỉ điền số):',
            correctAnswer: '10',
            adminHint: 'Tổng tất cả các hình quạt bằng 100%. Lấy 100% - (45% + 30% + 15%) = 10%.',
            stepByStepSolution: 'Bước 1: Tổng phần trăm trong toàn bộ biểu đồ quạt tròn = 100%.\nBước 2: Phần trăm bóng bàn = 100% - (45% + 30% + 15%) = 100% - 90% = 10%.',
            explanation: 'Tỉ lệ học sinh thích Bóng bàn là 10%.',
            pointsXP: 20
          },
          {
            id: 'q18-4',
            lessonId: 'c5-l18',
            type: 'fill_in_blank',
            category: 'Tính số lượng thực tế từ %',
            difficulty: 'Trung bình',
            prompt: 'Một khối 7 có 200 học sinh. Biểu đồ quạt tròn cho biết có 25% học sinh xếp loại Xuất sắc. Số học sinh đạt loại Xuất sắc là bao nhiêu em (chỉ điền số):',
            correctAnswer: '50',
            adminHint: 'Lấy 200 nhân với 25% (tức là 200 · 0,25 = 50).',
            stepByStepSolution: 'Bước 1: Số học sinh xuất sắc = 200 · 25% = 200 · (25/100) = 50 em.',
            explanation: 'Số học sinh xếp loại Xuất sắc là 50 em.',
            pointsXP: 25
          },
          {
            id: 'q18-5',
            lessonId: 'c5-l18',
            type: 'multiple_choice',
            category: 'Tính chất biểu đồ quạt tròn',
            difficulty: 'Cơ bản',
            prompt: 'Trong biểu đồ hình quạt tròn, toàn bộ hình tròn biểu thị cho bao nhiêu phần trăm?',
            options: ['100%', '50%', '360%', '180%'],
            correctAnswer: '100%',
            adminHint: 'Biểu đồ hình quạt tròn dùng để so sánh các phần với toàn thể, trong đó toàn bộ hình tròn ứng với 100%.',
            stepByStepSolution: 'Bước 1: Biểu đồ hình quạt tròn chia một tổng thể 100% thành các hình quạt có góc tương ứng.',
            explanation: 'Toàn bộ hình tròn luôn biểu thị 100% của tổng thể.',
            pointsXP: 20
          }
        ,
          {
            id: 'q18-3',
            lessonId: 'c5-l18',
            type: 'fill_in_blank',
            category: 'Tính phần trăm còn lại',
            difficulty: 'Cơ bản',
            prompt: 'Một biểu đồ hình quạt tròn biểu diễn tỉ lệ học sinh thích thể thao: Bóng đá 45%, Cầu lông 30%, Bơi lội 15%, còn lại là Bóng bàn. Tỉ lệ học sinh thích Bóng bàn là bao nhiêu % (chỉ điền số):',
            correctAnswer: '10',
            adminHint: 'Tổng tất cả các hình quạt bằng 100%. Lấy 100% - (45% + 30% + 15%) = 10%.',
            stepByStepSolution: 'Bước 1: Tổng phần trăm trong toàn bộ biểu đồ quạt tròn = 100%.\nBước 2: Phần trăm bóng bàn = 100% - (45% + 30% + 15%) = 100% - 90% = 10%.',
            explanation: 'Tỉ lệ học sinh thích Bóng bàn là 10%.',
            pointsXP: 20
          },
          {
            id: 'q18-4',
            lessonId: 'c5-l18',
            type: 'fill_in_blank',
            category: 'Tính số lượng thực tế từ %',
            difficulty: 'Trung bình',
            prompt: 'Một khối 7 có 200 học sinh. Biểu đồ quạt tròn cho biết có 25% học sinh xếp loại Xuất sắc. Số học sinh đạt loại Xuất sắc là bao nhiêu em (chỉ điền số):',
            correctAnswer: '50',
            adminHint: 'Lấy 200 nhân với 25% (tức là 200 · 0,25 = 50).',
            stepByStepSolution: 'Bước 1: Số học sinh xuất sắc = 200 · 25% = 200 · (25/100) = 50 em.',
            explanation: 'Số học sinh xếp loại Xuất sắc là 50 em.',
            pointsXP: 25
          },
          {
            id: 'q18-5',
            lessonId: 'c5-l18',
            type: 'multiple_choice',
            category: 'Tính chất biểu đồ quạt tròn',
            difficulty: 'Cơ bản',
            prompt: 'Trong biểu đồ hình quạt tròn, toàn bộ hình tròn biểu thị cho bao nhiêu phần trăm?',
            options: ['100%', '50%', '360%', '180%'],
            correctAnswer: '100%',
            adminHint: 'Biểu đồ hình quạt tròn dùng để so sánh các phần với toàn thể, trong đó toàn bộ hình tròn ứng với 100%.',
            stepByStepSolution: 'Bước 1: Biểu đồ hình quạt tròn chia một tổng thể 100% thành các hình quạt có góc tương ứng.',
            explanation: 'Toàn bộ hình tròn luôn biểu thị 100% của tổng thể.',
            pointsXP: 20
          }
        ]
      },
      {
        id: 'c5-l19',
        chapterId: 'ch-5',
        number: 19,
        title: 'Biểu đồ đoạn thẳng',
        description: 'Đọc và phân tích biểu đồ đoạn thẳng, theo dõi xu hướng tăng giảm của dữ liệu theo thời gian.',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Biểu đồ đoạn thẳng thường dùng để biểu diễn sự thay đổi của một đại lượng theo thời gian (năm, tháng, ngày, giờ).',
            'Trục ngang thường biểu diễn mốc thời gian, trục đứng biểu diễn giá trị số liệu.',
            'Đoạn thẳng đi lên thể hiện xu hướng tăng, đi xuống thể hiện xu hướng giảm.'
          ],
          formulaSummary: [
            'Tăng/giảm = Giá trị sau - Giá trị trước'
          ],
          rules: ['Xác định đúng đơn vị đo trên trục đứng trước khi đọc số liệu.'],
          commonMistakes: ['Đọc nhầm giá trị giữa các mốc thời gian liền kề.']
        },
        examples: [
          {
            title: 'Ví dụ: Đọc xu hướng trên biểu đồ đoạn thẳng',
            problem: 'Nhiệt độ lúc 8h là 22°C, lúc 12h là 28°C. Hỏi nhiệt độ tăng bao nhiêu độ?',
            steps: [
              { stepNumber: 1, instruction: 'Tính độ tăng nhiệt độ', formula: '28°C - 22°C = 6°C' }
            ]
          }
        ],
        questions: [
          {
            id: 'q19-1',
            lessonId: 'c5-l19',
            type: 'multiple_choice',
            category: 'Ý nghĩa biểu đồ',
            difficulty: 'Cơ bản',
            prompt: 'Biểu đồ đoạn thẳng phù hợp nhất để biểu diễn nội dung nào sau đây?',
            options: [
              'Sự thay đổi nhiệt độ trong tuần của Hà Nội theo từng ngày',
              'Cơ cấu các loại sách trong thư viện',
              'Số lượng học sinh giỏi của 4 lớp',
              'Thị phần của 3 hãng điện thoại'
            ],
            correctAnswer: 'Sự thay đổi nhiệt độ trong tuần của Hà Nội theo từng ngày',
            adminHint: 'Biểu đồ đoạn thẳng tối ưu cho dữ liệu biến thiên theo trục thời gian liên tục.',
            stepByStepSolution: 'Bước 1: Biểu đồ đoạn thẳng chuyên dùng để theo dõi xu hướng thay đổi theo thời gian.\nBước 2: Nhiệt độ theo từng ngày trong tuần là chuỗi thời gian liên tục.',
            explanation: 'Biểu đồ đoạn thẳng thích hợp nhất để biểu diễn sự thay đổi theo thời gian.',
            pointsXP: 20
          },
          {
            id: 'q19-2',
            lessonId: 'c5-l19',
            type: 'fill_in_blank',
            category: 'Tính độ tăng giảm',
            difficulty: 'Cơ bản',
            prompt: 'Số lượng sách bán được của một cửa hàng: Thứ Hai bán được 40 cuốn, Thứ Ba bán được 65 cuốn. Hỏi Thứ Ba bán nhiều hơn Thứ Hai bao nhiêu cuốn sách:',
            correctAnswer: '25',
            adminHint: 'Lấy 65 - 40 = 25 cuốn.',
            stepByStepSolution: 'Bước 1: Số sách Thứ Ba: 65; Thứ Hai: 40.\nBước 2: Độ chênh lệch: 65 - 40 = 25 cuốn.',
            explanation: 'Thứ Ba bán nhiều hơn: 65 - 40 = 25 cuốn sách.',
            pointsXP: 20
          }
        ,
          {
            id: 'q19-3',
            lessonId: 'c5-l19',
            type: 'fill_in_blank',
            category: 'Đọc độ chênh lệch trên biểu đồ',
            difficulty: 'Cơ bản',
            prompt: 'Quan sát biểu đồ đoạn thẳng ghi nhận nhiệt độ lúc 12h trưa từ thứ Hai đến thứ Sáu: T2: 24°C, T3: 26°C, T4: 31°C, T5: 28°C, T6: 25°C. Nhiệt độ cao nhất hơn nhiệt độ thấp nhất bao nhiêu °C (chỉ điền số):',
            correctAnswer: '7',
            adminHint: 'Nhiệt độ cao nhất là 31°C (T4), thấp nhất là 24°C (T2). 31 - 24 = 7°C.',
            stepByStepSolution: 'Bước 1: Giá trị cao nhất: 31°C.\nBước 2: Giá trị thấp nhất: 24°C.\nBước 3: Hiệu = 31 - 24 = 7°C.',
            explanation: 'Độ chênh lệch nhiệt độ là 7°C.',
            pointsXP: 20
          },
          {
            id: 'q19-4',
            lessonId: 'c5-l19',
            type: 'multiple_choice',
            category: 'Ứng dụng biểu đồ đoạn thẳng',
            difficulty: 'Cơ bản',
            prompt: 'Biểu đồ đoạn thẳng thích hợp nhất khi cần biểu diễn nội dung nào dưới đây?',
            options: ['Sự biến thiên nhiệt độ hoặc lượng mưa theo thời gian', 'Tỉ lệ phần trăm các thành phần trong không khí', 'Số lượng học sinh giỏi của từng lớp', 'Tên danh sách các cuốn sách trong cặp'],
            correctAnswer: 'Sự biến thiên nhiệt độ hoặc lượng mưa theo thời gian',
            adminHint: 'Biểu đồ đoạn thẳng dùng để biểu diễn sự thay đổi của một đại lượng theo thời gian (xu hướng tăng/giảm).',
            stepByStepSolution: 'Bước 1: Đặc trưng của biểu đồ đoạn thẳng là trực quan hóa xu hướng biến đổi liên tục theo các mốc thời gian.',
            explanation: 'Biểu đồ đoạn thẳng thích hợp nhất để biểu diễn sự biến thiên theo thời gian.',
            pointsXP: 20
          },
          {
            id: 'q19-5',
            lessonId: 'c5-l19',
            type: 'multiple_choice',
            category: 'Trục tọa độ trong biểu đồ',
            difficulty: 'Trung bình',
            prompt: 'Trên một biểu đồ đoạn thẳng biểu diễn doanh thu một cửa hàng trong các tháng của năm, trục nằm ngang (trục hoành) thường ghi đại lượng nào?',
            options: ['Thời gian (các tháng trong năm)', 'Số tiền doanh thu (đồng)', 'Tỉ lệ phần trăm (%)', 'Tên nhân viên bán hàng'],
            correctAnswer: 'Thời gian (các tháng trong năm)',
            adminHint: 'Trục ngang luôn biểu diễn các mốc thời gian, trục đứng biểu diễn số liệu của đại lượng.',
            stepByStepSolution: 'Bước 1: Theo quy chuẩn biểu đồ đoạn thẳng, trục nằm ngang ghi các mốc thời gian (ngày, tháng, năm), trục thẳng đứng ghi giá trị định lượng.',
            explanation: 'Trục nằm ngang biểu diễn các mốc thời gian.',
            pointsXP: 20
          }
        ,
          {
            id: 'q19-3',
            lessonId: 'c5-l19',
            type: 'fill_in_blank',
            category: 'Đọc độ chênh lệch trên biểu đồ',
            difficulty: 'Cơ bản',
            prompt: 'Quan sát biểu đồ đoạn thẳng ghi nhận nhiệt độ lúc 12h trưa từ thứ Hai đến thứ Sáu: T2: 24°C, T3: 26°C, T4: 31°C, T5: 28°C, T6: 25°C. Nhiệt độ cao nhất hơn nhiệt độ thấp nhất bao nhiêu °C (chỉ điền số):',
            correctAnswer: '7',
            adminHint: 'Nhiệt độ cao nhất là 31°C (T4), thấp nhất là 24°C (T2). 31 - 24 = 7°C.',
            stepByStepSolution: 'Bước 1: Giá trị cao nhất: 31°C.\nBước 2: Giá trị thấp nhất: 24°C.\nBước 3: Hiệu = 31 - 24 = 7°C.',
            explanation: 'Độ chênh lệch nhiệt độ là 7°C.',
            pointsXP: 20
          },
          {
            id: 'q19-4',
            lessonId: 'c5-l19',
            type: 'multiple_choice',
            category: 'Ứng dụng biểu đồ đoạn thẳng',
            difficulty: 'Cơ bản',
            prompt: 'Biểu đồ đoạn thẳng thích hợp nhất khi cần biểu diễn nội dung nào dưới đây?',
            options: ['Sự biến thiên nhiệt độ hoặc lượng mưa theo thời gian', 'Tỉ lệ phần trăm các thành phần trong không khí', 'Số lượng học sinh giỏi của từng lớp', 'Tên danh sách các cuốn sách trong cặp'],
            correctAnswer: 'Sự biến thiên nhiệt độ hoặc lượng mưa theo thời gian',
            adminHint: 'Biểu đồ đoạn thẳng dùng để biểu diễn sự thay đổi của một đại lượng theo thời gian (xu hướng tăng/giảm).',
            stepByStepSolution: 'Bước 1: Đặc trưng của biểu đồ đoạn thẳng là trực quan hóa xu hướng biến đổi liên tục theo các mốc thời gian.',
            explanation: 'Biểu đồ đoạn thẳng thích hợp nhất để biểu diễn sự biến thiên theo thời gian.',
            pointsXP: 20
          },
          {
            id: 'q19-5',
            lessonId: 'c5-l19',
            type: 'multiple_choice',
            category: 'Trục tọa độ trong biểu đồ',
            difficulty: 'Trung bình',
            prompt: 'Trên một biểu đồ đoạn thẳng biểu diễn doanh thu một cửa hàng trong các tháng của năm, trục nằm ngang (trục hoành) thường ghi đại lượng nào?',
            options: ['Thời gian (các tháng trong năm)', 'Số tiền doanh thu (đồng)', 'Tỉ lệ phần trăm (%)', 'Tên nhân viên bán hàng'],
            correctAnswer: 'Thời gian (các tháng trong năm)',
            adminHint: 'Trục ngang luôn biểu diễn các mốc thời gian, trục đứng biểu diễn số liệu của đại lượng.',
            stepByStepSolution: 'Bước 1: Theo quy chuẩn biểu đồ đoạn thẳng, trục nằm ngang ghi các mốc thời gian (ngày, tháng, năm), trục thẳng đứng ghi giá trị định lượng.',
            explanation: 'Trục nằm ngang biểu diễn các mốc thời gian.',
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
    code: 'Chương VI',
    title: 'Tỉ Lệ Thức & Đại Lượng Tỉ Lệ',
    description: 'Tỉ lệ thức, tính chất dãy tỉ số bằng nhau, đại lượng tỉ lệ thuận và đại lượng tỉ lệ nghịch.',
    iconName: 'Percent',
    color: 'purple',
    lessons: [
      {
        id: 'c2-l20',
        chapterId: 'ch-6',
        number: 20,
        title: 'Tỉ lệ thức',
        description: 'Khái niệm tỉ lệ thức a/b = c/d, tính chất cơ bản nhân chéo a·d = b·c.',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Tỉ lệ thức là đẳng thức của hai tỉ số: a/b = c/d (còn viết là a:b = c:d).',
            'Tính chất 1: Nếu a/b = c/d thì a·d = b·c (tích ngoại tỉ bằng tích trung tỉ).',
            'Tính chất 2: Nếu a·d = b·c (với a, b, c, d ≠ 0) thì ta có các tỉ lệ thức: a/b = c/d, a/c = b/d, d/b = c/a, d/c = b/a.'
          ],
          formulaSummary: [
            'a/b = c/d <=> a·d = b·c',
            'x = (b·c)/a'
          ],
          rules: ['Dùng quy tắc nhân chéo để tìm số hạng chưa biết trong tỉ lệ thức.'],
          commonMistakes: ['Nhân chéo nhầm a với c hoặc b với d.']
        },
        examples: [
          {
            title: 'Ví dụ: Tìm x trong tỉ lệ thức',
            problem: 'Tìm x biết: x / 6 = 5 / 3',
            steps: [
              { stepNumber: 1, instruction: 'Nhân chéo', formula: 'x · 3 = 6 · 5' },
              { stepNumber: 2, instruction: 'Tính giá trị x', formula: '3x = 30 => x = 10' }
            ]
          }
        ],
        questions: [
          {
            id: 'q20-1',
            lessonId: 'c2-l20',
            type: 'fill_in_blank',
            category: 'Tìm x',
            difficulty: 'Cơ bản',
            prompt: 'Tìm x trong tỉ lệ thức: x / 6 = 5 / 3:',
            correctAnswer: '10',
            adminHint: 'Nhân chéo: 3x = 6 · 5 = 30 => x = 10.',
            stepByStepSolution: 'Bước 1: Áp dụng tính chất tỉ lệ thức: x · 3 = 6 · 5.\nBước 2: 3x = 30.\nBước 3: x = 30 / 3 = 10.',
            explanation: 'x = (6 · 5) / 3 = 10.',
            pointsXP: 20
          },
          {
            id: 'q20-2',
            lessonId: 'c2-l20',
            type: 'multiple_choice',
            category: 'Tính chất tỉ lệ thức',
            difficulty: 'Cơ bản',
            prompt: 'Từ đẳng thức 2 · 12 = 3 · 8, ta có thể suy ra tỉ lệ thức nào sau đây?',
            options: ['2/3 = 8/12', '2/8 = 12/3', '2/12 = 3/8', '3/2 = 8/12'],
            correctAnswer: '2/3 = 8/12',
            adminHint: 'Kiểm tra tích nhân chéo: 2 · 12 = 24 và 3 · 8 = 24.',
            stepByStepSolution: 'Bước 1: Kiểm tra tích ngoại tỉ và trung tỉ.\nBước 2: Với 2/3 = 8/12, tích chéo là 2 · 12 = 3 · 8 = 24 (đúng đẳng thức ban đầu).',
            explanation: '2/3 = 8/12 vì 2 · 12 = 3 · 8 = 24.',
            pointsXP: 20
          },
          {
            id: 'q20-3',
            lessonId: 'c2-l20',
            type: 'fill_in_blank',
            category: 'Tìm x',
            difficulty: 'Trung bình',
            prompt: 'Tìm x trong tỉ lệ thức: (-4)/x = 2/7:',
            correctAnswer: '-14',
            adminHint: '2x = -4 · 7 = -28 => x = -14.',
            stepByStepSolution: 'Bước 1: Nhân chéo: 2 · x = (-4) · 7.\nBước 2: 2x = -28.\nBước 3: x = -28 / 2 = -14.',
            explanation: 'x = (-4 · 7) / 2 = -14.',
            pointsXP: 25
          }
        ,
          {
            id: 'q20-4',
            lessonId: 'c2-l20',
            type: 'fill_in_blank',
            category: 'Tìm x dương trong tỉ lệ thức',
            difficulty: 'Trung bình',
            prompt: 'Tìm số thực dương x thỏa mãn tỉ lệ thức: x/4 = 9/x (chỉ điền số):',
            correctAnswer: '6',
            adminHint: 'Nhân chéo: x · x = 4 · 9 => x^2 = 36 => x = 6 (vì x > 0).',
            stepByStepSolution: 'Bước 1: Từ x/4 = 9/x suy ra x^2 = 4 · 9 = 36.\nBước 2: Vì x > 0 nên x = √36 = 6.',
            explanation: 'Giá trị x dương là 6.',
            pointsXP: 25
          },
          {
            id: 'q20-5',
            lessonId: 'c2-l20',
            type: 'multiple_choice',
            category: 'Lập tỉ lệ thức từ đẳng thức',
            difficulty: 'Cơ bản',
            prompt: 'Từ đẳng thức tích 2 · 12 = 3 · 8, tỉ lệ thức nào sau đây được viết SAI?',
            options: ['2/12 = 3/8', '2/3 = 8/12', '2/8 = 3/12', '12/3 = 8/2'],
            correctAnswer: '2/12 = 3/8',
            adminHint: 'Nhân chéo của 2/12 = 3/8 sẽ cho 2 · 8 = 12 · 3 (16 = 36), là sai!',
            stepByStepSolution: 'Bước 1: Kiểm tra tích chéo: ở phương án 2/12 = 3/8 thì tích chéo là 2 · 8 = 16 và 12 · 3 = 36 (khác nhau).\nBước 2: Do đó 2/12 = 3/8 là tỉ lệ thức sai.',
            explanation: 'Tỉ lệ thức 2/12 = 3/8 viết sai vì tích chéo không bằng nhau.',
            pointsXP: 20
          }
        ]
      },
      {
        id: 'c2-l21',
        chapterId: 'ch-6',
        number: 21,
        title: 'Tính chất của dãy tỉ số bằng nhau',
        description: 'Mở rộng tính chất a/b = c/d = (a+c)/(b+d) = (a-c)/(b-d) và ứng dụng chia tỉ lệ.',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Tính chất 1: a/b = c/d = (a + c)/(b + d) = (a - c)/(b - d) (với b ≠ ±d).',
            'Tính chất 2: a/b = c/d = e/f = (a + c + e)/(b + d + f) = (a - c + e)/(b - d + f).',
            'Ứng dụng: Dùng để giải các bài toán tìm hai hoặc nhiều đại lượng khi biết tỉ số và tổng hoặc hiệu của chúng.'
          ],
          formulaSummary: [
            'a/b = c/d = (a + c)/(b + d) = (a - c)/(b - d)',
            'x/2 = y/3 = (x + y)/(2 + 3)'
          ],
          rules: ['Dấu ở tử số như thế nào thì dấu ở mẫu số phải tương ứng như thế đó.'],
          commonMistakes: ['Tử số cộng mà mẫu số lại trừ hoặc ngược lại.']
        },
        examples: [
          {
            title: 'Ví dụ: Tìm x và y bằng dãy tỉ số bằng nhau',
            problem: 'Tìm x và y biết: x/2 = y/3 và x + y = 20',
            steps: [
              { stepNumber: 1, instruction: 'Áp dụng tính chất dãy tỉ số bằng nhau', formula: 'x/2 = y/3 = (x + y)/(2 + 3) = 20/5 = 4' },
              { stepNumber: 2, instruction: 'Tính x và y', formula: 'x = 2 · 4 = 8; y = 3 · 4 = 12' }
            ]
          }
        ],
        questions: [
          {
            id: 'q21-1',
            lessonId: 'c2-l21',
            type: 'fill_in_blank',
            category: 'Tìm x',
            difficulty: 'Cơ bản',
            prompt: 'Tìm x biết x/2 = y/3 và x + y = 20:',
            correctAnswer: '8',
            adminHint: 'x/2 = y/3 = (x+y)/(2+3) = 20/5 = 4 => x = 2 · 4 = 8.',
            stepByStepSolution: 'Bước 1: Áp dụng tính chất dãy tỉ số bằng nhau: x/2 = y/3 = (x + y) / (2 + 3) = 20 / 5 = 4.\nBước 2: x = 2 · 4 = 8.\nBước 3: y = 3 · 4 = 12.',
            explanation: 'x = 2 · 4 = 8.',
            pointsXP: 25
          },
          {
            id: 'q21-2',
            lessonId: 'c2-l21',
            type: 'fill_in_blank',
            category: 'Tìm y',
            difficulty: 'Cơ bản',
            prompt: 'Với bài toán trên (x/2 = y/3 và x + y = 20), tìm giá trị của y:',
            correctAnswer: '12',
            adminHint: 'y = 3 · 4 = 12.',
            stepByStepSolution: 'Bước 1: Dãy tỉ số bằng 4.\nBước 2: y = 3 · 4 = 12.',
            explanation: 'y = 3 · 4 = 12.',
            pointsXP: 25
          },
          {
            id: 'q21-3',
            lessonId: 'c2-l21',
            type: 'multiple_choice',
            category: 'Chia phần tỉ lệ',
            difficulty: 'Trung bình',
            prompt: 'Hai lớp 7A và 7B trồng được 60 cây. Biết số cây trồng được tỉ lệ với 2 và 3. Số cây lớp 7A trồng được là:',
            options: ['24 cây', '36 cây', '30 cây', '20 cây'],
            correctAnswer: '24 cây',
            adminHint: 'x/2 = y/3 = 60/5 = 12 => x = 2 · 12 = 24 cây.',
            stepByStepSolution: 'Bước 1: Gọi số cây 7A và 7B là x, y: x/2 = y/3 và x + y = 60.\nBước 2: x/2 = y/3 = 60/(2+3) = 12.\nBước 3: Số cây 7A là x = 2 · 12 = 24 cây.',
            explanation: 'Lớp 7A trồng được 24 cây (lớp 7B trồng được 36 cây).',
            pointsXP: 25
          }
        ,
          {
            id: 'q21-4',
            lessonId: 'c2-l21',
            type: 'fill_in_blank',
            category: 'Tìm x dãy tỉ số bằng nhau',
            difficulty: 'Trung bình',
            prompt: 'Cho x/3 = y/5 và x + y = 32. Giá trị của x là bao nhiêu (chỉ điền số):',
            correctAnswer: '12',
            adminHint: 'Áp dụng tính chất: x/3 = y/5 = (x + y)/(3 + 5) = 32/8 = 4 => x = 3 · 4 = 12.',
            stepByStepSolution: 'Bước 1: Áp dụng tính chất dãy tỉ số bằng nhau: x/3 = y/5 = (x+y)/(3+5) = 32/8 = 4.\nBước 2: x = 3 · 4 = 12.',
            explanation: 'Giá trị của x là 12.',
            pointsXP: 25
          },
          {
            id: 'q21-5',
            lessonId: 'c2-l21',
            type: 'multiple_choice',
            category: 'Công thức dãy tỉ số',
            difficulty: 'Cơ bản',
            prompt: 'Cho ba số x, y, z thỏa mãn x/2 = y/4 = z/6. Khẳng định nào sau đây là ĐÚNG?',
            options: ['x/2 = y/4 = z/6 = (x + y + z) / (2 + 4 + 6)', 'x/2 = y/4 = z/6 = (x + y + z) / (2 · 4 · 6)', 'x/2 = y/4 = z/6 = (x · y · z) / (2 + 4 + 6)', 'x/2 = y/4 = z/6 = (x - y + z) / (2 + 4 + 6)'],
            correctAnswer: 'x/2 = y/4 = z/6 = (x + y + z) / (2 + 4 + 6)',
            adminHint: 'Tính chất dãy tỉ số bằng nhau: cộng các tử thì cộng các mẫu số tương ứng.',
            stepByStepSolution: 'Bước 1: Tính chất dãy tỉ số bằng nhau: a/m = b/n = c/p = (a+b+c)/(m+n+p).',
            explanation: 'Khẳng định x/2 = y/4 = z/6 = (x + y + z) / (2 + 4 + 6) là đúng.',
            pointsXP: 20
          }
        ]
      },
      {
        id: 'c2-l22',
        chapterId: 'ch-6',
        number: 22,
        title: 'Đại lượng tỉ lệ thuận',
        description: 'Định nghĩa y = kx, tính chất tỉ số hai giá trị tương ứng không đổi, bài toán tỉ lệ thuận thực tế.',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Nếu đại lượng y liên hệ với đại lượng x theo công thức y = kx (với k là hằng số khác 0) thì y tỉ lệ thuận với x theo hệ số tỉ lệ k.',
            'Khi y tỉ lệ thuận với x theo hệ số tỉ lệ k thì x tỉ lệ thuận với y theo hệ số tỉ lệ 1/k.',
            'Tính chất: Tỉ số hai giá trị tương ứng của chúng luôn không đổi: y1/x1 = y2/x2 = ... = k.'
          ],
          formulaSummary: [
            'y = kx (k ≠ 0)',
            'y1/x1 = y2/x2 = k'
          ],
          rules: ['Khi x tăng bao nhiêu lần thì y cũng tăng bấy nhiêu lần.'],
          commonMistakes: ['Nhầm hệ số tỉ lệ của y đối với x là k, nhưng x đối với y là 1/k.']
        },
        examples: [
          {
            title: 'Ví dụ: Bài toán tỉ lệ thuận',
            problem: 'Biết 3 mét vải giá 150 000 đồng. Hỏi 5 mét vải cùng loại giá bao nhiêu tiền?',
            steps: [
              { stepNumber: 1, instruction: 'Tính giá 1 mét vải', formula: '150 000 : 3 = 50 000 đồng/m' },
              { stepNumber: 2, instruction: 'Tính giá 5 mét vải', formula: '5 · 50 000 = 250 000 đồng' }
            ]
          }
        ],
        questions: [
          {
            id: 'q22-1',
            lessonId: 'c2-l22',
            type: 'fill_in_blank',
            category: 'Hệ số tỉ lệ',
            difficulty: 'Cơ bản',
            prompt: 'Cho biết y tỉ lệ thuận với x theo công thức y = 3x. Khi x = 5 thì giá trị của y bằng:',
            correctAnswer: '15',
            adminHint: 'Thay x = 5 vào y = 3 · 5 = 15.',
            stepByStepSolution: 'Bước 1: Công thức y = 3x.\nBước 2: Thay x = 5: y = 3 · 5 = 15.',
            explanation: 'y = 3 · 5 = 15.',
            pointsXP: 20
          },
          {
            id: 'q22-2',
            lessonId: 'c2-l22',
            type: 'multiple_choice',
            category: 'Toán thực tế',
            difficulty: 'Cơ bản',
            prompt: 'Mua 5 quyển vở cùng loại hết 45 000 đồng. Hỏi mua 8 quyển vở như thế hết bao nhiêu tiền?',
            options: ['72 000 đồng', '64 000 đồng', '80 000 đồng', '56 000 đồng'],
            correctAnswer: '72 000 đồng',
            adminHint: 'Giá 1 quyển là 45 000 : 5 = 9 000 đồng. 8 quyển là 8 · 9 000 = 72 000 đồng.',
            stepByStepSolution: 'Bước 1: Giá tiền 1 quyển vở: 45 000 / 5 = 9 000 đồng.\nBước 2: Mua 8 quyển hết: 8 · 9 000 = 72 000 đồng.',
            explanation: '8 quyển vở có giá là 72 000 đồng.',
            pointsXP: 20
          }
        ,
          {
            id: 'q22-3',
            lessonId: 'c2-l22',
            type: 'fill_in_blank',
            category: 'Hệ số tỉ lệ thuận',
            difficulty: 'Cơ bản',
            prompt: 'Cho đại lượng y tỉ lệ thuận với đại lượng x theo hệ số tỉ lệ k = -3. Khi x = 5 thì giá trị của y bằng bao nhiêu (chỉ điền số):',
            correctAnswer: '-15',
            adminHint: 'y = k · x => y = (-3) · 5 = -15.',
            stepByStepSolution: 'Bước 1: Công thức tỉ lệ thuận: y = k · x.\nBước 2: Thay k = -3 và x = 5 => y = (-3) · 5 = -15.',
            explanation: 'Giá trị của y là -15.',
            pointsXP: 20
          },
          {
            id: 'q22-4',
            lessonId: 'c2-l22',
            type: 'fill_in_blank',
            category: 'Toán thực tế tỉ lệ thuận',
            difficulty: 'Trung bình',
            prompt: 'Biết 4 lít mật ong có khối lượng là 5,6 kg. Hỏi 7 lít mật ong cùng loại có khối lượng bao nhiêu kilôgam? (Nhập số thập phân dùng dấu phẩy hoặc chấm, ví dụ 9,8):',
            correctAnswer: '9,8',
            adminHint: '1 lít mật ong nặng 5,6 : 4 = 1,4 kg. 7 lít nặng 7 · 1,4 = 9,8 kg.',
            stepByStepSolution: 'Bước 1: Khối lượng 1 lít mật ong là 5,6 : 4 = 1,4 kg.\nBước 2: Khối lượng 7 lít mật ong là 1,4 · 7 = 9,8 kg.',
            explanation: '7 lít mật ong nặng 9,8 kg.',
            pointsXP: 25
          },
          {
            id: 'q22-5',
            lessonId: 'c2-l22',
            type: 'multiple_choice',
            category: 'Hệ số tỉ lệ ngược chiều',
            difficulty: 'Cơ bản',
            prompt: 'Nếu đại lượng y tỉ lệ thuận với đại lượng x theo hệ số tỉ lệ k (k ≠ 0) thì đại lượng x tỉ lệ thuận với y theo hệ số tỉ lệ:',
            options: ['1/k', 'k', '-k', 'k^2'],
            correctAnswer: '1/k',
            adminHint: 'Nếu y = k·x thì x = (1/k)·y.',
            stepByStepSolution: 'Bước 1: Từ y = k · x với k ≠ 0, chia cả hai vế cho k ta được x = (1/k) · y.\nBước 2: Vậy x tỉ lệ thuận với y theo hệ số 1/k.',
            explanation: 'Hệ số tỉ lệ của x đối với y là 1/k.',
            pointsXP: 20
          }
        ]
      },
      {
        id: 'c2-l23',
        chapterId: 'ch-6',
        number: 23,
        title: 'Đại lượng tỉ lệ nghịch',
        description: 'Định nghĩa y = a/x (hay x·y = a), tính chất tích hai giá trị tương ứng không đổi, bài toán năng suất thời gian.',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Nếu đại lượng y liên hệ với đại lượng x theo công thức y = a/x hay x·y = a (với a là hằng số khác 0) thì y tỉ lệ nghịch với x theo hệ số tỉ lệ a.',
            'Tính chất: Tích hai giá trị tương ứng luôn không đổi: x1·y1 = x2·y2 = ... = a.',
            'Tỉ số hai giá trị bất kì của đại lượng này bằng nghịch đảo tỉ số hai giá trị tương ứng của đại lượng kia: x1/x2 = y2/y1.'
          ],
          formulaSummary: [
            'y = a/x hay x·y = a (a ≠ 0)',
            'x1·y1 = x2·y2 = a'
          ],
          rules: ['Khi x tăng bao nhiêu lần thì y giảm đi bấy nhiêu lần.'],
          commonMistakes: ['Nhầm tính chất tỉ lệ thuận (thương không đổi) với tỉ lệ nghịch (tích không đổi).']
        },
        examples: [
          {
            title: 'Ví dụ: Bài toán tỉ lệ nghịch',
            problem: 'Một đội gồm 4 người làm xong một công việc trong 12 ngày. Hỏi 6 người (với cùng năng suất) làm xong công việc đó trong bao nhiêu ngày?',
            steps: [
              { stepNumber: 1, instruction: 'Xác định hệ số tỉ lệ (tổng số ngày công)', formula: 'a = 4 · 12 = 48 (ngày công)' },
              { stepNumber: 2, instruction: 'Tính thời gian 6 người làm xong', formula: '48 : 6 = 8 ngày' }
            ]
          }
        ],
        questions: [
          {
            id: 'q23-1',
            lessonId: 'c2-l23',
            type: 'fill_in_blank',
            category: 'Toán năng suất',
            difficulty: 'Trung bình',
            prompt: 'Một đội gồm 4 công nhân hoàn thành một công việc trong 12 ngày. Hỏi 6 công nhân (năng suất như nhau) sẽ làm xong công việc đó trong bao nhiêu ngày:',
            correctAnswer: '8',
            adminHint: 'Số người và số ngày tỉ lệ nghịch. Tích không đổi: 4 · 12 = 6 · x => x = 48 / 6 = 8 ngày.',
            stepByStepSolution: 'Bước 1: Gọi số ngày 6 công nhân làm xong là x.\nBước 2: Vì số người và thời gian tỉ lệ nghịch nên: 6 · x = 4 · 12 = 48.\nBước 3: x = 48 / 6 = 8 ngày.',
            explanation: '6 người làm xong công việc trong 8 ngày.',
            pointsXP: 25
          },
          {
            id: 'q23-2',
            lessonId: 'c2-l23',
            type: 'multiple_choice',
            category: 'Hệ số tỉ lệ nghịch',
            difficulty: 'Cơ bản',
            prompt: 'Nếu x và y tỉ lệ nghịch với nhau và khi x = 3 thì y = 4. Hệ số tỉ lệ a là:',
            options: ['12', '7', '4/3', '3/4'],
            correctAnswer: '12',
            adminHint: 'Hệ số tỉ lệ a = x · y = 3 · 4 = 12.',
            stepByStepSolution: 'Bước 1: Theo công thức đại lượng tỉ lệ nghịch: a = x · y.\nBước 2: Thay số: a = 3 · 4 = 12.',
            explanation: 'Hệ số tỉ lệ a = 3 · 4 = 12.',
            pointsXP: 20
          }
        ,
          {
            id: 'q23-3',
            lessonId: 'c2-l23',
            type: 'fill_in_blank',
            category: 'Bài toán tỉ lệ nghịch năng suất',
            difficulty: 'Trung bình',
            prompt: 'Có 12 công nhân hoàn thành một công việc trong 10 ngày. Muốn hoàn thành công việc đó trong 8 ngày (với cùng năng suất) thì cần bao nhiêu công nhân (chỉ điền số):',
            correctAnswer: '15',
            adminHint: 'Số công nhân và thời gian là hai đại lượng tỉ lệ nghịch: 12 · 10 = x · 8 => x = 120 / 8 = 15.',
            stepByStepSolution: 'Bước 1: Tổng khối lượng công việc là 12 · 10 = 120 (ngày công).\nBước 2: Trong 8 ngày, số công nhân cần là 120 : 8 = 15 công nhân.',
            explanation: 'Cần 15 công nhân để hoàn thành trong 8 ngày.',
            pointsXP: 25
          },
          {
            id: 'q23-4',
            lessonId: 'c2-l23',
            type: 'fill_in_blank',
            category: 'Tính giá trị tỉ lệ nghịch',
            difficulty: 'Cơ bản',
            prompt: 'Cho x và y là hai đại lượng tỉ lệ nghịch. Khi x = 4 thì y = 9. Khi x = 6 thì giá trị của y bằng bao nhiêu (chỉ điền số):',
            correctAnswer: '6',
            adminHint: 'Hệ số tỉ lệ a = x · y = 4 · 9 = 36. Khi x = 6 => y = 36 / 6 = 6.',
            stepByStepSolution: 'Bước 1: Tích x · y không đổi: a = 4 · 9 = 36.\nBước 2: Khi x = 6 thì y = 36 : 6 = 6.',
            explanation: 'Giá trị của y khi x = 6 là 6.',
            pointsXP: 20
          },
          {
            id: 'q23-5',
            lessonId: 'c2-l23',
            type: 'multiple_choice',
            category: 'Nhận dạng tỉ lệ nghịch',
            difficulty: 'Cơ bản',
            prompt: 'Công thức nào sau đây chứng tỏ hai đại lượng x và y tỉ lệ nghịch với nhau?',
            options: ['y = 12 / x', 'y = 12 · x', 'y = x + 12', 'y = x - 12'],
            correctAnswer: 'y = 12 / x',
            adminHint: 'Định nghĩa: y và x tỉ lệ nghịch khi y = a / x (hay x · y = a với a là hằng số khác 0).',
            stepByStepSolution: 'Bước 1: Đại lượng y tỉ lệ nghịch với x theo công thức y = a/x với a là hằng số.',
            explanation: 'Công thức y = 12/x biểu thị x và y tỉ lệ nghịch.',
            pointsXP: 20
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
    code: 'Chương VII',
    title: 'Biểu Thức Đại Số & Đa Thức',
    description: 'Biểu thức đại số, đơn thức, đa thức một biến, xác định bậc, hệ số cao nhất, hệ số tự do và tìm nghiệm.',
    iconName: 'Code',
    color: 'rose',
    lessons: [
      {
        id: 'c3-l24',
        chapterId: 'ch-7',
        number: 24,
        title: 'Biểu thức đại số',
        description: 'Khái niệm biểu thức đại số chứa chữ, biến số và tính giá trị biểu thức tại giá trị cho trước.',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Biểu thức đại số là biểu thức gồm các số, các chữ (đại diện cho số) và các phép toán (cộng, trừ, nhân, chia, nâng lên lũy thừa).',
            'Chữ trong biểu thức đại số gọi là biến số.',
            'Để tính giá trị của một biểu thức đại số tại những giá trị cho trước của các biến, ta thay các giá trị đó vào biểu thức rồi thực hiện các phép tính.'
          ],
          formulaSummary: [
            'Thay x = x0 vào P(x) => P(x0)'
          ],
          rules: ['Khi thay số âm vào biến x, luôn đặt số âm trong dấu ngoặc đơn: (-x0).'],
          commonMistakes: ['Tính 2x^2 với x = 3 thành (2·3)^2 = 36 (đúng là 2 · 3^2 = 2 · 9 = 18).']
        },
        examples: [
          {
            title: 'Ví dụ: Tính giá trị biểu thức',
            problem: 'Tính giá trị của biểu thức A = 2x^2 - 3x + 1 tại x = 2',
            steps: [
              { stepNumber: 1, instruction: 'Thay x = 2 vào biểu thức A', formula: 'A = 2 · (2)^2 - 3 · 2 + 1' },
              { stepNumber: 2, instruction: 'Tính lũy thừa trước', formula: 'A = 2 · 4 - 6 + 1' },
              { stepNumber: 3, instruction: 'Tính kết quả', formula: 'A = 8 - 6 + 1 = 3' }
            ]
          }
        ],
        questions: [
          {
            id: 'q24-1',
            lessonId: 'c3-l24',
            type: 'fill_in_blank',
            category: 'Tính giá trị biểu thức',
            difficulty: 'Cơ bản',
            prompt: 'Tính giá trị của biểu thức A = 2x^2 - 3x + 1 tại x = 2:',
            correctAnswer: '3',
            adminHint: 'Thay x = 2: 2 · (2)^2 - 3 · 2 + 1 = 2 · 4 - 6 + 1 = 3.',
            stepByStepSolution: 'Bước 1: Thay x = 2 vào A: A = 2 · 2^2 - 3 · 2 + 1.\nBước 2: Tính lũy thừa và nhân: A = 2 · 4 - 6 + 1 = 8 - 6 + 1.\nBước 3: A = 3.',
            explanation: 'Giá trị của biểu thức tại x = 2 là 3.',
            pointsXP: 20
          },
          {
            id: 'q24-2',
            lessonId: 'c3-l24',
            type: 'multiple_choice',
            category: 'Biểu thức đại số',
            difficulty: 'Cơ bản',
            prompt: 'Biểu thức đại số biểu thị "Chu vi của hình chữ nhật có chiều dài a và chiều rộng b" là:',
            options: ['2 · (a + b)', 'a · b', 'a + b', '2a + b'],
            correctAnswer: '2 · (a + b)',
            adminHint: 'Chu vi hình chữ nhật bằng (dài + rộng) nhân 2.',
            stepByStepSolution: 'Bước 1: Công thức chu vi hình chữ nhật là (chiều dài + chiều rộng) · 2.\nBước 2: Do đó biểu thức là 2 · (a + b).',
            explanation: 'Chu vi hình chữ nhật là 2(a + b).',
            pointsXP: 20
          },
          {
            id: 'q24-3',
            lessonId: 'c3-l24',
            type: 'fill_in_blank',
            category: 'Tính giá trị biểu thức',
            difficulty: 'Trung bình',
            prompt: 'Tính giá trị của biểu thức B = x^3 - 2x tại x = -1:',
            correctAnswer: '1',
            adminHint: 'Thay x = -1: (-1)^3 - 2·(-1) = -1 + 2 = 1.',
            stepByStepSolution: 'Bước 1: Thay x = -1: (-1)^3 - 2·(-1).\nBước 2: (-1)^3 = -1; -2·(-1) = +2.\nBước 3: -1 + 2 = 1.',
            explanation: 'B = (-1)^3 - 2(-1) = -1 + 2 = 1.',
            pointsXP: 25
          }
        ,
          {
            id: 'q24-4',
            lessonId: 'c3-l24',
            type: 'fill_in_blank',
            category: 'Tính giá trị biểu thức',
            difficulty: 'Trung bình',
            prompt: 'Tính giá trị của biểu thức B = 3x^2 - 5x + 2 khi x = -1 (chỉ điền số):',
            correctAnswer: '10',
            adminHint: 'Thay x = -1 vào: B = 3·(-1)^2 - 5·(-1) + 2 = 3·1 + 5 + 2 = 10.',
            stepByStepSolution: 'Bước 1: Thay x = -1 vào biểu thức B.\nBước 2: B = 3 · (-1)^2 - 5 · (-1) + 2 = 3 · 1 + 5 + 2 = 10.',
            explanation: 'Giá trị của biểu thức B tại x = -1 là 10.',
            pointsXP: 25
          },
          {
            id: 'q24-5',
            lessonId: 'c3-l24',
            type: 'multiple_choice',
            category: 'Viết biểu thức đại số',
            difficulty: 'Cơ bản',
            prompt: 'Biểu thức đại số biểu thị "Hiệu của hai lần số a và bình phương của số b" là:',
            options: ['2a - b^2', '(2a - b)^2', '2a^2 - b', '2(a - b^2)'],
            correctAnswer: '2a - b^2',
            adminHint: 'Hai lần a là 2a; bình phương của b là b^2; hiệu là phép trừ 2a - b^2.',
            stepByStepSolution: 'Bước 1: "Hai lần số a" là 2a.\nBước 2: "Bình phương của số b" là b^2.\nBước 3: Hiệu là 2a - b^2.',
            explanation: 'Biểu thức đúng là 2a - b^2.',
            pointsXP: 20
          }
        ]
      },
      {
        id: 'c3-l25',
        chapterId: 'ch-7',
        number: 25,
        title: 'Đa thức một biến, bậc và nghiệm',
        description: 'Khái niệm đa thức một biến, thu gọn sắp xếp, xác định bậc, hệ số cao nhất, hệ số tự do và tìm nghiệm của đa thức.',
        status: 'NOT_STARTED',
        accuracy: 0,
        totalAttempts: 0,
        correctCount: 0,
        timeSpentMinutes: 0,
        theory: {
          keyPoints: [
            'Đa thức một biến là tổng của những đơn thức của cùng một biến.',
            'Bậc của đa thức một biến (khác đa thức không, đã thu gọn) là số mũ cao nhất của biến trong đa thức đó.',
            'Hệ số của lũy thừa với số mũ cao nhất gọi là hệ số cao nhất. Hệ số của lũy thừa bậc 0 gọi là hệ số tự do.',
            'Nếu tại x = a, đa thức P(x) có giá trị bằng 0 (tức là P(a) = 0) thì a gọi là một nghiệm của đa thức P(x).'
          ],
          formulaSummary: [
            'P(a) = 0 <=> x = a là nghiệm của P(x)',
            'ax + b = 0 => x = -b/a (a ≠ 0)'
          ],
          rules: ['Luôn thu gọn đa thức trước khi xác định bậc và các hệ số.'],
          commonMistakes: ['Nghĩ rằng đa thức bậc n có thể có vô số nghiệm (thực tế đa thức bậc n có tối đa n nghiệm).']
        },
        examples: [
          {
            title: 'Ví dụ: Xác định bậc và tìm nghiệm',
            problem: 'Cho P(x) = 2x - 6. Xác định bậc của P(x) và tìm nghiệm của đa thức.',
            steps: [
              { stepNumber: 1, instruction: 'Xác định số mũ cao nhất của biến x', formula: 'x có số mũ 1 => Bậc của P(x) là 1' },
              { stepNumber: 2, instruction: 'Cho P(x) = 0 để tìm nghiệm', formula: '2x - 6 = 0 => 2x = 6 => x = 3' }
            ]
          }
        ],
        questions: [
          {
            id: 'q25-1',
            lessonId: 'c3-l25',
            type: 'fill_in_blank',
            category: 'Nghiệm đa thức',
            difficulty: 'Cơ bản',
            prompt: 'Tìm nghiệm của đa thức P(x) = 2x - 6 (nhập giá trị của x):',
            correctAnswer: '3',
            adminHint: 'Cho P(x) = 0 => 2x - 6 = 0 => 2x = 6 => x = 3.',
            stepByStepSolution: 'Bước 1: Cho đa thức bằng 0: 2x - 6 = 0.\nBước 2: Chuyển vế: 2x = 6.\nBước 3: x = 6 / 2 = 3.',
            explanation: 'Nghiệm của P(x) là x = 3 vì P(3) = 2·3 - 6 = 0.',
            pointsXP: 20
          },
          {
            id: 'q25-2',
            lessonId: 'c3-l25',
            type: 'fill_in_blank',
            category: 'Bậc đa thức',
            difficulty: 'Cơ bản',
            prompt: 'Xác định bậc của đa thức: Q(x) = 5x^4 - 2x^3 + x - 9 (nhập số nguyên chỉ bậc):',
            correctAnswer: '4',
            adminHint: 'Bậc của đa thức là số mũ cao nhất của biến x. Ở đây số mũ cao nhất là 4.',
            stepByStepSolution: 'Bước 1: Tìm các số mũ của biến x: 4, 3, 1, 0.\nBước 2: Số mũ lớn nhất là 4.\nBước 3: Do đó bậc của đa thức Q(x) là 4.',
            explanation: 'Bậc của đa thức là 4 vì 4 là số mũ cao nhất của biến.',
            pointsXP: 20
          },
          {
            id: 'q25-3',
            lessonId: 'c3-l25',
            type: 'multiple_choice',
            category: 'Hệ số cao nhất và tự do',
            difficulty: 'Cơ bản',
            prompt: 'Cho đa thức A(x) = 3x^3 - 7x + 5. Hệ số cao nhất và hệ số tự do lần lượt là:',
            options: [
              'Hệ số cao nhất là 3, hệ số tự do là 5',
              'Hệ số cao nhất là 5, hệ số tự do là 3',
              'Hệ số cao nhất là 3, hệ số tự do là -7',
              'Hệ số cao nhất là -7, hệ số tự do là 5'
            ],
            correctAnswer: 'Hệ số cao nhất là 3, hệ số tự do là 5',
            adminHint: 'Hệ số của x^3 là 3 (cao nhất), hệ số không chứa biến là 5 (tự do).',
            stepByStepSolution: 'Bước 1: Bậc cao nhất là x^3 có hệ số là 3 => Hệ số cao nhất là 3.\nBước 2: Hạng tử không chứa x là 5 => Hệ số tự do là 5.',
            explanation: 'Hệ số cao nhất là 3 (của x^3) và hệ số tự do là 5.',
            pointsXP: 20
          },
          {
            id: 'q25-4',
            lessonId: 'c3-l25',
            type: 'multiple_choice',
            category: 'Kiểm tra nghiệm',
            difficulty: 'Trung bình',
            prompt: 'Trong các số sau, số nào là nghiệm của đa thức H(x) = x^2 - 9?',
            options: ['x = 3', 'x = 0', 'x = 9', 'x = 1'],
            correctAnswer: 'x = 3',
            adminHint: 'Thay x = 3 vào H(x): 3^2 - 9 = 9 - 9 = 0 => x = 3 là nghiệm.',
            stepByStepSolution: 'Bước 1: Cho x^2 - 9 = 0 <=> x^2 = 9.\nBước 2: x = 3 hoặc x = -3.\nBước 3: Trong các phương án, x = 3 là nghiệm.',
            explanation: 'H(3) = 3^2 - 9 = 0 nên x = 3 là nghiệm của đa thức.',
            pointsXP: 25
          }
        ,
          {
            id: 'q25-5',
            lessonId: 'c3-l25',
            type: 'fill_in_blank',
            category: 'Nghiệm dương đa thức',
            difficulty: 'Trung bình',
            prompt: 'Tìm nghiệm dương của đa thức P(x) = x^2 - 16 (chỉ điền số):',
            correctAnswer: '4',
            adminHint: 'x^2 - 16 = 0 => x^2 = 16 => x = 4 hoặc x = -4. Nghiệm dương là 4.',
            stepByStepSolution: 'Bước 1: Cho P(x) = 0 <=> x^2 - 16 = 0 <=> x^2 = 16.\nBước 2: x = 4 hoặc x = -4.\nBước 3: Đề bài yêu cầu tìm nghiệm dương nên chọn x = 4.',
            explanation: 'Nghiệm dương của P(x) là 4.',
            pointsXP: 25
          },
          {
            id: 'q25-6',
            lessonId: 'c3-l25',
            type: 'multiple_choice',
            category: 'Bậc của đa thức sau thu gọn',
            difficulty: 'Trung bình',
            prompt: 'Bậc của đa thức A(x) = 3x^4 - 5x^3 + 2x - 3x^4 + 7x^2 - 1 sau khi thu gọn là:',
            options: ['3', '4', '2', '1'],
            correctAnswer: '3',
            adminHint: 'Thu gọn: (3x^4 - 3x^4) = 0. Hạng tử có bậc cao nhất còn lại là -5x^3 (bậc 3).',
            stepByStepSolution: 'Bước 1: Thu gọn đa thức: A(x) = (3x^4 - 3x^4) - 5x^3 + 7x^2 + 2x - 1 = -5x^3 + 7x^2 + 2x - 1.\nBước 2: Số mũ cao nhất của biến x là 3, vậy bậc của đa thức là 3.',
            explanation: 'Bậc của đa thức sau khi thu gọn là 3.',
            pointsXP: 25
          }
        ]
      }
    ]
  }
];
