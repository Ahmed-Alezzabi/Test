export interface Activity {
  id: string;
  title: string;
  category: string;
  date: string;
  duration: number; // in minutes
  location: string;
  description: string;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  joinedDate: string;
}

export interface Participation {
  id: string;
  activityId: string;
  participantId: string;
  role: string; // e.g., "Attendee", "Speaker", "Organizer", "Volunteer"
  status: string; // e.g., "Confirmed", "Pending", "Declined"
  notes?: string;
}
