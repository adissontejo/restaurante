export const groupArray = <T, R = T[]>(
  data: T[],
  {
    by,
    format = (group) => group as R,
  }: { by: (item: T) => any; format?: (group: T[]) => R },
) => {
  const map = new Map<any, T[]>();

  data.forEach((item) => {
    const key = by(item);
    let group = map.get(key);
    if (!group) {
      group = [];
    }
    group.push(item);
    map.set(key, group);
  });

  const groups = Array.from(map.values());

  return groups.map(format);
};
