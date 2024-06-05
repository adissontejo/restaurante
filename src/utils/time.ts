export const extractTime = (time: string) => {
  const [hours, minutes, seconds] = time
    .split(':')
    .map((value) => Number(value.replace(/\D/g, '')));

  return {
    hours: hours || 0,
    minutes: minutes || 0,
    seconds: seconds || 0,
  };
};

export const extractTimeInHours = (time: string) => {
  const { hours, minutes, seconds } = extractTime(time);

  return hours + minutes / 60 + seconds / (60 * 60);
};

export const compareTimes = (a: string, b: string) => {
  return extractTimeInHours(a) - extractTimeInHours(b);
};
