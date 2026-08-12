import { Request } from 'express';
import { UnauthorizedError } from '../utils/app-error-v2';

export const changeStringToDate = (date: string) => {
  const fechaString = date.split('/');

  return new Date(+fechaString[2], +fechaString[1] - 1, +fechaString[0]);
};

export const getAuth = (req: Request) => {
  if (!req.auth) {
    throw new UnauthorizedError('Token de acceso');
  }
  return req.auth;
};
