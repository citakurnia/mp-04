import { HttpException } from '@/errors/httpException';
import fs from 'fs';

export function deletePhoto(filename: string, foldername: string): void {
  try {
    fs.unlink(`public/${foldername}/${filename}`, (err) => {
      if (err) {
        throw new HttpException(501, 'Failed to delete photo');
      }
    });
  } catch (err) {
    throw err;
  }
}
