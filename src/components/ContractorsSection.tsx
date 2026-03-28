"use client";

import { useState } from "react";
import { Contractor } from "@/lib/types";

interface Props {
  slug: string;
  contractors: Contractor[];
  onRefresh: () => void;
}

interface FormData {
  name: string;
  service_type: string;
  phone: string;
  email: string;
  website: string;
  notes: string;
}

const emptyForm: FormData = { name: "", service_type: "", phone: "", email: "", website: "", notes: "" };

export default function ContractorsSection({ slug, contractors, onRefresh }: Props) {
  const [expanded, setExpanded] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  function startEdit(c: Contractor) {
    setEditingId(c.id);
    setForm({
      name: c.name,
      service_type: c.service_type,
      phone: c.phone,
      email: c.email,
      website: c.website || "",
      notes: c.notes || "",
    });
  }

  function startAdd() {
    setShowAdd(true);
    setForm(emptyForm);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);

    const body = {
      ...form,
      name: form.name.trim(),
      website: form.website.trim() || null,
      notes: form.notes.trim() || null,
    };

    if (editingId) {
      await fetch(`/api/houses/${slug}/contractors/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setEditingId(null);
    } else {
      await fetch(`/api/houses/${slug}/contractors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setShowAdd(false);
    }

    setForm(emptyForm);
    setSaving(false);
    onRefresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this contractor?")) return;
    await fetch(`/api/houses/${slug}/contractors/${id}`, { method: "DELETE" });
    onRefresh();
  }

  const formUI = (
    <form onSubmit={handleSave} className="space-y-3 p-4 bg-sand/50 rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-brown-600 mb-1">Name *</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-brown-200 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white" required />
        </div>
        <div>
          <label className="block text-xs font-medium text-brown-600 mb-1">Service type</label>
          <input type="text" value={form.service_type} onChange={(e) => setForm({ ...form, service_type: e.target.value })}
            placeholder="e.g. Plumber, Electrician"
            className="w-full px-3 py-2 rounded-lg border border-brown-200 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white" />
        </div>
        <div>
          <label className="block text-xs font-medium text-brown-600 mb-1">Phone</label>
          <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-brown-200 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white" />
        </div>
        <div>
          <label className="block text-xs font-medium text-brown-600 mb-1">Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-brown-200 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white" />
        </div>
        <div>
          <label className="block text-xs font-medium text-brown-600 mb-1">Website</label>
          <input type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })}
            placeholder="https://..."
            className="w-full px-3 py-2 rounded-lg border border-brown-200 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-brown-600 mb-1">Notes</label>
        <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2}
          className="w-full px-3 py-2 rounded-lg border border-brown-200 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white resize-none" />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={saving}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer">
          {saving ? "Saving..." : editingId ? "Update" : "Add Contractor"}
        </button>
        <button type="button" onClick={() => { setShowAdd(false); setEditingId(null); setForm(emptyForm); }}
          className="px-4 py-2 rounded-lg bg-brown-100 hover:bg-brown-200 text-brown-600 text-sm font-medium transition-colors cursor-pointer">
          Cancel
        </button>
      </div>
    </form>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-brown-100 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-sand/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-brown-800">Contractors & Contacts</h3>
          <span className="text-sm text-brown-400 bg-brown-100 px-2 py-0.5 rounded-full">{contractors.length}</span>
        </div>
        <svg
          className={`w-5 h-5 text-brown-400 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="border-t border-brown-100 divide-y divide-brown-50">
          {contractors.map((c) => (
            editingId === c.id ? (
              <div key={c.id} className="px-5 py-4">{formUI}</div>
            ) : (
              <div key={c.id} className="px-5 py-3 flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-brown-800">{c.name}</span>
                    {c.service_type && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">{c.service_type}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-brown-400">
                    {c.phone && <span>{c.phone}</span>}
                    {c.email && <span>{c.email}</span>}
                    {c.website && (
                      <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Website &rarr;
                      </a>
                    )}
                  </div>
                  {c.notes && <p className="text-xs text-brown-400 mt-1">{c.notes}</p>}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => startEdit(c)}
                    className="px-2.5 py-1.5 rounded-lg bg-brown-100 hover:bg-brown-200 text-brown-600 text-xs font-medium transition-colors cursor-pointer">
                    Details
                  </button>
                  <button onClick={() => handleDelete(c.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium transition-colors cursor-pointer">
                    Del
                  </button>
                </div>
              </div>
            )
          ))}

          {showAdd ? (
            <div className="px-5 py-4">{formUI}</div>
          ) : (
            <button
              onClick={startAdd}
              className="w-full px-5 py-3 text-sm text-blue-600 hover:bg-blue-50/50 transition-colors text-left flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add contractor
            </button>
          )}
        </div>
      )}
    </div>
  );
}
