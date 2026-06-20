import type { Incident } from "../../types";

export function IncidentCard({ incident }: { incident: Incident }) {
  return (
    <div className="rounded-[28px] border border-black/5 bg-white/85 p-5 shadow-[0_18px_50px_rgba(17,24,39,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex justify-between gap-4">
        <h3 className="font-semibold tracking-[-0.01em] text-ink dark:text-white">{incident.title}</h3>
        <span className="text-sm text-slate-500 dark:text-slate-400">{incident.status}</span>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{incident.description}</p>
    </div>
  );
}
