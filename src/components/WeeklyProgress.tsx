import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Goal } from '../types';
import { buildLast7DaysSchedule, formatLocalDateKey } from '../utils/storage';
import { CalendarDays, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';

interface WeeklyProgressProps {
  goal: Goal;
  onStartPractice?: () => void;
}

interface DayDatum {
  dateKey: string;
  dayName: string;
  dateLabel: string;
  fullLabel: string;
  count: number;
  isToday: boolean;
  metTarget: boolean;
}

const VIETNAMESE_WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const VIETNAMESE_WEEKDAYS_FULL = [
  'Chủ Nhật',
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy',
];

export const WeeklyProgress: React.FC<WeeklyProgressProps> = ({
  goal,
  onStartPractice,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [chartWidth, setChartWidth] = useState<number>(680);
  const [hoveredDay, setHoveredDay] = useState<DayDatum | null>(null);

  const dailyTarget = useMemo(() => {
    const target = Number(goal.weeklyTargetQuestions) || 15;
    return Math.max(1, Math.round((target / 7) * 10) / 10);
  }, [goal.weeklyTargetQuestions]);

  // Build 7-day rolling series strictly derived from the `goal` object
  const chartData: DayDatum[] = useMemo(() => {
    const sourceHistory =
      Array.isArray(goal.dailyCompletedQuestions) && goal.dailyCompletedQuestions.length > 0
        ? goal.dailyCompletedQuestions
        : buildLast7DaysSchedule(goal.completedQuestionsThisWeek);

    const countsByDate = new Map<string, number>();
    sourceHistory.forEach((entry) => {
      if (entry && entry.date) {
        countsByDate.set(entry.date, Math.max(0, Math.round(Number(entry.count) || 0)));
      }
    });

    const today = new Date();
    const todayKey = formatLocalDateKey(today);
    const days: DayDatum[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = formatLocalDateKey(d);
      const dayIdx = d.getDay();
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const count = countsByDate.get(key) ?? 0;

      days.push({
        dateKey: key,
        dayName: key === todayKey ? 'Hôm nay' : VIETNAMESE_WEEKDAYS[dayIdx],
        dateLabel: `${dd}/${mm}`,
        fullLabel: `${VIETNAMESE_WEEKDAYS_FULL[dayIdx]}, ${dd}/${mm}`,
        count,
        isToday: key === todayKey,
        metTarget: count >= dailyTarget,
      });
    }

    return days;
  }, [goal.dailyCompletedQuestions, goal.completedQuestionsThisWeek, dailyTarget]);

  const totalLast7Days = useMemo(
    () => chartData.reduce((sum, item) => sum + item.count, 0),
    [chartData]
  );

  const bestDay = useMemo(() => {
    return chartData.reduce(
      (best, curr) => (curr.count > best.count ? curr : best),
      chartData[0]
    );
  }, [chartData]);

  const avgPerDay = useMemo(
    () => (totalLast7Days / 7).toFixed(1),
    [totalLast7Days]
  );

  const weeklyTarget = Math.max(1, Number(goal.weeklyTargetQuestions) || 15);
  const weeklyCompletionPercent = Math.min(
    100,
    Math.round((totalLast7Days / weeklyTarget) * 100)
  );

  // Observe container width for crisp responsive D3 rendering
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateWidth = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0) {
        setChartWidth(Math.floor(rect.width));
      }
    };

    updateWidth();
    const observer = new ResizeObserver(() => updateWidth());
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Render D3 bar chart
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl || chartWidth <= 0) return;

    const height = 248;
    const margin = { top: 28, right: 20, bottom: 44, left: 36 };
    const innerWidth = Math.max(220, chartWidth - margin.left - margin.right);
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    svg
      .attr('width', chartWidth)
      .attr('height', height)
      .attr('viewBox', `0 0 ${chartWidth} ${height}`)
      .attr('role', 'img')
      .attr('aria-label', 'Biểu đồ cột số câu đã hoàn thành trong 7 ngày qua');

    const root = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const maxDataVal = d3.max(chartData, (d) => d.count) || 0;
    const yMax = Math.max(4, Math.ceil(Math.max(maxDataVal, dailyTarget) * 1.25));

    const xScale = d3
      .scaleBand<string>()
      .domain(chartData.map((d) => d.dateKey))
      .range([0, innerWidth])
      .padding(0.34);

    const yScale = d3
      .scaleLinear()
      .domain([0, yMax])
      .nice()
      .range([innerHeight, 0]);

    const tickValues = yScale
      .ticks(5)
      .filter((t) => Number.isInteger(t));

    // Horizontal grid lines
    root
      .append('g')
      .attr('class', 'grid-lines')
      .call(
        d3
          .axisLeft(yScale)
          .tickValues(tickValues)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      )
      .call((g) => g.select('.domain').remove())
      .call((g) =>
        g
          .selectAll('line')
          .attr('stroke', '#E2E8F0')
          .attr('stroke-dasharray', '3,4')
      );

    // Y-axis
    root
      .append('g')
      .call(
        d3
          .axisLeft(yScale)
          .tickValues(tickValues)
          .tickFormat((d) => String(d))
      )
      .call((g) => g.select('.domain').remove())
      .call((g) => g.selectAll('.tick line').remove())
      .call((g) =>
        g
          .selectAll('text')
          .attr('fill', '#64748B')
          .attr('font-size', '11px')
          .attr('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace')
          .style('font-variant-numeric', 'tabular-nums')
      );

    // X-axis baseline
    root
      .append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', innerHeight)
      .attr('y2', innerHeight)
      .attr('stroke', '#CBD5E1')
      .attr('stroke-width', 1);

    // Daily goal pace reference line
    const targetY = yScale(dailyTarget);
    if (targetY >= 0 && targetY <= innerHeight) {
      root
        .append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', targetY)
        .attr('y2', targetY)
        .attr('stroke', '#D97706')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '5,4');

      root
        .append('text')
        .attr('x', innerWidth - 4)
        .attr('y', Math.max(10, targetY - 6))
        .attr('text-anchor', 'end')
        .attr('fill', '#B45309')
        .attr('font-size', '11px')
        .attr('font-weight', '600')
        .text(`Mục tiêu/ngày: ${dailyTarget} câu`);
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const getBarColor = (d: DayDatum) => {
      if (d.count === 0) return '#E2E8F0';
      if (d.isToday) return '#059669';
      if (d.metTarget) return '#0D9488';
      return '#6EE7B7';
    };

    const getHoverColor = (d: DayDatum) => {
      if (d.count === 0) return '#CBD5E1';
      if (d.isToday) return '#047857';
      if (d.metTarget) return '#0F766E';
      return '#10B981';
    };

    // Helper for top-rounded bar path
    const createBarPath = (x: number, y: number, w: number, h: number, r: number) => {
      const clampedH = Math.max(0, h);
      const radius = Math.min(r, w / 2, clampedH);
      if (clampedH <= 0) {
        return `M${x},${innerHeight} L${x + w},${innerHeight}`;
      }
      return [
        `M${x},${y + clampedH}`,
        `L${x},${y + radius}`,
        `Q${x},${y} ${x + radius},${y}`,
        `L${x + w - radius},${y}`,
        `Q${x + w},${y} ${x + w},${y + radius}`,
        `L${x + w},${y + clampedH}`,
        'Z',
      ].join(' ');
    };

    // Bars group
    const barGroups = root
      .selectAll<SVGGElement, DayDatum>('.bar-group')
      .data(chartData, (d) => d.dateKey)
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .style('cursor', 'pointer')
      .on('mouseenter', function (_event, d) {
        d3.select(this).select('path.bar-shape').attr('fill', getHoverColor(d));
        setHoveredDay(d);
      })
      .on('mouseleave', function (_event, d) {
        d3.select(this).select('path.bar-shape').attr('fill', getBarColor(d));
        setHoveredDay(null);
      })
      .on('focus', function (_event, d) {
        d3.select(this).select('path.bar-shape').attr('fill', getHoverColor(d));
        setHoveredDay(d);
      })
      .on('blur', function (_event, d) {
        d3.select(this).select('path.bar-shape').attr('fill', getBarColor(d));
        setHoveredDay(null);
      });

    // Invisible full-column hit target for effortless touch/hover
    barGroups
      .append('rect')
      .attr('x', (d) => xScale(d.dateKey) || 0)
      .attr('y', 0)
      .attr('width', xScale.bandwidth())
      .attr('height', innerHeight)
      .attr('fill', 'transparent');

    // Bar paths
    const bars = barGroups
      .append('path')
      .attr('class', 'bar-shape')
      .attr('fill', (d) => getBarColor(d))
      .attr('tabindex', 0)
      .attr('aria-label', (d) => `${d.fullLabel}: ${d.count} câu đã hoàn thành`);

    if (prefersReducedMotion) {
      bars.attr('d', (d) => {
        const bx = xScale(d.dateKey) || 0;
        const bw = xScale.bandwidth();
        const barH = d.count === 0 ? 4 : Math.max(6, innerHeight - yScale(d.count));
        const by = innerHeight - barH;
        return createBarPath(bx, by, bw, barH, 6);
      });
    } else {
      bars
        .attr('d', (d) => {
          const bx = xScale(d.dateKey) || 0;
          const bw = xScale.bandwidth();
          return createBarPath(bx, innerHeight - 2, bw, 2, 2);
        })
        .transition()
        .duration(450)
        .delay((_d, i) => i * 40)
        .ease(d3.easeCubicOut)
        .attr('d', (d) => {
          const bx = xScale(d.dateKey) || 0;
          const bw = xScale.bandwidth();
          const barH = d.count === 0 ? 4 : Math.max(6, innerHeight - yScale(d.count));
          const by = innerHeight - barH;
          return createBarPath(bx, by, bw, barH, 6);
        });
    }

    // Value label above each bar
    barGroups
      .append('text')
      .attr('x', (d) => (xScale(d.dateKey) || 0) + xScale.bandwidth() / 2)
      .attr('y', (d) => {
        const barH = d.count === 0 ? 4 : Math.max(6, innerHeight - yScale(d.count));
        return innerHeight - barH - 7;
      })
      .attr('text-anchor', 'middle')
      .attr('fill', (d) => (d.count === 0 ? '#94A3B8' : d.isToday ? '#047857' : '#0F172A'))
      .attr('font-size', '12px')
      .attr('font-weight', (d) => (d.isToday || d.metTarget ? '700' : '600'))
      .attr('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace')
      .style('font-variant-numeric', 'tabular-nums')
      .text((d) => String(d.count));

    // X-axis weekday + date labels
    const xLabelGroups = root
      .selectAll<SVGGElement, DayDatum>('.x-label-group')
      .data(chartData, (d) => d.dateKey)
      .enter()
      .append('g')
      .attr(
        'transform',
        (d) => `translate(${(xScale(d.dateKey) || 0) + xScale.bandwidth() / 2}, ${innerHeight + 16})`
      );

    xLabelGroups
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('fill', (d) => (d.isToday ? '#059669' : '#334155'))
      .attr('font-size', '12px')
      .attr('font-weight', (d) => (d.isToday ? '700' : '600'))
      .text((d) => d.dayName);

    xLabelGroups
      .append('text')
      .attr('y', 14)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748B')
      .attr('font-size', '10px')
      .attr('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace')
      .style('font-variant-numeric', 'tabular-nums')
      .text((d) => d.dateLabel);
  }, [chartData, chartWidth, dailyTarget]);

  return (
    <section
      aria-label="Weekly Progress"
      className="h-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between gap-6"
    >
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <CalendarDays className="w-4 h-4 shrink-0" />
            <span>Tiến độ 7 ngày qua</span>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <span className="text-slate-500 font-normal">
              Đồng bộ từ mục tiêu tuần ({goal.completedQuestionsThisWeek}/{weeklyTarget} bài)
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Weekly Progress · Biểu đồ luyện tập 7 ngày gần nhất
          </h3>
        </div>

        {/* Clean interactive hover readout or legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 shrink-0">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600 inline-block" />
            <span>Hôm nay</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-teal-600 inline-block" />
            <span>Đạt chỉ tiêu ngày</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-300 inline-block" />
            <span>Đã luyện tập</span>
          </span>
        </div>
      </div>

      {/* Interactive Status Readout Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-slate-50 rounded-2xl px-4 py-2.5 border border-slate-200/70">
        {hoveredDay ? (
          <div className="flex flex-wrap items-center gap-2 text-slate-800">
            <span className="font-bold text-slate-900">
              {hoveredDay.fullLabel}
              {hoveredDay.isToday ? ' (Hôm nay)' : ''}
            </span>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <span className="font-mono tabular-nums font-bold text-emerald-700">
              {hoveredDay.count} câu đã hoàn thành
            </span>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <span className={hoveredDay.metTarget ? 'text-teal-700 font-semibold' : 'text-amber-700 font-medium'}>
              {hoveredDay.metTarget
                ? 'Đạt nhịp mục tiêu ngày'
                : `Cần thêm ${Math.max(1, Math.ceil(dailyTarget - hoveredDay.count))} câu để đạt nhịp ngày`}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-600">
            <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Di chuột hoặc chạm vào từng cột ngày để xem chi tiết số câu đã giải so với nhịp mục tiêu{' '}
              <strong className="font-mono tabular-nums text-slate-900">{dailyTarget} câu/ngày</strong>.
            </span>
          </div>
        )}

        <span className="font-mono tabular-nums font-semibold text-slate-700 shrink-0">
          Hoàn thành tuần: {weeklyCompletionPercent}%
        </span>
      </div>

      {/* D3 Bar Chart Canvas */}
      <div ref={containerRef} className="w-full overflow-hidden">
        <svg ref={svgRef} className="block w-full select-none" />
      </div>

      {/* Footer Summary Strip (Single elevation, clean hairline divider, tabular numerals) */}
      <div className="pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        <div className="space-y-0.5">
          <span className="text-xs text-slate-500 block">Tổng số câu 7 ngày qua</span>
          <div className="text-lg font-bold text-slate-900 font-mono tabular-nums flex items-baseline gap-1.5">
            <span>{totalLast7Days}</span>
            <span className="text-xs font-normal text-slate-500">
              / {weeklyTarget} câu mục tiêu
            </span>
          </div>
        </div>

        <div className="space-y-0.5 sm:border-l sm:border-slate-200/80 sm:pl-4">
          <span className="text-xs text-slate-500 block">Ngày học tích cực nhất</span>
          <div className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>{bestDay ? bestDay.fullLabel : '—'}</span>
            <span className="text-xs font-mono tabular-nums text-emerald-700 font-bold">
              ({bestDay ? bestDay.count : 0} câu)
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 sm:border-l sm:border-slate-200/80 sm:pl-4">
          <div className="space-y-0.5">
            <span className="text-xs text-slate-500 block">Trung bình mỗi ngày</span>
            <div className="text-lg font-bold text-slate-900 font-mono tabular-nums flex items-center gap-1.5">
              <span>{avgPerDay}</span>
              <span className="text-xs font-normal text-slate-500">câu/ngày</span>
              {totalLast7Days >= weeklyTarget && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
            </div>
          </div>

          {onStartPractice && (
            <button
              type="button"
              onClick={onStartPractice}
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Luyện thêm</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
