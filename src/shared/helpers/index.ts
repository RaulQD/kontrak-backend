import { Request } from 'express';

export const changeStringToDate = (date: string) => {
  const fechaString = date.split('/');

  return new Date(+fechaString[2], +fechaString[1] - 1, +fechaString[0]);
};

export const getAuth = (req: Request) => {
  if (!req.auth) {
    throw new Error('User not authenticated');
  }
  return req.auth;
};
