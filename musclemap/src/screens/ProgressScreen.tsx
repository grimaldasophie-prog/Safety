import { CartesianGrid, Line, LineChart, ReferenceArea, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useStore } from '../lib/store';
import { assess, fmtPct, STATUS_COLOR } from '../lib/rules';
import { MISSION, PART_LABEL, history, type PartId } from '../data/demoData';
import { LESSONS } from '../data/lessons';
import { ScreenTitle } from '../components/ui';

export default function ProgressScreen() {
  return (
    <div className="px-5 pb-10 pt-6">
      <ScreenTitle kicker={`Day 0 – ${MISSION.chartEndDay}`} title="Progress" lesson={LESSONS.progress} />
      <div className="space-y-4">
        {(['calves', 'thighs', 'back'] as PartId[]).map((part) => (
          <PartChart key={part} part={part} />
        ))}
      </div>
      <p className="mt-5 text-[13px] leading-relaxed text-mist">
        100 % = your space baseline on day {MISSION.baselineDay}. Shaded: fluid shift period. Dashed line: landing on day {MISSION.landingDay}.
      </p>
    </div>
  );
}

function PartChart({ part }: { part: PartId }) {
    const { profile, day } = useStore();
    const a = assess(profile, part, day);
    const data = history(profile, part, day).map((m) => ({ day: m.day, value: Math.round((100 + m.pct) * 10) / 10 }));
    const color = STATUS_COLOR[a.status];
    const lastDay = data[data.length - 1]?.day;

    return (
      <section className="rounded-[22px] bg-blue px-4 pb-4 pt-4">
        <div className="flex items-start justify-between">
          <h2 className="font-display text-[20px] font-bold text-white">{PART_LABEL[part]}</h2>
          <div className="text-right">
            <div className="font-display text-[26px] font-bold leading-none tracking-[-0.02em]" style={{ color }}>
              {fmtPct(a.now.pct)}
            </div>
            <div className="mt-1 text-[12px] text-mist">today</div>
          </div>
        </div>

        <div className="-ml-3 mt-2 h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} stroke="#ffffff" strokeOpacity={0.08} />
              <ReferenceArea x1={0} x2={MISSION.baselineDay} fill="#FFFFFF" fillOpacity={0.06} ifOverflow="hidden" />
              <XAxis
                dataKey="day"
                type="number"
                domain={[0, MISSION.chartEndDay]}
                ticks={[0, 30, 60, 90, 120]}
                tick={{ fill: '#C9D3E3', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#ffffff', strokeOpacity: 0.2 }}
              />
              <YAxis
                domain={[90, 106]}
                ticks={[92, 96, 100, 104]}
                tick={{ fill: '#C9D3E3', fontSize: 12 }}
                tickFormatter={(v) => `${v}%`}
                tickLine={false}
                axisLine={false}
                width={44}
              />
              <ReferenceLine y={100} stroke="#FFFFFF" strokeOpacity={0.7} strokeDasharray="2 4" strokeWidth={1.5} />
              <ReferenceLine
                x={MISSION.landingDay}
                stroke="#FC3D21"
                strokeDasharray="5 4"
                strokeWidth={1.5}
                label={{ value: 'Land', position: 'insideTopRight', fill: '#FC3D21', fontSize: 12, fontWeight: 700 }}
              />
              <Tooltip
                cursor={{ stroke: '#ffffff', strokeOpacity: 0.3 }}
                contentStyle={{ background: '#0B1D3A', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13 }}
                labelStyle={{ color: '#C9D3E3' }}
                labelFormatter={(d) => `Day ${d}`}
                formatter={(v: number) => [`${v.toFixed(1)} %`, 'vs baseline']}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#FFFFFF"
                strokeWidth={2.5}
                isAnimationActive={true}
                animationDuration={700}
                dot={(props: { cx?: number; cy?: number; payload?: { day: number } }) => {
                  const { cx, cy, payload } = props;
                  if (cx == null || cy == null || payload?.day !== lastDay) return <g key={`d-${payload?.day}`} />;
                  return <circle key="last" cx={cx} cy={cy} r={6} fill={color} stroke="#0B3D91" strokeWidth={3} />;
                }}
                activeDot={{ r: 5, fill: '#FFFFFF', stroke: '#0B3D91', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-[15px] leading-snug text-white">{a.trendCaption}</p>
      </section>
    );
  }
