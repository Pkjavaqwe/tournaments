import 'reflect-metadata';
import { app } from './app';
import { AppDataSource } from './config/database';
import { natsWrapper } from './nats-wrapper';
import { TournamentCreatedListener } from './events/listeners/tournament-created-listener';
import { TournamentUpdatedListener } from './events/listeners/tournament-updated-listener';
import { TournamentDeletedListener } from './events/listeners/tournament-deleted-listener';
import { ParticipationApprovedListener } from './events/listeners/participation-approved-listener';
import { ParticipationRejectedListener } from './events/listeners/participation-rejected-listener';

const start = async () => {
  console.log('Starting participation service...');

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
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

    // Start listeners
    // Tournament listeners - keep local replica in sync (handles SERVICE OUTAGE)
    new TournamentCreatedListener(natsWrapper.client).listen();
    new TournamentUpdatedListener(natsWrapper.client).listen();
    new TournamentDeletedListener(natsWrapper.client).listen();
    
    // Participation status listeners - update when organizer approves/rejects
    new ParticipationApprovedListener(natsWrapper.client).listen();
    new ParticipationRejectedListener(natsWrapper.client).listen();

    // Connect to database
    await AppDataSource.initialize();
    console.log('Database connected!');
  } catch (err) {
    console.error(err);
  }

  app.listen(3002, () => {
    console.log('Participation service listening on port 3002!');
  });
};

start();
