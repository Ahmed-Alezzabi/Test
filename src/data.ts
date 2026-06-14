import { Activity, Participant, Participation } from './types';

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    title: 'React & Tailwind Workshop',
    category: 'Training',
    date: '2026-06-15',
    duration: 120,
    location: 'Studio Room A',
    description: 'Practical, fast-paced coding sprint exploring the latest in utility-first responsive layout structures and declarative component rendering.'
  },
  {
    id: 'act-2',
    title: 'Design Systems Sync',
    category: 'Design',
    date: '2026-06-16',
    duration: 45,
    location: 'Virtual Briefing',
    description: 'A structural alignment meeting to sync token naming conventions, component hierarchies, and interactive micro-animations across engineering systems.'
  },
  {
    id: 'act-3',
    title: 'Yoga & Wellness Session',
    category: 'Wellness',
    date: '2026-06-18',
    duration: 60,
    location: 'Zen Patio Gardens',
    description: 'A tranquil workspace reset incorporating guided somatic breathing loops, active dynamic stretching, and mindfulness cycles to boost clarity.'
  }
];

export const INITIAL_PARTICIPANTS: Participant[] = [
  {
    id: 'part-1',
    name: 'Ahmed Al-Ezabi',
    email: 'alezabi.ahmed@gmail.com',
    phone: '+1 555-0192',
    notes: 'Core technical lead. Excited about streamlining user journeys and crafting elegant dashboard concepts.',
    joinedDate: '2026-06-13'
  },
  {
    id: 'part-2',
    name: 'Sarah Jenkins',
    email: 'sarah.j@company.com',
    phone: '+1 555-0143',
    notes: 'Interface designer focused on minimalist spacing principles, subtle colors, and typography layout details.',
    joinedDate: '2026-06-12'
  },
  {
    id: 'part-3',
    name: 'Michael Chen',
    email: 'mchen@engineering.org',
    phone: '+1 555-0187',
    notes: 'Performance specialist who appreciates fast render cycles and clean functional React architectures.',
    joinedDate: '2026-06-14'
  }
];

export const INITIAL_PARTICIPATIONS: Participation[] = [
  {
    id: 'pt-1',
    activityId: 'act-1',
    participantId: 'part-1',
    role: 'Attendee',
    status: 'Confirmed',
    notes: 'Wants to improve practical styling efficiency.'
  },
  {
    id: 'pt-2',
    activityId: 'act-2',
    participantId: 'part-2',
    role: 'Organizer',
    status: 'Confirmed',
    notes: 'Will share the latest Figma typography exports.'
  },
  {
    id: 'pt-3',
    activityId: 'act-1',
    participantId: 'part-3',
    role: 'Speaker',
    status: 'Confirmed',
    notes: 'Presenting a 15-minute case study on performance gains.'
  },
  {
    id: 'pt-4',
    activityId: 'act-3',
    participantId: 'part-1',
    role: 'Attendee',
    status: 'Pending',
    notes: 'Pending final calendar confirmation.'
  }
];

export const CATEGORIES = ['Training', 'Design', 'Meeting', 'Wellness', 'Social', 'Other'];
export const ROLES = ['Attendee', 'Speaker', 'Organizer', 'Volunteer', 'Guest', 'Coordinator'];
export const STATUSES = ['Confirmed', 'Pending', 'Declined'];
