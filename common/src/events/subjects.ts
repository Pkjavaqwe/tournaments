export enum Subjects {
  UserCreated = 'user:created',

  TournamentCreated = 'tournament:created',
  TournamentUpdated = 'tournament:updated',
  TournamentDeleted = 'tournament:deleted',

  ParticipationRequested = 'participation:requested',
  ParticipationApproved = 'participation:approved',
  ParticipationRejected = 'participation:rejected',
  ParticipationLeft = 'participation:left',

  EmailSent = 'email:sent',
}
