import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { createTournamentRouter } from './routes/create';
import { listTournamentsRouter } from './routes/list';
import { showTournamentRouter } from './routes/show';
import { updateTournamentRouter } from './routes/update';
import { deleteTournamentRouter } from './routes/delete';
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

app.use(createTournamentRouter);
app.use(listTournamentsRouter);
app.use(showTournamentRouter);
app.use(updateTournamentRouter);
app.use(deleteTournamentRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
