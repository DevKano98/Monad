import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  { name: "0x7a", score: 96 },
  { name: "0x42", score: 89 },
  { name: "0x19", score: 77 }
];

export function ReputationLeaderboard() {
  return (
    <div className="h-72 rounded-[28px] border border-black/5 bg-white/85 p-5 shadow-[0_18px_50px_rgba(17,24,39,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03]">
      <h3 className="mb-4 text-base font-semibold tracking-[-0.01em] text-ink dark:text-white">Trust score leaders</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Bar dataKey="score" fill="#494fdf" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
