import { NextFunction, Response, Request } from 'express';
import { body, validationResult } from 'express-validator';

// TODO FOR USER
export const validateSample = [
  body('code').notEmpty().withMessage('Code is required'),
  body('name').notEmpty().withMessage('Name is required'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array });
    }

    next();
  },
];
