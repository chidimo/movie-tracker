export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};

export const formatTentative = (date: string): string => {
  return new Date(date).toLocaleDateString();
};

export const getPaddedNumber = (num: number, length: number = 2): string => {
  return num.toString().padStart(length, '0');
};

export const isWithinDays = (date: string, days: number = 7): boolean => {
  const targetDate = new Date(date);
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= days && diffDays >= 0;
};
