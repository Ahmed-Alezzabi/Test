import React from 'react';
import { CalendarRange, Users, Handshake, Sparkles } from 'lucide-react';
import { Activity, Participant, Participation } from '../types';

interface MetricHeroProps {
  activities: Activity[];
  participants: Participant[];
  participations: Participation[];
}

export default function MetricHero({ activities, participants, participations }: MetricHeroProps) {
  const confirmedCount = participations.filter(p => p.status === 'Confirmed').length;
  const pendingCount = participations.filter(p => p.status === 'Pending').length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Activities */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-150 bg-white p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
            <CalendarRange className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Total Activities</p>
            <h4 className="font-mono text-3xl font-semibold text-neutral-800 mt-0.5">{activities.length}</h4>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1.5 text-xs text-neutral-500">
          <span className="font-semibold text-neutral-800">{new Set(activities.map(a => a.category)).size}</span>
          <span>distinct categories logged</span>
        </div>
      </div>

      {/* Total Participants */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-150 bg-white p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Participants</p>
            <h4 className="font-mono text-3xl font-semibold text-neutral-800 mt-0.5">{participants.length}</h4>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1.5 text-xs text-neutral-500">
          <span className="font-semibold text-neutral-800">{participants.length > 0 ? 'Active' : 'Empty'}</span>
          <span>member registry database</span>
        </div>
      </div>

      {/* Active Participations */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-150 bg-white p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
            <Handshake className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Connections</p>
            <h4 className="font-mono text-3xl font-semibold text-neutral-800 mt-0.5">{participations.length}</h4>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1.5 text-xs text-neutral-500">
          <span className="font-semibold text-emerald-600 font-mono">{confirmedCount}</span>
          <span>confirmed •</span>
          <span className="font-semibold text-amber-600 font-mono">{pendingCount}</span>
          <span>pending</span>
        </div>
      </div>

      {/* Average Attendance density */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-150 bg-white p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-sky-50 p-3 text-sky-600">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Avg Density</p>
            <h4 className="font-mono text-3xl font-semibold text-neutral-800 mt-0.5">
              {activities.length > 0 ? (participations.length / activities.length).toFixed(1) : '0.0'}
            </h4>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1.5 text-xs text-neutral-500">
          <span>people per logged activity listing</span>
        </div>
      </div>
    </div>
  );
}
