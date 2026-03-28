"use client";

import { useState } from "react";

export default function GuidanceSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-brown-100 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-sand/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-brown-800">Why Maintenance Matters</h3>
        </div>
        <svg
          className={`w-5 h-5 text-brown-400 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="border-t border-brown-100 px-5 py-5 text-sm text-brown-600 space-y-4">
          <p>
            Regular home maintenance prevents small issues from becoming expensive emergencies. A well-maintained
            home is safer, more energy-efficient, and retains its value better over time. Think of it as routine
            care — just like you service your car, your home needs attention too.
          </p>

          <div>
            <h4 className="font-semibold text-brown-800 mb-2">What each frequency means</h4>
            <dl className="space-y-2">
              <div>
                <dt className="font-medium text-brown-700">Monthly</dt>
                <dd className="text-brown-500 ml-4">Quick checks that take minutes but catch problems early — leaks, detector tests, filter inspections. These are your first line of defense.</dd>
              </div>
              <div>
                <dt className="font-medium text-brown-700">Every 2 Months</dt>
                <dd className="text-brown-500 ml-4">Tasks that need regular attention but not monthly — like replacing HVAC filters or checking your water softener. Set a reminder and knock these out quickly.</dd>
              </div>
              <div>
                <dt className="font-medium text-brown-700">Every 6 Months</dt>
                <dd className="text-brown-500 ml-4">Seasonal tasks tied to spring and fall. Deep cleaning appliances, testing safety features, and flushing systems. A good Saturday project twice a year.</dd>
              </div>
              <div>
                <dt className="font-medium text-brown-700">Annually</dt>
                <dd className="text-brown-500 ml-4">Bigger jobs you do once a year — professional HVAC service, gutter cleaning, roof inspections. Schedule these around the same time each year so they become habit.</dd>
              </div>
              <div>
                <dt className="font-medium text-brown-700">Every 2 Years</dt>
                <dd className="text-brown-500 ml-4">Less frequent but still important — weatherstripping, carpet cleaning, power washing. These maintain the structural and aesthetic integrity of your home.</dd>
              </div>
              <div>
                <dt className="font-medium text-brown-700">Every 5 Years</dt>
                <dd className="text-brown-500 ml-4">Major maintenance milestones — repainting, resealing, septic service. Easy to forget, but skipping them can lead to costly repairs down the road.</dd>
              </div>
            </dl>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <p className="text-blue-800 text-sm">
              <strong>Personalize your list:</strong> Every home is different. Feel free to add tasks specific to your
              property (pool maintenance, well pump checks, etc.) and remove any that don't apply. The default list
              is a starting point for a typical US home.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
