import React, { useState } from 'react';
import { SPECIFICATION_DOCUMENT } from '../data/specificationData';
import { 
  FileText, 
  Copy, 
  Check, 
  Database, 
  ShieldCheck, 
  Activity, 
  Layers, 
  Cpu,
  Download,
  Share2
} from 'lucide-react';

export const SpecificationView: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>(SPECIFICATION_DOCUMENT.sections[0].id);
  const [copied, setCopied] = useState<boolean>(false);

  const activeSection =
    SPECIFICATION_DOCUMENT.sections.find((s) => s.id === activeSectionId) ||
    SPECIFICATION_DOCUMENT.sections[0];

  const handleCopyFullMarkdown = () => {
    const fullMd = `# ${SPECIFICATION_DOCUMENT.title}
## ${SPECIFICATION_DOCUMENT.subTitle}
Phiên bản: ${SPECIFICATION_DOCUMENT.version} | Tác giả: ${SPECIFICATION_DOCUMENT.author}
Tài liệu nguồn: ${SPECIFICATION_DOCUMENT.derivedFrom} | Ngày lập: ${SPECIFICATION_DOCUMENT.date}

---

${SPECIFICATION_DOCUMENT.sections.map((s) => `## ${s.title}\n\n${s.content}`).join('\n\n---\n\n')}
`;
    navigator.clipboard.writeText(fullMd);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wide">
            <Cpu className="w-4 h-4" />
            <span>Tài Liệu Đặc Tả Nghiệp Vụ BA & Kiến Trúc Hệ Thống (SRS)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
            {SPECIFICATION_DOCUMENT.title}
          </h1>
          <p className="text-xs text-slate-500">
            Nguồn dữ liệu: <span className="font-semibold text-slate-700">{SPECIFICATION_DOCUMENT.derivedFrom}</span> · {SPECIFICATION_DOCUMENT.version}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleCopyFullMarkdown}
            className="px-4 py-2 text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Đã sao chép Markdown!' : 'Sao chép Markdown'}</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Navigation & Section Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm space-y-1.5 sticky top-20">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 block">
            Mục lục tài liệu
          </span>

          {SPECIFICATION_DOCUMENT.sections.map((sec, idx) => (
            <button
              key={sec.id}
              onClick={() => setActiveSectionId(sec.id)}
              className={`w-full text-left p-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between gap-2 ${
                activeSectionId === sec.id
                  ? 'bg-purple-50 text-purple-950 border border-purple-200 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="line-clamp-2 leading-relaxed">{sec.title}</span>
              <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 font-mono text-[10px] flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
            </button>
          ))}
        </div>

        {/* Content Viewer */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              {activeSection.title}
            </h2>
            <span className="text-xs font-mono font-medium text-slate-400">
              Phần {SPECIFICATION_DOCUMENT.sections.findIndex((s) => s.id === activeSection.id) + 1} / {SPECIFICATION_DOCUMENT.sections.length}
            </span>
          </div>

          {/* Render formatted specification text */}
          <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-4">
            {activeSection.content.split('\n\n').map((paragraph, pIdx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={pIdx} className="text-base font-bold text-slate-900 pt-3 border-b border-slate-100 pb-1">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('#### ')) {
                return (
                  <h4 key={pIdx} className="text-sm font-bold text-purple-900 pt-2">
                    {paragraph.replace('#### ', '')}
                  </h4>
                );
              }
              if (paragraph.startsWith('```')) {
                const codeContent = paragraph.replace(/```[a-z]*\n?/g, '').trim();
                return (
                  <pre key={pIdx} className="p-4 bg-slate-950 text-emerald-400 rounded-2xl font-mono text-xs overflow-x-auto shadow-inner leading-relaxed">
                    <code>{codeContent}</code>
                  </pre>
                );
              }
              if (paragraph.includes('|')) {
                // Table parsing
                const rows = paragraph.trim().split('\n').filter((r) => !r.includes(':---'));
                if (rows.length > 0) {
                  const headerCols = rows[0].split('|').filter(Boolean).map((c) => c.trim());
                  const bodyRows = rows.slice(1).map((r) => r.split('|').filter(Boolean).map((c) => c.trim()));

                  return (
                    <div key={pIdx} className="overflow-x-auto my-3 rounded-2xl border border-slate-200">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-200">
                          <tr>
                            {headerCols.map((h, i) => (
                              <th key={i} className="py-2.5 px-3.5 whitespace-nowrap">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {bodyRows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-50/80">
                              {row.map((col, cIdx) => (
                                <td key={cIdx} className="py-2.5 px-3.5 text-slate-700">
                                  {col.startsWith('`') ? (
                                    <code className="bg-slate-100 px-1.5 py-0.5 rounded text-purple-700 font-mono text-[11px]">
                                      {col.replace(/`/g, '')}
                                    </code>
                                  ) : (
                                    col
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }
              }

              return (
                <p key={pIdx} className="text-slate-700 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
