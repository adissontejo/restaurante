import { PipeTransform } from '@nestjs/common';
import { extname } from 'path';
import { AppException, ExceptionType } from 'src/core/exception.core';

export class ImageFilePipe implements PipeTransform {
  transform(file?: Express.Multer.File) {
    if (!file) {
      return file;
    }

    const ext = extname(file.originalname).replace('.', '');

    if (!['png', 'jpg', 'jpeg'].includes(ext)) {
      throw new AppException(
        `Invalid file type: ${ext}`,
        ExceptionType.INVALID_PARAMS,
      );
    }

    return file;
  }
}
