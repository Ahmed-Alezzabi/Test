import React, { useState } from 'react';
import {
  CalendarRange,
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Clock,
  Mail,
  Phone,
  Link2,
  X,
  Filter,
  UserPlus,
  CalendarCheck,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { useAppState } from './useAppState';
import { Activity, Participant, Participation } from './types';
import { CATEGORIES } from './data';
import { getCategoryStyles, getStatusStyles, getInitials, getAvatarGradient } from './utils';

import Modal from './components/Modal';
import MetricHero from './components/MetricHero';
import ActivityForm from './components/ActivityForm';
import ParticipantForm from './components/ParticipantForm';
import LinkParticipationForm from './components/LinkParticipationForm';

export default function App() {
  const {
    activities,
    participants,
    participations,
    addActivity,
    updateActivity,
    deleteActivity,
    addParticipant,
    updateParticipant,
    deleteParticipant,
    addParticipation,
    updateParticipation,
    deleteParticipation
  } = useAppState();

  // Search & Filter state
  const [activitySearch, setActivitySearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [participantSearch, setParticipantSearch] = useState('');

  // Active / Selected highlight states for interactive filtering
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null);

  // Modal control states
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  // Edit target states
  const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);
  const [participantToEdit, setParticipantToEdit] = useState<Participant | null>(null);
  const [participationToEdit, setParticipationToEdit] = useState<Participation | null>(null);

  // Deep view states for interactive display info
  const [infoModalContent, setInfoModalContent] = useState<{ title: string; text: string } | null>(null);

  // Filtered lists
  const filteredActivities = activities.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(activitySearch.toLowerCase()) ||
      a.location.toLowerCase().includes(activitySearch.toLowerCase()) ||
      a.description.toLowerCase().includes(activitySearch.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredParticipants = participants.filter((p) => {
    return (
      p.name.toLowerCase().includes(participantSearch.toLowerCase()) ||
      p.email.toLowerCase().includes(participantSearch.toLowerCase()) ||
      p.notes.toLowerCase().includes(participantSearch.toLowerCase())
    );
  });

  // Modal submission handlers
  const handleActivitySubmit = (data: Omit<Activity, 'id'> & { id?: string }) => {
    if (data.id) {
      updateActivity(data as Activity);
    } else {
      addActivity(data);
    }
    setIsActivityModalOpen(false);
    setActivityToEdit(null);
  };

  const handleParticipantSubmit = (data: Omit<Participant, 'id' | 'joinedDate'> & { id?: string }) => {
    if (data.id) {
      // Find original to keep joined date
      const original = participants.find((p) => p.id === data.id);
      updateParticipant({
        ...(data as Participant),
        joinedDate: original?.joinedDate || new Date().toISOString().split('T')[0]
      });
    } else {
      addParticipant(data);
    }
    setIsParticipantModalOpen(false);
    setParticipantToEdit(null);
  };

  const handleLinkSubmit = (data: Omit<Participation, 'id'> & { id?: string }) => {
    if (data.id) {
      updateParticipation(data as Participation);
    } else {
      addParticipation(data);
    }
    setIsLinkModalOpen(false);
    setParticipationToEdit(null);
  };

  // Quick edit triggers
  const triggerEditActivity = (activity: Activity, e: React.MouseEvent) => {
    e.stopPropagation();
    setActivityToEdit(activity);
    setIsActivityModalOpen(true);
  };

  const triggerEditParticipant = (participant: Participant, e: React.MouseEvent) => {
    e.stopPropagation();
    setParticipantToEdit(participant);
    setIsParticipantModalOpen(true);
  };

  // Helper to find participants in a given activity
  const getParticipationsForActivity = (activityId: string) => {
    return participations
      .filter((p) => p.activityId === activityId)
      .map((p) => {
        const participant = participants.find((part) => part.id === p.participantId);
        return {
          participationId: p.id,
          role: p.role,
          status: p.status,
          notes: p.notes,
          participant
        };
      });
  };

  // Helper to find activities assigned to a participant
  const getParticipationsForParticipant = (participantId: string) => {
    return participations
      .filter((p) => p.participantId === participantId)
      .map((p) => {
        const activity = activities.find((act) => act.id === p.activityId);
        return {
          participationId: p.id,
          role: p.role,
          status: p.status,
          notes: p.notes,
          activity
        };
      });
  };

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-6 lg:px-8 font-sans antialiased text-neutral-800">
      {/* Container */}
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Humble and Crafty Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-neutral-250/60 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 font-mono text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" /> Core Workspace
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Activity & Participant Registry
            </h1>
            <p className="text-sm text-neutral-500 max-w-2xl">
              A minimalist tracking system to maintain core activities, workshop logs, and participant schedules.
              Easily catalog events, manage directories, and create visual rosters.
            </p>
          </div>

          {/* Core Navigation/Action Hub */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setActivityToEdit(null);
                setIsActivityModalOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-white border border-neutral-200 px-4 py-2.5 text-xs font-semibold text-neutral-700 shadow-xs hover:bg-neutral-50 transition"
              id="btn-add-activity"
            >
              <Plus className="h-4 w-4 text-emerald-555" />
              Log Activity
            </button>
            <button
              onClick={() => {
                setParticipantToEdit(null);
                setIsParticipantModalOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-white border border-neutral-200 px-4 py-2.5 text-xs font-semibold text-neutral-700 shadow-xs hover:bg-neutral-50 transition"
              id="btn-add-participant"
            >
              <UserPlus className="h-4 w-4 text-indigo-500" />
              Add Participant
            </button>
            <button
              onClick={() => {
                setParticipationToEdit(null);
                setIsLinkModalOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-neutral-850 transition"
              id="btn-link-participant"
            >
              <Link2 className="h-4 w-4 text-indigo-300" />
              Link Registry Entry
            </button>
          </div>
        </header>

        {/* Dynamic High-Level Metric Grid */}
        <section id="metrics-panel">
          <MetricHero
            activities={activities}
            participants={participants}
            participations={participations}
          />
        </section>

        {/* Combined Filter Notice if active highlights exist */}
        {(selectedActivityId || selectedParticipantId) && (
          <div className="flex items-center justify-between rounded-xl bg-indigo-50/70 border border-indigo-100 px-4 py-3 text-xs text-indigo-800">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span>
                {selectedActivityId && (
                  <>
                    Viewing roster for activity{' '}
                    <strong className="font-semibold text-indigo-950">
                      &ldquo;{activities.find((a) => a.id === selectedActivityId)?.title}&rdquo;
                    </strong>
                  </>
                )}
                {selectedActivityId && selectedParticipantId && ' and '}
                {selectedParticipantId && (
                  <>
                    showing activities for attendee{' '}
                    <strong className="font-semibold text-indigo-950">
                      &ldquo;{participants.find((p) => p.id === selectedParticipantId)?.name}&rdquo;
                    </strong>
                  </>
                )}
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedActivityId(null);
                setSelectedParticipantId(null);
              }}
              className="font-semibold hover:underline"
            >
              Clear filter view
            </button>
          </div>
        )}

        {/* Core Double Column Workspace Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Column 1: Activities Grid */}
          <div className="space-y-4" id="column-activities">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
                  <CalendarRange className="h-5 w-5 text-neutral-450" />
                  Activities Log ({filteredActivities.length})
                </h2>
                <p className="text-xs text-neutral-500">Add, view, and assign members to workshops.</p>
              </div>
            </div>

            {/* List Search & Pills Category selector */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Query titles, locations, descriptions..."
                  value={activitySearch}
                  onChange={(e) => setActivitySearch(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                {activitySearch && (
                  <button
                    onClick={() => setActivitySearch('')}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Clickable horizontal category tags */}
              <div className="flex flex-wrap items-center gap-1.5 pb-1">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                    selectedCategory === 'All'
                      ? 'bg-neutral-900 border-neutral-900 text-white'
                      : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  All Categories
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                      selectedCategory === cat
                        ? 'bg-neutral-900 border-neutral-900 text-white'
                        : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List View Container */}
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {filteredActivities.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-200 bg-white py-12 text-center text-sm text-neutral-500">
                  No activities match your query. Try resetting filters or log a new action!
                </div>
              ) : (
                filteredActivities.map((a) => {
                  const relativeParticipations = getParticipationsForActivity(a.id);
                  const isHighlighted = selectedActivityId === a.id;

                  return (
                    <div
                      key={a.id}
                      onClick={() => setSelectedActivityId(isHighlighted ? null : a.id)}
                      className={`group relative rounded-2xl border p-5 shadow-xs transition-all duration-250 cursor-pointer ${
                        isHighlighted
                          ? 'border-indigo-600 bg-indigo-50/15 ring-1 ring-indigo-500'
                          : 'border-neutral-200/80 bg-white hover:border-neutral-300 hover:shadow-xs'
                      }`}
                    >
                      {/* Top category banner */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${getCategoryStyles(
                              a.category
                            )}`}
                          >
                            {a.category}
                          </span>
                          <h3 className="font-semibold text-neutral-900 group-hover:text-neutral-950 text-base">
                            {a.title}
                          </h3>
                        </div>

                        {/* Card controls */}
                        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => triggerEditActivity(a, e)}
                            className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                            title="Edit Activity"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Are you sure you want to remove this activity? All links will be removed too.')) {
                                deleteActivity(a.id);
                                if (selectedActivityId === a.id) setSelectedActivityId(null);
                              }
                            }}
                            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-red-600"
                            title="Delete Activity"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Specs */}
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-neutral-500 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-neutral-400" />
                          <span className="font-mono">{a.date}</span>
                          <span className="text-neutral-300">•</span>
                          <span className="text-neutral-600">{a.duration}m</span>
                        </div>
                        <div className="flex items-center gap-1.5 justify-end text-right truncate">
                          <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                          <span className="truncate max-w-[150px]" title={a.location}>{a.location}</span>
                        </div>
                      </div>

                      {/* Description */}
                      {a.description && (
                        <p className="mt-3 text-xs text-neutral-600 border-l-2 border-neutral-150 pl-2.5 leading-relaxed">
                          {a.description}
                        </p>
                      )}

                      {/* Roster list */}
                      <div className="mt-4 pt-3 border-t border-neutral-100">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-semibold text-neutral-600 uppercase tracking-widest text-[10px]">
                             Roster ({relativeParticipations.length})
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setParticipationToEdit(null);
                              // Auto highlight this activity
                              setSelectedActivityId(a.id);
                              setIsLinkModalOpen(true);
                            }}
                            className="text-indigo-600 font-semibold flex items-center gap-0.5 hover:underline"
                          >
                            <Plus className="h-3 w-3" /> Link Participant
                          </button>
                        </div>

                        {relativeParticipations.length === 0 ? (
                          <div className="text-[11px] text-neutral-400 italic py-1">
                            No active participant connections mapped. Click to assign!
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {relativeParticipations.map(({ participationId, role, status, notes, participant }) => {
                              if (!participant) return null;
                              return (
                                <div
                                  key={participationId}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (notes) {
                                      setInfoModalContent({
                                        title: `${participant.name} — ${role} Notes`,
                                        text: notes
                                      });
                                    }
                                  }}
                                  className={`group/badge flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
                                    notes ? 'cursor-help hover:bg-neutral-50' : ''
                                  } ${getStatusStyles(status)}`}
                                >
                                  <span className="font-semibold text-neutral-900">
                                    {participant.name}
                                  </span>
                                  <span className="opacity-60 font-mono text-[9px] uppercase">
                                    ({role})
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (confirm(`Remove ${participant.name} from this activity roster?`)) {
                                        deleteParticipation(participationId);
                                      }
                                    }}
                                    className="ml-1 text-neutral-400 hover:text-red-700 opacity-0 group-hover/badge:opacity-100 transition-opacity"
                                    title="Unlink Participant"
                                  >
                                    <X className="h-2.5 w-2.5" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Column 2: Participants Register */}
          <div className="space-y-4" id="column-participants">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-neutral-450" />
                Participant Registry ({filteredParticipants.length})
              </h2>
              <p className="text-xs text-neutral-500">Maintain registered information and bios.</p>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Query name, emails, biographies..."
                value={participantSearch}
                onChange={(e) => setParticipantSearch(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              {participantSearch && (
                <button
                  onClick={() => setParticipantSearch('')}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* List View Container */}
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {filteredParticipants.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-200 bg-white py-12 text-center text-sm text-neutral-500">
                  No participants matched your search. Register a new record!
                </div>
              ) : (
                filteredParticipants.map((p) => {
                  const relativeActivities = getParticipationsForParticipant(p.id);
                  const isHighlighted = selectedParticipantId === p.id;

                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedParticipantId(isHighlighted ? null : p.id)}
                      className={`group relative rounded-2xl border p-5 shadow-xs transition-all duration-250 cursor-pointer ${
                        isHighlighted
                          ? 'border-indigo-600 bg-indigo-50/15 ring-1 ring-indigo-500'
                          : 'border-neutral-200/80 bg-white hover:border-neutral-300 hover:shadow-xs'
                      }`}
                    >
                      {/* Top alignment row */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {/* Generated Premium Initial Avatar */}
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-semibold tracking-wider text-sm shadow-inner ${getAvatarGradient(
                              p.name
                            )}`}
                          >
                            {getInitials(p.name)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-neutral-900 group-hover:text-neutral-950 text-base leading-tight">
                              {p.name}
                            </h3>
                            <span className="font-mono text-[10px] text-neutral-400">
                              Registered: {p.joinedDate}
                            </span>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => triggerEditParticipant(p, e)}
                            className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                            title="Edit Contact"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Are you sure you want to delete this participant profile? All activity assignments will be deleted.')) {
                                deleteParticipant(p.id);
                                if (selectedParticipantId === p.id) setSelectedParticipantId(null);
                              }
                            }}
                            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-red-600"
                            title="Delete Registry"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Contact metadata */}
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-neutral-600">
                        <a
                          href={`mailto:${p.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 hover:text-indigo-600 hover:underline"
                        >
                          <Mail className="h-3.5 w-3.5 text-neutral-400" />
                          {p.email}
                        </a>
                        {p.phone && (
                          <div className="flex items-center gap-1.5 text-neutral-600">
                            <Phone className="h-3.5 w-3.5 text-neutral-400" />
                            <span className="font-mono text-[11px]">{p.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Bio Notes */}
                      {p.notes && (
                        <p className="mt-3 text-xs text-neutral-600 leading-relaxed bg-neutral-50 border border-neutral-150/60 rounded-xl px-3 py-2">
                          {p.notes}
                        </p>
                      )}

                      {/* Scheduled classes / activities detail */}
                      <div className="mt-4 pt-3 border-t border-neutral-100">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-semibold text-neutral-600 uppercase tracking-widest text-[10px]">
                            Linked Activities ({relativeActivities.length})
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setParticipationToEdit(null);
                              // Auto highlight this participant
                              setSelectedParticipantId(p.id);
                              setIsLinkModalOpen(true);
                            }}
                            className="text-indigo-600 font-semibold flex items-center gap-0.5 hover:underline"
                          >
                            <Plus className="h-3 w-3" /> Assign Activity
                          </button>
                        </div>

                        {relativeActivities.length === 0 ? (
                          <div className="text-[11px] text-neutral-400 italic py-1">
                            Not yet linked to any upcoming activities. Click to link.
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            {relativeActivities.map(({ participationId, role, status, notes, activity }) => {
                              if (!activity) return null;
                              return (
                                <div
                                  key={participationId}
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center justify-between gap-2 rounded-lg border border-neutral-200/60 bg-neutral-50 px-2.5 py-1.5 text-xs"
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <span className="font-semibold text-neutral-805 truncate text-[11px]">
                                      {activity.title}
                                    </span>
                                    <span className="shrink-0 text-[9px] px-1.5 py-0.2 rounded-md bg-neutral-200/50 text-neutral-600 uppercase tracking-wide">
                                      {role}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2shrink-0">
                                    <span className={`text-[10px] px-2 py-0.2 rounded-full border uppercase tracking-wider font-semibold font-mono ${getStatusStyles(status)}`}>
                                      {status}
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm(`Remove registration for activity "${activity.title}"?`)) {
                                          deleteParticipation(participationId);
                                        }
                                      }}
                                      className="text-neutral-400 hover:text-red-700 p-0.5 rounded-md hover:bg-neutral-150 transition"
                                      title="Unlink"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- RENDER MODALS --- */}

      {/* Activity Modals */}
      <Modal
        isOpen={isActivityModalOpen}
        onClose={() => {
          setIsActivityModalOpen(false);
          setActivityToEdit(null);
        }}
        title={activityToEdit ? 'Edit Activity Details' : 'Configure New Activity Entry'}
      >
        <ActivityForm
          activityToEdit={activityToEdit}
          onSubmit={handleActivitySubmit}
          onCancel={() => {
            setIsActivityModalOpen(false);
            setActivityToEdit(null);
          }}
        />
      </Modal>

      {/* Participant Modals */}
      <Modal
        isOpen={isParticipantModalOpen}
        onClose={() => {
          setIsParticipantModalOpen(false);
          setParticipantToEdit(null);
        }}
        title={participantToEdit ? 'Edit Participant Directory Profile' : 'Register New Participant Entry'}
      >
        <ParticipantForm
          participantToEdit={participantToEdit}
          onSubmit={handleParticipantSubmit}
          onCancel={() => {
            setIsParticipantModalOpen(false);
            setParticipantToEdit(null);
          }}
        />
      </Modal>

      {/* Link Participation Modals */}
      <Modal
        isOpen={isLinkModalOpen}
        onClose={() => {
          setIsLinkModalOpen(false);
          setParticipationToEdit(null);
        }}
        title={participationToEdit ? 'Edit Assignment Parameters' : 'Link Activity & Participant Directory'}
      >
        <LinkParticipationForm
          activities={activities}
          participants={participants}
          participationToEdit={participationToEdit}
          selectedDefaultActivityId={selectedActivityId || undefined}
          selectedDefaultParticipantId={selectedParticipantId || undefined}
          onSubmit={handleLinkSubmit}
          onCancel={() => {
            setIsLinkModalOpen(false);
            setParticipationToEdit(null);
          }}
        />
      </Modal>

      {/* General Information Help note modal */}
      <Modal
        isOpen={!!infoModalContent}
        onClose={() => setInfoModalContent(null)}
        title={infoModalContent?.title || 'Roster Information detail'}
      >
        <div className="space-y-4 font-sans text-neutral-800">
          <p className="text-sm leading-relaxed text-neutral-600 bg-neutral-50 rounded-xl p-4 border border-neutral-100">
            {infoModalContent?.text}
          </p>
          <div className="flex items-center justify-end">
            <button
              onClick={() => setInfoModalContent(null)}
              className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
