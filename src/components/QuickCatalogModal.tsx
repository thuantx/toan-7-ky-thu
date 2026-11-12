import React, { useState } from 'react';
import { Chapter, Lesson } from '../data/curriculumData';
import { 
  X, 
  Search, 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  Trophy, 
  ArrowRight,
  Layers,
  Star
} from 'lucide-react';

interface QuickCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: Chapter[];
  currentLessonId: string;
  onSelectLesson: (lessonId: string) => void;
  mode?: 'practice' | 'theory';
}

export const QuickCatalogModal: React.FC<QuickCatalogModalProps> = ({
  isOpen,
  onClose,
  chapters,
  currentLessonId,
  onSelectLesson,
  mode = 'practice',
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    chapters.find((c) => c.lessons.some((l) => l.id === currentLessonId))?.id || chapters[0].id
  );

  if (!isOpen) return null;

  const allLessons = chapters.flatMap((c) => c.lessons);
  const activeChapter = chapters.find((c) => c.id === selectedChapterId) || chapters[0];

  // Filter lessons by search query
  const searchResults = searchQuery.trim()
    ? allLessons.filter(
        (l) =>
          l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          `bài ${l.number}`.includes(searchQuery.toLowerCase()) ||
          l.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden my-auto flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                Danh Mục 25 Bài Học Toán 7
              </h2>
              <p className="text-xs text-emerald-100">
                {mode === 'practice' ? 'Chọn nhanh bài tập để bắt đầu luyện tập' : 'Chọn nhanh bài học để xem lý thuyết & ví dụ mẫu'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/70 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm nhanh theo tên bài học (Ví dụ: Số hữu tỉ, Tam giác, Tìm x, Tỉ lệ thức, Đa thức)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-slate-200 focus:border-emerald-500 focus:outline-none bg-white shadow-xs"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {searchResults ? (
            /* Search Results Mode */
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Kết quả tìm kiếm ({searchResults.length} bài):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {searchResults.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      onSelectLesson(l.id);
                      onClose();
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 ${
                      l.id === currentLessonId
                        ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase block">
                        Bài {l.number}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {l.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {l.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Chapter Tabs & Lessons Grid Mode */
            <div className="space-y-4">
              {/* Chapter Horizontal Selector Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {chapters.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChapterId(ch.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                      ch.id === selectedChapterId
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{ch.code}</span>
                  </button>
                ))}
              </div>

              {/* Active Chapter Details Header */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
                    {activeChapter.code}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    {activeChapter.title}
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-500 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                  {activeChapter.lessons.length} bài học
                </span>
              </div>

              {/* Lessons Grid for Active Chapter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeChapter.lessons.map((lesson) => {
                  const isCurrent = lesson.id === currentLessonId;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        onSelectLesson(lesson.id);
                        onClose();
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 group ${
                        isCurrent
                          ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
                            Bài {lesson.number}
                          </span>
                          {lesson.status === 'MASTER' && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-amber-500" />
                              <span>Master</span>
                            </span>
                          )}
                          {lesson.status === 'COMPLETED' && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-md">
                              Đã xong
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                          {lesson.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1 leading-snug">
                          {lesson.description}
                        </p>
                        <div className="text-[10px] text-slate-400 font-mono pt-1">
                          {lesson.questions.length} câu hỏi · Độ chính xác: {lesson.accuracy}%
                        </div>

                        {lesson.sections && lesson.sections.length > 0 && (
                          <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                            {lesson.sections.map((s) => (
                              <span key={s.id} className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.2 rounded border border-emerald-200/60">
                                {s.code}: {s.shortTitle || s.title} ({s.examples.length} ví dụ)
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="shrink-0 mt-1">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs transition-colors ${
                          isCurrent 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-800'
                        }`}>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Sách giáo khoa Toán 7 Kết Nối Tri Thức với Cuộc Sống</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
