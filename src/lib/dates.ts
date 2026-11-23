/** Date helpers used to build the list of due dates. */
import type { Freq } from '../types';

const MS_PER_DAY = 86_400_000;

/** Returns a new date `months` months after `date` (the original is not changed). */
function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/** Moves to the next "15th or 30th" pay date. */
function nextSemiMonthly(date: Date): Date {
  const result = new Date(date);
  const day = result.getDate();
  if (day < 15) {
    result.setDate(15);
  } else if (day < 30) {
    result.setDate(30);
  } else {
    result.setMonth(result.getMonth() + 1);
    result.setDate(15);
  }
  // KNOWN ISSUE: February has no 30th, so JavaScript rolls it over into March and
  // this skips both February pay dates (Jan 30 -> Mar 15). Left as-is on purpose;
  // see "Known Issues" in the README.
  return result;
}

/**
 * Builds `count` due dates, each one a payment period after the previous one,
 * starting from `start` (the start date itself is NOT a due date).
 */
export function buildDueDates(start: Date, count: number, freq: Freq): Date[] {
  const dates: Date[] = [];
  let current = new Date(start);

  for (let i = 0; i < count; i++) {
    if (freq === 'monthly') current = addMonths(current, 1);
    else if (freq === 'semi') current = nextSemiMonthly(current);
    else if (freq === 'biweekly') current = new Date(current.getTime() + 14 * MS_PER_DAY);
    else current = new Date(current.getTime() + 7 * MS_PER_DAY);

    dates.push(new Date(current));
  }
  return dates;
}
