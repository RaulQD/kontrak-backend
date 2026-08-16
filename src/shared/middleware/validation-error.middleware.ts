import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { UNPROCESSABLE_CONTENT } from '../constants/http';

type ValidatedRequestData = Partial<{
  body: unknown;
  query: unknown;
  params: Request['params'];
}>;

export const validationErrorMiddleware = (
  schema: ZodSchema<ValidatedRequestData>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    if (!result.success) {
      const formatErrors = result.error.issues.map((issue) => {
        const cleanPath = issue.path.slice(1).join('.');
        const finalPath = cleanPath || issue.path.join('.');
        return { field: finalPath, message: issue.message };
      });
      return res
        .status(UNPROCESSABLE_CONTENT)
        .json({ message: 'Validation errors', errors: formatErrors });
    }
    if (result.data.body !== undefined) req.body = result.data.body;
    if (result.data.query !== undefined) {
      Object.defineProperty(req, 'query', {
        value: result.data.query,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }
    if (result.data.params !== undefined) req.params = result.data.params;
    next();
  };
};
