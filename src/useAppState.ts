import { useState, useEffect } from 'react';
import { Activity, Participant, Participation } from './types';
import { INITIAL_ACTIVITIES, INITIAL_PARTICIPANTS, INITIAL_PARTICIPATIONS } from './data';

export function useAppState() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participations, setParticipations] = useState<Participation[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const storedActivities = localStorage.getItem('tracker_activities');
    const storedParticipants = localStorage.getItem('tracker_participants');
    const storedParticipations = localStorage.getItem('tracker_participations');

    if (storedActivities) {
      setActivities(JSON.parse(storedActivities));
    } else {
      setActivities(INITIAL_ACTIVITIES);
      localStorage.setItem('tracker_activities', JSON.stringify(INITIAL_ACTIVITIES));
    }

    if (storedParticipants) {
      setParticipants(JSON.parse(storedParticipants));
    } else {
      setParticipants(INITIAL_PARTICIPANTS);
      localStorage.setItem('tracker_participants', JSON.stringify(INITIAL_PARTICIPANTS));
    }

    if (storedParticipations) {
      setParticipations(JSON.parse(storedParticipations));
    } else {
      setParticipations(INITIAL_PARTICIPATIONS);
      localStorage.setItem('tracker_participations', JSON.stringify(INITIAL_PARTICIPATIONS));
    }
  }, []);

  // Sync state functions that update local storage
  const saveActivities = (newActivities: Activity[]) => {
    setActivities(newActivities);
    localStorage.setItem('tracker_activities', JSON.stringify(newActivities));
  };

  const saveParticipants = (newParticipants: Participant[]) => {
    setParticipants(newParticipants);
    localStorage.setItem('tracker_participants', JSON.stringify(newParticipants));
  };

  const saveParticipations = (newParticipations: Participation[]) => {
    setParticipations(newParticipations);
    localStorage.setItem('tracker_participations', JSON.stringify(newParticipations));
  };

  // Activity functions
  const addActivity = (activity: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      ...activity,
      id: `act-${Date.now()}`
    };
    saveActivities([...activities, newActivity]);
  };

  const updateActivity = (updated: Activity) => {
    saveActivities(activities.map(a => a.id === updated.id ? updated : a));
  };

  const deleteActivity = (id: string) => {
    saveActivities(activities.filter(a => a.id !== id));
    // Cascade delete any corresponding participations
    saveParticipations(participations.filter(p => p.activityId !== id));
  };

  // Participant functions
  const addParticipant = (participant: Omit<Participant, 'id' | 'joinedDate'>) => {
    const newParticipant: Participant = {
      ...participant,
      id: `part-${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    saveParticipants([...participants, newParticipant]);
  };

  const updateParticipant = (updated: Participant) => {
    saveParticipants(participants.map(p => p.id === updated.id ? updated : p));
  };

  const deleteParticipant = (id: string) => {
    saveParticipants(participants.filter(p => p.id !== id));
    // Cascade delete any corresponding participations
    saveParticipations(participations.filter(p => p.participantId !== id));
  };

  // Participation functions
  const addParticipation = (participation: Omit<Participation, 'id'>) => {
    // Check if this relationship already exists
    const exists = participations.find(
      p => p.activityId === participation.activityId && p.participantId === participation.participantId
    );
    if (exists) {
      // Just update it instead of making a duplicate
      updateParticipation({ ...exists, role: participation.role, status: participation.status, notes: participation.notes });
      return;
    }
    const newParticipation: Participation = {
      ...participation,
      id: `pt-${Date.now()}`
    };
    saveParticipations([...participations, newParticipation]);
  };

  const updateParticipation = (updated: Participation) => {
    saveParticipations(participations.map(p => p.id === updated.id ? updated : p));
  };

  const deleteParticipation = (id: string) => {
    saveParticipations(participations.filter(p => p.id !== id));
  };

  return {
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
  };
}
