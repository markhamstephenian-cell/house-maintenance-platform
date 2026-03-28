"use client";

import { useState } from "react";
import { Task, Contractor } from "@/lib/types";
import { FREQUENCY_LABELS } from "@/lib/default-tasks";

interface Props {
  slug: string;
  frequency: string;
  contractors: Contractor[];
  existingTask?: Task;
  onDone: () => void;
  onCancel: () => void;
}

export default function TaskForm({ slug, frequency, contractors, existingTask, onDone, onCancel }: Props) {
  const [name, setName] = useState(existingTask?.name || "");
  const [freq, setFreq] = useState(existingTask?.frequency || frequency);
  const [notes, setNotes] = useState(existingTask?.notes || "");
  const [purchaseLink, setPurchaseLink] = useState(existingTask?.purchase_link || "");
  const [contractorId, setContractorId] = useState(existingTask?.contractor_id || "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    const body = {
      name: name.trim(),
      frequency: freq,
      notes: notes.trim() || null,
      purchase_link: purchaseLink.trim() || null,
      contractor_id: contractorId || null,
    };

    if (existingTask) {
      await fetch(`/api/houses/${slug}/tasks/${existingTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch(`/api/houses/${slug}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    setSaving(false);
    onDone();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-brown-600 mb-1">Task name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-brown-200 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-brown-600 mb-1">Frequency</label>
          <select
            value={freq}
            onChange={(e) => setFreq(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-brown-200 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
          >
            {Object.entries(FREQUENCY_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-brown-600 mb-1">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 rounded-lg border border-brown-200 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-brown-600 mb-1">Purchase link (URL)</label>
          <input
            type="url"
            value={purchaseLink}
            onChange={(e) => setPurchaseLink(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-brown-200 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-brown-600 mb-1">Contractor</label>
          <select
            value={contractorId}
            onChange={(e) => setContractorId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-brown-200 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
          >
            <option value="">None</option>
            {contractors.map((c) => (
              <option key={c.id} value={c.id}>{c.name} — {c.service_type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
        >
          {saving ? "Saving..." : existingTask ? "Update" : "Add Task"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-brown-100 hover:bg-brown-200 text-brown-600 text-sm font-medium transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
