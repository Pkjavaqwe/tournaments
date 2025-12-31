export enum Subjects {
  // User events
  UserCreated = 'user:created',

  // Tournament events
  TournamentCreated = 'tournament:created',
  TournamentUpdated = 'tournament:updated',
  TournamentDeleted = 'tournament:deleted',

  // Participation events (request workflow)
  ParticipationRequested = 'participation:requested',   // Participant requests to join
  ParticipationApproved = 'participation:approved',     // Organizer approves
  ParticipationRejected = 'participation:rejected',     // Organizer rejects
  ParticipationLeft = 'participation:left',             // Participant leaves

  // Email events (for tracking)
  EmailSent = 'email:sent',
}
