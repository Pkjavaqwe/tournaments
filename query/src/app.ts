import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { listTournamentsRouter } from './routes/tournaments';
import { tournamentDetailsRouter } from './routes/tournament-details';
import { listUsersRouter } from './routes/users';
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

app.get('/api/query/health', (req, res) => {
  res.send({ status: 'ok', service: 'query' });
});

app.use(listTournamentsRouter);
app.use(tournamentDetailsRouter);
app.use(listUsersRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
