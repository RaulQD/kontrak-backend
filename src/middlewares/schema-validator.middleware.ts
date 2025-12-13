import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodObject, ZodError } from 'zod';
import { BAD_REQUEST } from '../constants/http';

export const schemaValidatorMiddleware = (
  schema: ZodObject,
): RequestHandler => {
  return (request: Request, response: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: request.body,
        params: request.params,
        query: request.query,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        return response.status(BAD_REQUEST).json({
          success: false,
          message: 'Error de validación',
          errors: errorMessages,
        });
      }
      next(error);
    }
  };
};
