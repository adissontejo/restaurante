import { Inject } from '@nestjs/common';
import { Database } from 'src/database/database.service';

export const Transaction = () => {
  return (
    target: any,
    propertyName: string,
    propertyDescriptor: PropertyDescriptor,
  ) => {
    const original = propertyDescriptor.value;

    Inject(Database)(target, '_db');

    propertyDescriptor.value = async function (...args) {
      const db = this._db;

      const results = await db.transaction(() => original.apply(this, args));

      return results;
    };
  };
};
