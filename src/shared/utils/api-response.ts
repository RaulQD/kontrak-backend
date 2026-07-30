import { Response } from 'express';

export interface ApiResponseBody<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class ApiResponse {
  static success<T>(
    res: Response,
    data?: T | null,
    message = 'Success',
    statusCode = 200,
  ): Response {
    const body: ApiResponseBody<T> = {
      success: true,
      message,
      ...(data !== undefined && data !== null && { data }),
    };
    return res.status(statusCode).json(body);
  }

  static ok(res: Response, message = 'Success', statusCode = 200): Response {
    return ApiResponse.success(res, undefined, message, statusCode);
  }

  static created<T>(
    res: Response,
    data?: T | null,
    message = 'Created successfully',
  ): Response {
    return ApiResponse.success(res, data, message, 201);
  }

  static paginated<T>(
    res: Response,
    data: T[],
    pagination: PaginationMeta,
    message = 'Success',
  ): Response {
    const body: ApiResponseBody<T[]> = {
      success: true,
      message,
      data,
      pagination,
    };
    return res.status(200).json(body);
  }

  static error(
    res: Response,
    message: string,
    statusCode = 400,
    errors?: Record<string, string[]>,
  ): Response {
    const body = { success: false, message, errors };
    return res.status(statusCode).json(body);
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }
}
