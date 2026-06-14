import React, { useState, useEffect } from 'react';
import { Activity, Participant, Participation } from '../types';
import { ROLES, STATUSES } from '../data';

interface LinkParticipationFormProps {
  activities: Activity[];
  participants: Participant[];
  participationToEdit?: Participation | null;
  selectedDefaultActivityId?: string;
  selectedDefaultParticipantId?: string;
  onSubmit: (participation: Omit<Participation, 'id'> & { id?: string }) => void;
  onCancel: () => void;
}

export default function LinkParticipationForm({
  activities,
  participants,
  participationToEdit,
  selectedDefaultActivityId,
  selectedDefaultParticipantId,
  onSubmit,
  onCancel
}: LinkParticipationFormProps) {
  const [activityId, setActivityId] = useState('');
  const [participantId, setParticipantId] = useState('');
  const [role, setRole] = useState(ROLES[0]);
  const [status, setStatus] = useState(STATUSES[0]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (participationToEdit) {
      setActivityId(participationToEdit.activityId);
      setParticipantId(participationToEdit.participantId);
      setRole(participationToEdit.role);
      setStatus(participationToEdit.status);
      setNotes(participationToEdit.notes || '');
    } else {
      setActivityId(selectedDefaultActivityId || (activities[0]?.id || ''));
      setParticipantId(selectedDefaultParticipantId || (participants[0]?.id || ''));
      setRole(ROLES[0]);
      setStatus(STATUSES[0]);
      setNotes('');
    }
  }, [participationToEdit, activities, participants, selectedDefaultActivityId, selectedDefaultParticipantId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityId || !participantId) {
      return;
    }

    onSubmit({
      ...(participationToEdit ? { id: participationToEdit.id } : {}),
      activityId,
      participantId,
      role,
      status,
      notes: notes.trim()
    });
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-6 text-sm text-neutral-500 font-sans">
        Please add at least one activity first before assigning participants.
      </div>
    );
  }

  if (participants.length === 0) {
    return (
      <div className="text-center py-6 text-sm text-neutral-500 font-sans">
        Please add at least one participant first before creating a connection.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-sans text-neutral-800">
      <div>
        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
          Select Activity *
        </label>
        <select
          value={activityId}
          disabled={!!participationToEdit}
          onChange={(e) => setActivityId(e.target.value)}
          className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none bg-white transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-neutral-50 disabled:text-neutral-500"
        >
          {activities.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title} ({a.category})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
          Select Participant *
        </label>
        <select
          value={participantId}
          disabled={!!participationToEdit}
          onChange={(e) => setParticipantId(e.target.value)}
          className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none bg-white transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-neutral-50 disabled:text-neutral-500"
        >
          {participants.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {p.email}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Role/Affiliation *
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none bg-white transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Confirmation Status *
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none bg-white transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
          Assignment Notes
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Specific requirements, agenda additions, or dietary notes..."
          className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 transition"
        >
          {participationToEdit ? 'Save Assignment' : 'Confirm Assignment'}
        </button>
      </div>
    </form>
  );
}
