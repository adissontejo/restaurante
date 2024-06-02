export const generateInsertBody = (row: Record<string, any>) => {
  const columns = Object.keys(row).filter((item) => row[item] !== undefined);

  return `
    (${columns.join(', ')})
    VALUES (${columns.map((column) => `:${column}`).join(', ')})
  `;
};

export const generateUpdateSetters = (
  row: Record<string, any>,
  defaultSetter: string = 'id = id',
) => {
  const columns = Object.keys(row).filter((item) => row[item] !== undefined);

  const setters = columns.map((column) => `${column} = :${column}`);

  if (!setters.length) {
    return defaultSetter;
  }

  return setters.join(', ');
};
