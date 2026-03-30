"use client";

import { useState } from "react";
import { Task, Contractor } from "@/lib/types";
import { FREQUENCY_LABELS } from "@/lib/default-tasks";
import TaskForm from "./TaskForm";

interface Props {
  slug: string;
  frequency: string;
  tasks: Task[];
  contractors: Contractor[];
  onRefresh: () => void;
}

export default function TaskSection({ slug, frequency, tasks, contractors, onRefresh }: Props) {
  const [expanded, setExpanded] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  // Parse "YYYY-MM-DD" as local midnight instead of UTC midnight
  function parseDate(dateStr: string): Date {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function isRecentlyCompleted(task: Task): boolean {
    if (!task.last_completed_date) return false;
    const d = parseDate(task.last_completed_date);
    const sevenAgo = new Date(today);
    sevenAgo.setDate(sevenAgo.getDate() - 7);
    return d >= sevenAgo && d <= today;
  }

  function getStatus(task: Task): "overdue" | "upcoming" | "ok" | "done" | "none" {
    if (isRecentlyCompleted(task)) return "done";
    if (!task.next_due_date) return "none";
    const d = parseDate(task.next_due_date);
    if (d < today) return "overdue";
    const thirtyAhead = new Date(today);
    thirtyAhead.setDate(thirtyAhead.getDate() + 30);
    if (d <= thirtyAhead) return "upcoming";
    return "ok";
  }

  const statusColors: Record<string, string> = {
    overdue: "border-l-red-500 bg-red-50/50",
    upcoming: "border-l-blue-500 bg-blue-50/30",
    done: "border-l-green-500 bg-green-50/40",
    ok: "border-l-green-500 bg-white",
    none: "border-l-gray-300 bg-white",
  };

  async function handleComplete(taskId: string) {
    const now = new Date();
    const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    try {
      const res = await fetch(`/api/houses/${slug}/tasks/${taskId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completedDate: localDate }),
      });
      if (!res.ok) {
        alert("Failed to mark task as done. Please try again.");
        return;
      }
    } catch {
      alert("Could not connect to the server. Please try again.");
      return;
    }
    onRefresh();
  }

  async function handleDelete(taskId: string) {
    if (!confirm("Delete this task?")) return;
    await fetch(`/api/houses/${slug}/tasks/${taskId}`, { method: "DELETE" });
    onRefresh();
  }

  const label = FREQUENCY_LABELS[frequency as keyof typeof FREQUENCY_LABELS] || frequency;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-brown-100 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-sand/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-brown-800">{label}</h3>
          <span className="text-sm text-brown-400 bg-brown-100 px-2 py-0.5 rounded-full">{tasks.length}</span>
        </div>
        <svg
          className={`w-5 h-5 text-brown-400 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="border-t border-brown-100">
          {tasks.length === 0 && !showAdd && (
            <p className="px-5 py-4 text-brown-400 text-sm">No tasks yet.</p>
          )}

          {tasks.map((task) => {
            const status = getStatus(task);
            const contractor = contractors.find((c) => c.id === task.contractor_id);

            if (editingId === task.id) {
              return (
                <div key={task.id} className="border-b border-brown-50 px-5 py-4">
                  <TaskForm
                    slug={slug}
                    frequency={frequency}
                    contractors={contractors}
                    existingTask={task}
                    onDone={() => { setEditingId(null); onRefresh(); }}
                    onCancel={() => setEditingId(null)}
                  />
                </div>
              );
            }

            return (
              <div
                key={task.id}
                className={`border-l-4 border-b border-b-brown-50 px-5 py-3 ${statusColors[status]} transition-colors`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-medium ${status === "done" ? "text-green-800" : "text-brown-800"}`}>{task.name}</span>
                      {status === "done" && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-medium flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Done {parseDate(task.last_completed_date!).toLocaleDateString()}
                        </span>
                      )}
                      {status === "overdue" && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-medium">Overdue</span>
                      )}
                      {status === "upcoming" && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">Due soon</span>
                      )}
                    </div>
                    {status === "done" && task.next_due_date && (
                      <p className="text-xs font-medium text-green-700 mt-1">
                        Next needs attention: {parseDate(task.next_due_date).toLocaleDateString()}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-brown-400">
                      {status !== "done" && task.last_completed_date && (
                        <span>Last done: {parseDate(task.last_completed_date).toLocaleDateString()}</span>
                      )}
                      {status !== "done" && task.next_due_date && (
                        <span>Next due: {parseDate(task.next_due_date).toLocaleDateString()}</span>
                      )}
                      {contractor && (
                        <span className="text-blue-600">{contractor.name} ({contractor.service_type})</span>
                      )}
                    </div>
                    {task.notes && (
                      <p className="text-xs text-brown-400 mt-1">{task.notes}</p>
                    )}
                    {task.purchase_link && (
                      <a href={task.purchase_link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                        Purchase link &rarr;
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 sm:ml-2 shrink-0">
                    <button
                      onClick={() => handleComplete(task.id)}
                      className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-medium transition-colors cursor-pointer"
                      title="Mark completed today"
                    >
                      Done
                    </button>
                    <button
                      onClick={() => setEditingId(task.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-brown-100 hover:bg-brown-200 text-brown-600 text-xs font-medium transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium transition-colors cursor-pointer"
                    >
                      Del
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {showAdd ? (
            <div className="px-5 py-4">
              <TaskForm
                slug={slug}
                frequency={frequency}
                contractors={contractors}
                onDone={() => { setShowAdd(false); onRefresh(); }}
                onCancel={() => setShowAdd(false)}
              />
            </div>
          ) : (
            <button
              onClick={() => setShowAdd(true)}
              className="w-full px-5 py-3 text-sm text-blue-600 hover:bg-blue-50/50 transition-colors text-left flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add task
            </button>
          )}
        </div>
      )}
    </div>
  );
}
