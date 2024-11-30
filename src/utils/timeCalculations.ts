import { TimeRecord } from '../types';
import { startOfDay, startOfMonth, startOfYear, endOfDay, endOfMonth, endOfYear, isWithinInterval, format } from 'date-fns';

export const calculateHours = (checkIn: string, checkOut: string) => {
  const start = new Date(`${checkIn}`);
  const end = new Date(`${checkOut}`);
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
};

export const formatDateTime = (date: Date) => {
  return format(date, 'dd MMM yyyy HH:mm:ss');
};

export const calculateTotalHours = (records: TimeRecord[], interval: 'day' | 'month' | 'year') => {
  const now = new Date();
  let start: Date;
  let end: Date;

  switch (interval) {
    case 'day':
      start = startOfDay(now);
      end = endOfDay(now);
      break;
    case 'month':
      start = startOfMonth(now);
      end = endOfMonth(now);
      break;
    case 'year':
      start = startOfYear(now);
      end = endOfYear(now);
      break;
  }

  return records.reduce((total, record) => {
    if (!record.checkOut) return total;
    
    const recordDate = new Date(record.date);
    if (!isWithinInterval(recordDate, { start, end })) return total;
    
    return total + calculateHours(`${record.date} ${record.checkIn}`, `${record.date} ${record.checkOut}`);
  }, 0);
};