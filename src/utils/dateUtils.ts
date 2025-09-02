// src/utils/dateUtils.ts

// Returns a date N days before the given date
export function getDateBefore(baseDate: Date | string, days: number): string {
  const startDate =
    typeof baseDate === 'string' ? new Date(baseDate) : baseDate;
  const newDate = new Date(startDate);

  newDate.setDate(startDate.getDate() - days);

  const year = newDate.getFullYear();
  const month = String(newDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(newDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

// Returns today's date in YYYY-MM-DD format
export function getToday(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
