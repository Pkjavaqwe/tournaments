import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { joinTournamentRouter } from './routes/join';
import { leaveTournamentRouter } from './routes/leave';
import { myParticipationsRouter } from './routes/my-participations';
import { errorHandler, NotFoundError } from '../../common/src';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(joinTournamentRouter);
app.use(leaveTournamentRouter);
app.use(myParticipationsRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
