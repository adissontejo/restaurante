import { Inject } from '@nestjs/common';
import { Database } from 'src/database/database.service';
import { StorageService } from 'src/storage/storage.service';

export const Transaction = () => {
  return (
    target: any,
    propertyName: string,
    propertyDescriptor: PropertyDescriptor,
  ) => {
    const original = propertyDescriptor.value;

    Inject(Database)(target, '__transaction_db');
    Inject(StorageService)(target, '__transaction_storageService');

    propertyDescriptor.value = async function (...args) {
      const db: Database = this.__transaction_db;
      const storageService: StorageService = this.__transaction_storageService;

      return storageService.transaction(() =>
        db.transaction(() => original.apply(this, args)),
      );
    };
  };
};
