import React, { useState, useEffect } from 'react';
import { Chapter, Lesson, Example } from '../data/curriculumData';
import { 
  BookOpen, 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  ChevronDown,
  Compass
} from 'lucide-react';
import { QuickCatalogModal } from './QuickCatalogModal';

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

  const [showCatalogModal, setShowCatalogModal] = useState<boolean>(false);
  const [activeChapterTabId, setActiveChapterTabId] = useState<string>(currentChapter.id);

  // Sync active chapter when selected lesson changes
  useEffect(() => {
    setActiveChapterTabId(currentChapter.id);
  }, [currentChapter.id]);

  const displayedChapterLessons = chapters.find((c) => c.id === activeChapterTabId)?.lessons || currentChapter.lessons;

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header Toolbar with QUICK CATALOG SELECTION */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wide">
              <span>{currentChapter.code}</span>
              <span>·</span>
              <span>Bài {currentLesson.number}</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 font-medium">Toán 7 Kết Nối Tri Thức</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 tracking-tight">
              Bài {currentLesson.number}: {currentLesson.title}
            </h1>
            <p className="text-xs text-slate-500">
              {currentLesson.description}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
            {/* Quick Catalog Button */}
            <button
              onClick={() => setShowCatalogModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors shadow-xs"
              title="Mở danh mục chọn nhanh 25 bài học"
            >
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Danh mục 25 bài</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Quick Chapter Chips & Lesson Selector */}
        <div className="pt-2 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Chọn nhanh Chương lý thuyết:</span>
            </span>
            <button
              onClick={() => setShowCatalogModal(true)}
              className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              Xem danh mục đầy đủ →
            </button>
          </div>

          {/* Chapter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {chapters.map((ch) => {
              const isSelected = ch.id === activeChapterTabId;
              const hasCurrentLesson = ch.lessons.some((l) => l.id === currentLesson.id);
              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveChapterTabId(ch.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : hasCurrentLesson
                      ? 'bg-blue-100/80 text-blue-900 border border-blue-300/80'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{ch.code}: {ch.title.split(':')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Lesson Pills */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
            {displayedChapterLessons.map((l) => {
              const isCurrent = l.id === currentLesson.id;
              return (
                <button
                  key={l.id}
                  onClick={() => onSelectLesson(l.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                    isCurrent
                      ? 'bg-blue-600 text-white font-bold shadow-xs ring-2 ring-blue-500/20'
                      : 'bg-slate-50 hover:bg-blue-50 text-slate-700 border border-slate-200 hover:border-blue-300'
                  }`}
                  title={l.title}
                >
                  <span className="font-bold">Bài {l.number}:</span>
                  <span className="truncate max-w-[150px]">{l.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row with Khung Lý Thuyết and Vào Luyện Tập button (Same row!) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100/80 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Khung Lý Thuyết Cốt Lõi, Ví Dụ Mẫu & Bẫy Sai Lầm</span>
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                <button 
                  onClick={() => scrollToSection('sec-theory')}
                  className="hover:text-emerald-700 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>1. Lý thuyết</span>
                </button>
                <span>·</span>
                <button 
                  onClick={() => scrollToSection('sec-examples')}
                  className="hover:text-amber-700 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>2. Ví dụ ({currentLesson.examples.length})</span>
                </button>
                <span>·</span>
                <button 
                  onClick={() => scrollToSection('sec-mistakes')}
                  className="hover:text-rose-700 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  <span>3. Bẫy sai lầm ({currentLesson.theory.commonMistakes.length})</span>
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => onStartPractice(currentLesson.id)}
            className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
            title="Bắt đầu giải ngân hàng câu hỏi bài tập"
          >
            <span>Vào Luyện Tập</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Unified Content Zone (All 3 parts combined on 1 screen) */}
      <div className="space-y-6">
        
        {/* PHẦN 1: KHUNG LÝ THUYẾT CỐT LÕI */}
        <section id="sec-theory" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 scroll-mt-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">
                1
              </span>
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>Khung Lý Thuyết Cốt Lõi</span>
            </h3>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
              Kiến thức nền tảng
            </span>
          </div>

          {/* Key Points */}
          <div className="space-y-3.5">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Kiến Thức Trọng Tâm Cần Nắm:</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentLesson.theory.keyPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-sm sm:text-base text-slate-900 leading-relaxed font-medium flex items-start gap-3.5 hover:bg-emerald-50 transition-colors shadow-2xs"
                >
                  <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5 shadow-xs">
                    {idx + 1}
                  </span>
                  <span className="pt-0.5">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Formula Summary Box */}
          <div className="space-y-3.5 pt-3">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>Công Thức & Quy Tắc Cần Nhớ:</span>
            </h4>
            <div className="bg-slate-900 text-emerald-300 p-5 sm:p-6 rounded-2xl font-mono text-sm sm:text-base space-y-3 border border-slate-800 shadow-inner">
              {currentLesson.theory.formulaSummary.map((formula, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-slate-500 text-xs sm:text-sm font-sans font-bold">#{idx + 1}</span>
                  <span className="font-bold tracking-wide text-emerald-300">{formula}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Practical Rules */}
          {currentLesson.theory.rules.length > 0 && (
            <div className="space-y-2.5 pt-3">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600">
                Quy ước & Lưu ý khi giải bài:
              </h4>
              <ul className="list-disc pl-5 text-sm sm:text-base text-slate-700 space-y-2">
                {currentLesson.theory.rules.map((rule, idx) => (
                  <li key={idx} className="leading-relaxed font-normal">{rule}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* PHẦN 2: VÍ DỤ MINH HỌA STEP-BY-STEP */}
        <section id="sec-examples" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 scroll-mt-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 text-xs font-black flex items-center justify-center">
                2
              </span>
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <span>Ví Dụ Mẫu (Lời Giải Từng Bước Step-by-Step)</span>
            </h3>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
              {currentLesson.examples.length} ví dụ minh họa
            </span>
          </div>

          <div className="space-y-6">
            {currentLesson.examples.map((example, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs"
              >
                <div className="bg-slate-100/90 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span>{example.title}</span>
                  </span>
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md font-semibold border border-emerald-200/50">
                    Chuẩn SGK Kết Nối Tri Thức
                  </span>
                </div>

                <div className="p-5 sm:p-6 space-y-4">
                  <div className="text-sm sm:text-base font-medium text-slate-900 bg-amber-50/70 p-4 rounded-xl border border-amber-200/70 leading-relaxed">
                    <span className="font-bold text-amber-900 block mb-1.5 text-xs sm:text-sm uppercase tracking-wide">Đề bài:</span>
                    {example.problem}
                  </div>

                  <div className="space-y-2.5">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                      Các bước giải chi tiết:
                    </span>
                    <div className="space-y-3">
                      {example.steps.map((st) => (
                        <div
                          key={st.stepNumber}
                          className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm sm:text-base"
                        >
                          <div className="flex items-center gap-3 text-slate-900">
                            <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0 font-mono">
                              B{st.stepNumber}
                            </span>
                            <span className="leading-snug font-medium">{st.instruction}</span>
                          </div>
                          <span className="font-mono font-bold text-indigo-900 bg-white px-3.5 py-2 rounded-lg border border-slate-200 text-sm sm:text-base shrink-0 self-start sm:self-auto shadow-2xs">
                            {st.formula}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PHẦN 3: BẪY SAI LẦM THƯỜNG GẶP */}
        <section id="sec-mistakes" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5 scroll-mt-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 text-xs font-black flex items-center justify-center">
                3
              </span>
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <span>Bẫy Sai Lầm Học Sinh Lớp 7 Thường Mắc Phải</span>
            </h3>
            <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200/60">
              {currentLesson.theory.commonMistakes.length} lỗi hay gặp
            </span>
          </div>

          <p className="text-sm text-slate-600">
            Phân tích các lỗi sai phổ biến được đúc kết từ quá trình chấm bài và kinh nghiệm thi cử thực tế:
          </p>

          <div className="space-y-3.5 pt-1">
            {currentLesson.theory.commonMistakes.map((mistake, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-rose-50/70 border border-rose-200 text-sm sm:text-base text-rose-950 flex items-start gap-3.5 hover:bg-rose-50 transition-colors shadow-2xs"
              >
                <span className="w-7 h-7 rounded-xl bg-rose-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
                  !
                </span>
                <div className="space-y-1">
                  <span className="font-bold block text-rose-900 text-sm sm:text-base">
                    Bẫy số {idx + 1}:
                  </span>
                  <p className="leading-relaxed text-slate-800 font-medium">{mistake}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM CTA: Vào luyện tập ngay sau khi đọc xong lý thuyết */}
        <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-sm">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-white/20 rounded-md text-[11px] font-bold uppercase tracking-wider text-emerald-100">
                Sẵn sàng thực hành
              </span>
              <span className="text-xs text-emerald-200">
                {currentLesson.questions.length} câu hỏi đang chờ
              </span>
            </div>
            <h4 className="text-lg font-black tracking-tight">
              Em đã nắm vững lý thuyết Bài {currentLesson.number}?
            </h4>
            <p className="text-xs text-emerald-100/90 max-w-xl leading-relaxed">
              Hãy bước vào phần luyện tập để giải các bài tập trắc nghiệm và điền số, tích lũy điểm kinh nghiệm (XP) và mở khóa huy hiệu học tập!
            </p>
          </div>
          <button
            onClick={() => onStartPractice(currentLesson.id)}
            className="px-6 py-3.5 text-xs sm:text-sm font-bold text-emerald-950 bg-white hover:bg-emerald-50 active:scale-95 rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 shrink-0"
          >
            <span>Bắt Đầu Luyện Tập Ngay</span>
            <ArrowRight className="w-4 h-4 text-emerald-700" />
          </button>
        </div>

      </div>

      {/* Quick Catalog Modal */}
      <QuickCatalogModal
        isOpen={showCatalogModal}
        onClose={() => setShowCatalogModal(false)}
        chapters={chapters}
        currentLessonId={currentLesson.id}
        onSelectLesson={onSelectLesson}
        mode="theory"
      />
    </div>
  );
};
