/** Builds a CSV file from the schedule and makes the browser download it. */
import type { ScheduleRow } from '../types';

const CSV_HEADER =
  'Period,Due Date,Payment,Principal,Interest,Employer Subsidy,Employee Share,Remaining Balance';

export function downloadScheduleCsv(schedule: ScheduleRow[], employeeName: string): void {
  const lines = schedule.map((row) =>
    [
      row.period,
      row.due,
      row.payment.toFixed(2),
      row.principal.toFixed(2),
      row.interest.toFixed(2),
      row.employer.toFixed(2),
      row.employee.toFixed(2),
      row.balance.toFixed(2),
    ].join(','),
  );
  const csv = [CSV_HEADER, ...lines].join('\n');

  // Turn the text into a temporary file URL and "click" a hidden link to download it.
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `loancalc-ph-${toFileNamePart(employeeName)}.csv`;
  link.click();

  // Free the temporary URL shortly after the download starts.
  setTimeout(() => URL.revokeObjectURL(url), 800);
}

/** "Maria Santos" -> "maria-santos"; empty name -> "employee". */
function toFileNamePart(name: string): string {
  return (name || 'employee').toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
