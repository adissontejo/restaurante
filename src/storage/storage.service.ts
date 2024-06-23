import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createNamespace } from 'cls-hooked';
import { existsSync } from 'fs';
import { mkdir, rm, writeFile } from 'fs/promises';
import { extname, resolve } from 'path';
import { AppException, ExceptionType } from 'src/core/exception.core';
import { v4 as uuid } from 'uuid';

type StorageTransactionNamespace = {
  transaction?: {
    createdFiles: string[];
    deletedFiles: string[];
  };
};

const storageTransactionNamespace =
  createNamespace<StorageTransactionNamespace>('STORAGE-TRANSACTION');

@Injectable()
export class StorageService {
  private uploadPath = 'uploads';

  constructor(private readonly configService: ConfigService) {}

  get uploadUrl() {
    return `${this.configService.get('SERVER_URL')}/storage`;
  }

  private getFilePath(fileName: string) {
    return resolve(this.uploadPath, fileName);
  }

  private getFileUrl(fileName: string) {
    return `${this.uploadUrl}/${fileName}`;
  }

  private extractFileNameFromUrl(fileUrl: string) {
    return fileUrl.replace(`${this.uploadUrl}/`, '');
  }

  async uploadFile(file: Express.Multer.File) {
    const fileName = `${uuid()}${extname(file.originalname)}`;
    const filePath = this.getFilePath(fileName);
    const fileUrl = this.getFileUrl(fileName);

    await mkdir(this.uploadPath, { recursive: true });
    await writeFile(filePath, file.buffer);

    const transaction = storageTransactionNamespace.get('transaction');
    transaction?.createdFiles.push(fileUrl);
    storageTransactionNamespace.set('transaction', transaction);

    return fileUrl;
  }

  async deleteFile(fileUrl: string) {
    if (!fileUrl.startsWith(this.uploadUrl)) {
      return;
    }

    const transaction = storageTransactionNamespace.get('transaction');

    if (transaction) {
      transaction.deletedFiles.push(fileUrl);
      storageTransactionNamespace.set('transaction', transaction);
    } else {
      const fileName = this.extractFileNameFromUrl(fileUrl);
      const filePath = this.getFilePath(fileName);

      await rm(filePath, { force: true });
    }
  }

  getFileByName(fileName: string) {
    const filePath = this.getFilePath(fileName);

    if (!existsSync(filePath)) {
      throw new AppException(
        `Arquivo ${fileName} não encontrado`,
        ExceptionType.DATA_NOT_FOUND,
      );
    }

    return filePath;
  }

  transaction<T>(fn: () => T) {
    return storageTransactionNamespace.runAndReturn(async () => {
      storageTransactionNamespace.set('transaction', {
        createdFiles: [],
        deletedFiles: [],
      });

      try {
        const result = await fn();

        const transaction = storageTransactionNamespace.get('transaction');
        storageTransactionNamespace.set('transaction', undefined);

        await Promise.all(
          transaction?.deletedFiles.map((fileUrl) =>
            this.deleteFile(fileUrl),
          ) || [],
        );

        return result;
      } catch (error) {
        const transaction = storageTransactionNamespace.get('transaction');
        storageTransactionNamespace.set('transaction', undefined);

        await Promise.all(
          transaction?.createdFiles.map((fileUrl) =>
            this.deleteFile(fileUrl),
          ) || [],
        );

        throw error;
      }
    });
  }
}
