import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { CelebrateError } from 'celebrate';
import routes from './routes';
import AppError from '@shared/errors/AppError';
import '@shared/typeorm';
import customErrorMessage from '@utils/customErrorMessage';
import upload from '@config/upload';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/files', express.static(upload.directory));

app.use(routes);

app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    if (error instanceof CelebrateError) {
      const [segment] = error.details.keys();
      const [joiError] = error.details.values();
      const fieldName = joiError.details[0].path[0];
      const errorType = joiError.details[0].type;
      const defaultMessageError = joiError.message;
      return response.status(400).json({
        status: 'error',
        message: customErrorMessage(
          fieldName,
          errorType,
          segment,
          defaultMessageError,
        ),
      });
    }

    return response.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  },
);

app.listen(3333, () => {
  console.log('server started on port 3333');
});
