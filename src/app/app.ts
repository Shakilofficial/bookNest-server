import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './middleware/globalErrorHandler';
import notFound from './middleware/notFound';
import sendResponse from './utils/sendResponse';

const app: Application = express();

// Middlewares
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'] }));
app.use(cookieParser());
app.use(express.json());

// Routes
// app.use('/api/v1', router);

// Health Check
app.get('/', (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: '📚 BookNest Server is live 🚀',
    data: null,
  });
});

// Global error handler
app.use(globalErrorHandler);

// Not Found handler
app.use(notFound);

export default app;
