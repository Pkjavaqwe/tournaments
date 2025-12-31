import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { pendingRequestsRouter } from './routes/pending-requests';
import { approveRequestRouter } from './routes/approve';
import { rejectRequestRouter } from './routes/reject';
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

app.use(pendingRequestsRouter);
app.use(approveRequestRouter);
app.use(rejectRequestRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
