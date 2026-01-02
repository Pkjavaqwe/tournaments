import 'reflect-metadata';
import { app } from './app';
import { AppDataSource } from './config/database';
import { natsWrapper } from './nats-wrapper';

// Import all listeners
import { UserCreatedListener } from './events/listeners/user-created-listener';
import { TournamentCreatedListener } from './events/listeners/tournament-created-listener';
import { TournamentUpdatedListener } from './events/listeners/tournament-updated-listener';
import { TournamentDeletedListener } from './events/listeners/tournament-deleted-listener';
import { ParticipationRequestedListener } from './events/listeners/participation-requested-listener';
import { ParticipationApprovedListener } from './events/listeners/participation-approved-listener';
import { ParticipationRejectedListener } from './events/listeners/participation-rejected-listener';
import { ParticipationLeftListener } from './events/listeners/participation-left-listener';

const start = async () => {
  console.log('Starting Query Service (CQRS Read Model)...');

  // Check required environment variables
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  try {
    // Connect to NATS
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.close());
    process.on('SIGTERM', () => natsWrapper.close());

    // Initialize database
    await AppDataSource.initialize();
    console.log('Query database connected');

    // Start all CQRS listeners - these build the read model
    // User events
    new UserCreatedListener(natsWrapper.client).listen();
    
    // Tournament events
    new TournamentCreatedListener(natsWrapper.client).listen();
    new TournamentUpdatedListener(natsWrapper.client).listen();
    new TournamentDeletedListener(natsWrapper.client).listen();
    
    // Participation events
    new ParticipationRequestedListener(natsWrapper.client).listen();
    new ParticipationApprovedListener(natsWrapper.client).listen();
    new ParticipationRejectedListener(natsWrapper.client).listen();
    new ParticipationLeftListener(natsWrapper.client).listen();

    console.log('All CQRS listeners started - building read model from events');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  app.listen(3004, () => {
    console.log('Query Service listening on port 3004');
  });
};

start();
