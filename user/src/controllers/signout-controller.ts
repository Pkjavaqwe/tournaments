import { Request, Response } from 'express';

export const signoutController = (req: Request, res: Response) => {
  req.session = undefined;
  res.send({ message: 'Signed out successfully' });
};
