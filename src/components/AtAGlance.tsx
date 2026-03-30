"use client";

import { useState } from "react";
import { Task } from "@/lib/types";
import { FREQUENCY_LABELS } from "@/lib/default-tasks";

interface Props {
  tasks: Task[];
}

export default function AtAGlance({ tasks }: Props) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Parse "YYYY-MM-DD" as local midnight instead of UTC midnight
  function parseDate(dateStr: string): Date {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thirtyAgo = new Date(today);
  thirtyAgo.setDate(thirtyAgo.getDate() - 30);
  const thirtyAhead = new Date(today);
  thirtyAhead.setDate(thirtyAhead.getDate() + 30);

  const completedTasks = tasks.filter((t) => {
    if (!t.last_completed_date) return false;
    const d = parseDate(t.last_completed_date);
    return d >= thirtyAgo && d <= today;
  });

  const upcomingTasks = tasks.filter((t) => {
    if (!t.next_due_date) return false;
    const d = parseDate(t.next_due_date);
    return d >= today && d <= thirtyAhead;
  });

  const overdueTasks = tasks.filter((t) => {
    if (!t.next_due_date) return false;
    const d = parseDate(t.next_due_date);
    return d < today;
  });

  function toggle(card: string) {
    setExpandedCard(expandedCard === card ? null : card);
  }

  function freqLabel(freq: string) {
    return FREQUENCY_LABELS[freq as keyof typeof FREQUENCY_LABELS] || freq;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Done card */}
      <div className="bg-white rounded-xl shadow-sm border border-brown-100 overflow-hidden">
        <button
          onClick={() => toggle("done")}
          className="w-full p-5 text-left cursor-pointer hover:bg-green-50/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-2xl font-bold text-brown-900">{completedTasks.length}</p>
              <p className="text-sm text-brown-500">Done (last 30 days)</p>
            </div>
            {completedTasks.length > 0 && (
              <svg className={`w-4 h-4 text-brown-400 transition-transform ${expandedCard === "done" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </div>
        </button>
        {expandedCard === "done" && completedTasks.length > 0 && (
          <div className="border-t border-brown-100 px-5 py-3 space-y-2 max-h-60 overflow-y-auto">
            {completedTasks.map((t) => (
              <div key={t.id} className="flex items-start gap-2 text-sm">
                <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <div className="min-w-0">
                  <p className="text-brown-700 truncate">{t.name}</p>
                  <p className="text-xs text-brown-400">
                    {freqLabel(t.frequency)} &middot; Completed {parseDate(t.last_completed_date!).toLocaleDateString()}
                    {t.next_due_date && <> &middot; Next: {parseDate(t.next_due_date).toLocaleDateString()}</>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming card */}
      <div className="bg-white rounded-xl shadow-sm border border-brown-100 overflow-hidden">
        <button
          onClick={() => toggle("upcoming")}
          className="w-full p-5 text-left cursor-pointer hover:bg-blue-50/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-2xl font-bold text-brown-900">{upcomingTasks.length}</p>
              <p className="text-sm text-brown-500">Upcoming (next 30 days)</p>
            </div>
            {upcomingTasks.length > 0 && (
              <svg className={`w-4 h-4 text-brown-400 transition-transform ${expandedCard === "upcoming" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </div>
        </button>
        {expandedCard === "upcoming" && upcomingTasks.length > 0 && (
          <div className="border-t border-brown-100 px-5 py-3 space-y-2 max-h-60 overflow-y-auto">
            {upcomingTasks.map((t) => (
              <div key={t.id} className="flex items-start gap-2 text-sm">
                <svg className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="min-w-0">
                  <p className="text-brown-700 truncate">{t.name}</p>
                  <p className="text-xs text-brown-400">
                    {freqLabel(t.frequency)} &middot; Due {parseDate(t.next_due_date!).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Overdue card */}
      <div className="bg-white rounded-xl shadow-sm border border-brown-100 overflow-hidden">
        <button
          onClick={() => toggle("overdue")}
          className="w-full p-5 text-left cursor-pointer hover:bg-red-50/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${overdueTasks.length > 0 ? "bg-red-100" : "bg-gray-100"}`}>
              <svg className={`w-5 h-5 ${overdueTasks.length > 0 ? "text-red-600" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-2xl font-bold ${overdueTasks.length > 0 ? "text-red-600" : "text-brown-900"}`}>{overdueTasks.length}</p>
              <p className="text-sm text-brown-500">Overdue</p>
            </div>
            {overdueTasks.length > 0 && (
              <svg className={`w-4 h-4 text-brown-400 transition-transform ${expandedCard === "overdue" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </div>
        </button>
        {expandedCard === "overdue" && overdueTasks.length > 0 && (
          <div className="border-t border-brown-100 px-5 py-3 space-y-2 max-h-60 overflow-y-auto">
            {overdueTasks.map((t) => (
              <div key={t.id} className="flex items-start gap-2 text-sm">
                <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div className="min-w-0">
                  <p className="text-brown-700 truncate">{t.name}</p>
                  <p className="text-xs text-brown-400">
                    {freqLabel(t.frequency)} &middot; Was due {parseDate(t.next_due_date!).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
