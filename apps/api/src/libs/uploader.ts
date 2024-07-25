import { Request } from 'express';
import multer, { Multer } from 'multer';
import { join } from 'path';
import path = require('path');
import { HttpException } from '@/errors/httpException';
import type { FileFilterCallback } from 'multer';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

export function uploader(
  filePrefix: string,
  size: number,
  folderName?: string,
): Multer {
  const defaultDir = join(__dirname, '../../public');

  const storage = multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: DestinationCallback,
    ) => {
      const destination = folderName ? defaultDir + folderName : defaultDir;
      cb(null, destination);
    },

    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: FileNameCallback,
    ) => {
      const originalNameParts = file.originalname.split('.');
      const fileExtension = originalNameParts[originalNameParts.length - 1];
      const newFileName = filePrefix + Date.now() + '.' + fileExtension;

      cb(null, newFileName);
    },
  });

  function filter(
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ): void {
    const extension = path.extname(file.originalname);
    if (extension !== '.png' && extension !== '.jpg' && extension !== '.jpeg') {
      cb(new HttpException(400, 'Extension type is invalid'));
    }
    cb(null, true);
  }

  return multer({
    storage: storage,
    fileFilter: filter,
    limits: { fileSize: size * size },
  });
}
