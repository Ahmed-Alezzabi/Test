import React, { useState, useEffect } from 'react';
import { Activity } from '../types';
import { CATEGORIES } from '../data';

interface ActivityFormProps {
  activityToEdit?: Activity | null;
  onSubmit: (activity: Omit<Activity, 'id'> & { id?: string }) => void;
  onCancel: () => void;
}

export default function ActivityForm({ activityToEdit, onSubmit, onCancel }: ActivityFormProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState(60);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (activityToEdit) {
      setTitle(activityToEdit.title);
      setCategory(activityToEdit.category);
      setDate(activityToEdit.date);
      setDuration(activityToEdit.duration);
      setLocation(activityToEdit.location);
      setDescription(activityToEdit.description);
    } else {
      // Set default tomorrow date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [activityToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category.trim() || !date || !location.trim()) {
      return;
    }

    onSubmit({
      ...(activityToEdit ? { id: activityToEdit.id } : {}),
      title: title.trim(),
      category: category.trim(),
      date,
      duration: Number(duration) || 60,
      location: location.trim(),
      description: description.trim()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-sans text-neutral-800">
      <div>
        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
          Activity Title *
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Weekly Engineering Sync"
          className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none bg-white transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Duration (minutes) *
          </label>
          <input
            type="number"
            required
            min="5"
            max="1440"
            value={duration}
            onChange={(e) => setDuration(Math.max(1, Number(e.target.value)))}
            className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Date *
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Location/Link *
          </label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Conference Room B / Zoom"
            className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
          Description
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Briefly describe the target outcomes or agenda outline..."
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
          {activityToEdit ? 'Save Changes' : 'Create Activity'}
        </button>
      </div>
    </form>
  );
}
