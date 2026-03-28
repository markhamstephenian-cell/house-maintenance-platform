"use client";

import { Task } from "@/lib/types";

interface Props {
  tasks: Task[];
}

export default function AtAGlance({ tasks }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thirtyAgo = new Date(today);
  thirtyAgo.setDate(thirtyAgo.getDate() - 30);
  const thirtyAhead = new Date(today);
  thirtyAhead.setDate(thirtyAhead.getDate() + 30);

  const completedRecently = tasks.filter((t) => {
    if (!t.last_completed_date) return false;
    const d = new Date(t.last_completed_date);
    return d >= thirtyAgo && d <= today;
  }).length;

  const upcoming = tasks.filter((t) => {
    if (!t.next_due_date) return false;
    const d = new Date(t.next_due_date);
    return d >= today && d <= thirtyAhead;
  }).length;

  const overdue = tasks.filter((t) => {
    if (!t.next_due_date) return false;
    const d = new Date(t.next_due_date);
    return d < today;
  }).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl p-5 shadow-sm border border-brown-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-brown-900">{completedRecently}</p>
            <p className="text-sm text-brown-500">Done (last 30 days)</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-brown-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-brown-900">{upcoming}</p>
            <p className="text-sm text-brown-500">Upcoming (next 30 days)</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-brown-100">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${overdue > 0 ? "bg-red-100" : "bg-gray-100"}`}>
            <svg className={`w-5 h-5 ${overdue > 0 ? "text-red-600" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <p className={`text-2xl font-bold ${overdue > 0 ? "text-red-600" : "text-brown-900"}`}>{overdue}</p>
            <p className="text-sm text-brown-500">Overdue</p>
          </div>
        </div>
      </div>
    </div>
  );
}
