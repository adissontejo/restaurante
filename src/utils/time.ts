export const extractTime = (time: string) => {
  const [hours, minutes, seconds] = time.split(':').map(Number);

  return { hours, minutes, seconds };
};

export const extractTimeInHours = (time: string) => {
  const { hours, minutes, seconds } = extractTime(time);

  return hours + minutes / 60 + seconds / (60 * 60);
};

export const compareTimes = (a: string, b: string) => {
  return extractTimeInHours(a) - extractTimeInHours(b);
};
