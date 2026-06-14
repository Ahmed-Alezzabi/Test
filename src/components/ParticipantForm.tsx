import React, { useState, useEffect } from 'react';
import { Participant } from '../types';

interface ParticipantFormProps {
  participantToEdit?: Participant | null;
  onSubmit: (participant: Omit<Participant, 'id' | 'joinedDate'> & { id?: string }) => void;
  onCancel: () => void;
}

export default function ParticipantForm({ participantToEdit, onSubmit, onCancel }: ParticipantFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (participantToEdit) {
      setName(participantToEdit.name);
      setEmail(participantToEdit.email);
      setPhone(participantToEdit.phone);
      setNotes(participantToEdit.notes);
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setNotes('');
    }
  }, [participantToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      return;
    }

    onSubmit({
      ...(participantToEdit ? { id: participantToEdit.id } : {}),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      notes: notes.trim()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-sans text-neutral-800">
      <div>
        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
          Full Name *
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Maryam Al-Maktoum"
          className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 555-0100"
            className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
          Biography or Participant Notes
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Design lead, team speaker, preferred contact route..."
          className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
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
          {participantToEdit ? 'Save Changes' : 'Register Participant'}
        </button>
      </div>
    </form>
  );
}
