import { format } from 'date-fns';

export const inject = (value: any) => {
  if (value === null || value === undefined) {
    return 'NULL';
  } else if (Array.isArray(value)) {
    return value.map((item) => inject(item)).join(', ');
  } else if (value instanceof Date) {
    return `'${format(value, 'yyyy-MM-dd hh:mm:ss')}'`;
  } else if (typeof value === 'string') {
    return `'${value.replace(/'/g, "''")}'`;
  } else if (typeof value === 'number' || typeof value === 'boolean') {
    return value.toString();
  } else {
    throw new Error(
      `Injection for type of value not supported: ${typeof value}`,
    );
  }
};

export const extractColumns = <T extends Record<string, any>>(row: T) => {
  return Object.keys(row).filter((column) => row[column] !== undefined);
};

export const generateMultiInsertBody = <T extends Record<string, any>>(
  rows: T[],
) => {
  const columns: string[] = [];

  rows.forEach((row) => {
    extractColumns(row).forEach((column) => {
      if (!columns.includes(column)) {
        columns.push(column);
      }
    });
  });

  const insertColumns = `(${columns.join(', ')})`;
  const insertValues = rows
    .map((row) => {
      return `(${columns.map((column) => inject(row[column])).join(', ')})`;
    })
    .join(',\n');

  const sql = `
    ${insertColumns}
    VALUES
    ${insertValues}
  `;

  return sql;
};

export const generateInsertBody = <T extends Record<string, any>>(row: T) => {
  return generateMultiInsertBody([row]);
};

export const generateUpdateSetters = <T extends Record<string, any>>(
  row: T,
  defaultSetter: string = 'id = id',
) => {
  const columns = extractColumns(row);

  const setters = columns.map(
    (column) => `\t${column} = ${inject(row[column])}`,
  );

  if (!setters.length) {
    return defaultSetter;
  }

  return setters.join(',\n');
};
