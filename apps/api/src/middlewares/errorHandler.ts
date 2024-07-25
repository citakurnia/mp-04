import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@/errors/httpException';
import { MulterError } from 'multer';
import { deletePhoto } from '@/utils/deletePhoto';

export function ErrorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (req.file !== undefined) {
    const firstLetter = req.file.filename[0];

    if (firstLetter == 'a') {
      deletePhoto(req.file.filename, 'avatars');
    } else if (firstLetter == 'e') {
      deletePhoto(req.file.filename, 'events');
    }
  }

  if (error instanceof HttpException) {
    res.status(error.status).json({ message: error.message });
  } else if (error instanceof MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ message: 'File size limit exceeded' });
    }
  } else {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
