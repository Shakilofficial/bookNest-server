import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './middlewares/globalErrorHandler';
import notFound from './middlewares/notFound';
import router from './routes';
import sendResponse from './utils/sendResponse';

const app: Application = express();

// Middlewares
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/v1', router);

// Health Check
app.get('/', (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: '📚 BookNest Server is live 🚀',
  });
});

// Global error handler
app.use(globalErrorHandler);

// Not Found handler
app.use(notFound);

export default app;
