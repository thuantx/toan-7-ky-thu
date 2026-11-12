import React, { useState } from 'react';
import { Goal } from '../types';
import { Target, X, Check, Sparkles, Calendar, BookOpen, Award } from 'lucide-react';

interface GoalModalProps {
  currentGoal: Goal;
  isOpen: boolean;
  onClose: () => void;
  onSaveGoal: (updatedGoal: Goal) => void;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  currentGoal,
  isOpen,
  onClose,
  onSaveGoal,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(currentGoal.title);
  const [scope, setScope] = useState<Goal['scope']>(currentGoal.scope);
  const [targetGrade, setTargetGrade] = useState<number>(currentGoal.targetGrade);
  const [targetDate, setTargetDate] = useState<string>(currentGoal.targetDate);

  // Dynamic interpolation math:
  // If targetGrade is 9.0 -> targetAccuracy is 90%, weekly target questions is 15-20 questions
  const calculatedAccuracy = Math.round(targetGrade * 10);
  const calculatedWeeklyQuestions = scope === 'FULL_YEAR' ? 20 : scope === 'SEMESTER' ? 15 : 12;

  const handleSave = () => {
    const updated: Goal = {
      ...currentGoal,
      title,
      scope,
      targetGrade,
      targetDate,
      targetAccuracy: calculatedAccuracy,
      weeklyTargetQuestions: calculatedWeeklyQuestions,
      recommendedMessage: `Để đạt mục tiêu "${title}", tuần này em cần hoàn thành ${calculatedWeeklyQuestions} bài tập vận dụng với độ chính xác trên ${calculatedAccuracy}%!`,
    };
    onSaveGoal(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Target className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Thiết Lập Mục Tiêu Học Tập
              </h3>
              <p className="text-xs text-slate-500">
                Hệ thống tự động nội suy thành các nhiệm vụ tuần (Micro-Goals)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preset Goals Picker */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Chọn mục tiêu mẫu nhanh:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { t: 'Đạt danh hiệu Học sinh Giỏi Toán (9.0+)', s: 'SEMESTER' as const, g: 9.0 },
              { t: 'Hoàn thành 100% bài tập Chương I', s: 'CHAPTER' as const, g: 8.5 },
              { t: 'Bứt phá điểm 10 Khảo sát Học kỳ 1', s: 'SEMESTER' as const, g: 10.0 },
              { t: 'Chinh phục Cả năm Toán 7 Xuất sắc', s: 'FULL_YEAR' as const, g: 9.5 },
            ].map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setTitle(preset.t);
                  setScope(preset.s);
                  setTargetGrade(preset.g);
                }}
                className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                  title === preset.t
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500'
                    : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700'
                }`}
              >
                {preset.t}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Form Fields */}
        <div className="space-y-4 pt-1">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Tên mục tiêu:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Điểm số kỳ vọng (0 - 10):
              </label>
              <input
                type="number"
                step="0.5"
                min="5"
                max="10"
                value={targetGrade}
                onChange={(e) => setTargetGrade(parseFloat(e.target.value) || 8)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Hạn chót hoàn thành:
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Auto-interpolation preview */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Kết quả nội suy mục tiêu tự động (Micro-Goals):</span>
          </div>
          <ul className="text-xs text-amber-950 space-y-1 pl-2">
            <li>• Khối lượng tuần: <strong>{calculatedWeeklyQuestions} bài tập vận dụng</strong></li>
            <li>• Độ chính xác yêu cầu: <strong>≥ {calculatedAccuracy}%</strong></li>
            <li>• Thuật toán đề xuất: <strong>Tập trung lấp lỗ hổng kỹ năng yếu trước khi sang chương mới</strong></li>
          </ul>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Lưu & Kích hoạt mục tiêu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
