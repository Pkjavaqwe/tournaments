import express from 'express';
import 'express-async-errors';
import { errorHandler, NotFoundError } from '../../common/src';
import { EmailService } from './services/email-service';

const app = express();
app.set('trust proxy', true);
app.use(express.json());

// Health check endpoint
app.get('/api/email/health', (req, res) => {
  res.send({ status: 'ok', service: 'email' });
});

// View email logs (for POC/debugging)
app.get('/api/email/logs', (req, res) => {
  const logs = EmailService.getEmailLogs();
  res.send({
    count: logs.length,
    emails: logs,
  });
});

// Clear email logs (for POC/testing)
app.delete('/api/email/logs', (req, res) => {
  EmailService.clearLogs();
  res.send({ message: 'Email logs cleared' });
});

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
