import { Request, Response, NextFunction } from 'express';

export const checkIsAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
};

export const checkLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) return res.redirect('/dashboard');
  next();
};
