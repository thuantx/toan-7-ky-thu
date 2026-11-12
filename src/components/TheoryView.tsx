import React, { useState } from 'react';
import { Chapter, Lesson, Example } from '../data/curriculumData';
import { 
  BookOpen, 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight,
  Sparkles,
  HelpCircle,
  FileText
} from 'lucide-react';

interface TheoryViewProps {
  chapters: Chapter[];
  selectedLessonId: string;
  onSelectLesson: (id: string) => void;
  onStartPractice: (lessonId: string) => void;
}

export const TheoryView: React.FC<TheoryViewProps> = ({
  chapters,
  selectedLessonId,
  onSelectLesson,
  onStartPractice,
}) => {
  const allLessons = chapters.flatMap((c) => c.lessons);
  const currentLesson: Lesson = allLessons.find((l) => l.id === selectedLessonId) || allLessons[0];
  const currentChapter: Chapter = chapters.find((c) => c.lessons.some((l) => l.id === currentLesson.id)) || chapters[0];

  const [activeTab, setActiveTab] = useState<'theory' | 'examples' | 'mistakes'>('theory');

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header Toolbar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wide">
              <span>{currentChapter.code}</span>
              <span>·</span>
              <span>Bài {currentLesson.number}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-0.5">
              {currentLesson.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {currentLesson.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={currentLesson.id}
              onChange={(e) => onSelectLesson(e.target.value)}
              className="px-3.5 py-2 text-xs font-medium rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {allLessons.map((l) => (
                <option key={l.id} value={l.id}>
                  Bài {l.number}: {l.title}
                </option>
              ))}
            </select>

            <button
              onClick={() => onStartPractice(currentLesson.id)}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>Vào Luyện Tập</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3 LMS Parts Navigation Bar */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('theory')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 ${
              activeTab === 'theory'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>1. Khung Lý Thuyết Cốt Lõi</span>
          </button>

          <button
            onClick={() => setActiveTab('examples')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 ${
              activeTab === 'examples'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>2. Ví Dụ Mẫu (Step-by-Step)</span>
          </button>

          <button
            onClick={() => setActiveTab('mistakes')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 ${
              activeTab === 'mistakes'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>3. Bẫy Thường Gặp & Lưu Ý</span>
          </button>
        </div>
      </div>

      {/* 2. Main Content Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left / Center: Theory & Step-by-Step Walkthroughs */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'theory' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Trọng tâm kiến thức cần nhớ</span>
                </h3>

                <ul className="space-y-3">
                  {currentLesson.theory.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-sm text-slate-800 leading-relaxed">
                      <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Formula & Rule Box */}
              <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-3">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                  Công Thức & Quy Tắc Toán Học Trích Từ PDF
                </span>
                <div className="space-y-2">
                  {currentLesson.theory.formulaSummary.map((f, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-xl border border-emerald-200/60 text-sm font-mono font-bold text-emerald-950">
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pedagogical Guidance */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Phương pháp giải toán
                </span>
                <div className="space-y-2">
                  {currentLesson.theory.rules.map((rule, idx) => (
                    <p key={idx} className="text-xs text-slate-700 leading-relaxed flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{rule}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'examples' && (
            <div className="space-y-4">
              {currentLesson.examples.map((ex: Example, i) => (
                <div key={i} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg">
                      Ví dụ {i + 1}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {ex.title}
                    </h3>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-sm font-semibold text-slate-900">
                    Đề bài: {ex.problem}
                  </div>

                  {/* Step by step solve */}
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                      Các bước giải chi tiết (Step-by-step):
                    </span>

                    <div className="space-y-2.5">
                      {ex.steps.map((st) => (
                        <div key={st.stepNumber} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                          <span className="w-6 h-6 rounded-md bg-slate-800 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {st.stepNumber}
                          </span>
                          <div className="space-y-1">
                            <span className="text-xs text-slate-600 block">{st.instruction}</span>
                            <span className="text-sm font-mono font-bold text-emerald-800 block">
                              {st.formula}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {ex.note && (
                      <p className="text-xs text-slate-500 italic pt-1">
                        * Ghi chú: {ex.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'mistakes' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-rose-700">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-base font-bold text-slate-900">
                  Những lỗi sai học sinh lớp 7 hay mắc phải
                </h3>
              </div>

              <div className="space-y-3 pt-2">
                {currentLesson.theory.commonMistakes.map((mistake, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 flex items-start gap-3 text-xs sm:text-sm text-rose-950 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                      !
                    </span>
                    <span>{mistake}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Visual Learning Card & Quick Test */}
        <div className="lg:col-span-1 space-y-6">
          {/* Visual Roadmap Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Trực quan hóa Bản đồ Học tập
            </span>
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
              <img
                src="/src/assets/images/math_learning_roadmap_1794450742632.jpg"
                alt="Bản đồ học tập Toán 7"
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mỗi bài học là một trạm dừng chân trên Đảo Toán Học. Hoàn thành bài tập vận dụng để mở khóa trạm tiếp theo!
            </p>
          </div>

          {/* Quick Practice Trigger Card */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-6 shadow-md space-y-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold">Thử sức ngay!</h4>
              <p className="text-xs text-emerald-100">
                Bài {currentLesson.number} đang có {currentLesson.questions.length} câu hỏi vận dụng trắc nghiệm & điền số.
              </p>
            </div>

            <button
              onClick={() => onStartPractice(currentLesson.id)}
              className="w-full py-2.5 px-4 bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <span>Bắt đầu giải bài tập</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
