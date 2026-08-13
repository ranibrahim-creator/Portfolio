const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const WEEKDAYS_SUN = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const MONTHS_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function parseISODate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(iso: string, amount: number): string {
  const date = parseISODate(iso);
  date.setDate(date.getDate() + amount);
  return toISODate(date);
}

export function isToday(iso: string): boolean {
  return iso === todayISO();
}

export function isYesterday(iso: string): boolean {
  return iso === addDays(todayISO(), -1);
}

export function formatDayTitle(iso: string): string {
  if (isToday(iso)) return 'Today';
  if (isYesterday(iso)) return 'Yesterday';
  const date = parseISODate(iso);
  return `${WEEKDAYS[date.getDay()]} ${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

export function formatFullDate(iso: string): string {
  const date = parseISODate(iso);
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function weekdayShort(iso: string): string {
  return WEEKDAYS[parseISODate(iso).getDay()];
}

export function startOfWeek(iso: string): string {
  const date = parseISODate(iso);
  const day = date.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + mondayOffset);
  return toISODate(date);
}

export function weekDates(iso: string): string[] {
  const start = startOfWeek(iso);
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

export function formatMonthYear(iso: string): string {
  const date = parseISODate(iso);
  return `${MONTHS_LONG[date.getMonth()]} ${date.getFullYear()}`;
}

export function startOfMonth(iso: string): string {
  const date = parseISODate(iso);
  date.setDate(1);
  return toISODate(date);
}

export function addMonths(iso: string, amount: number): string {
  const date = parseISODate(iso);
  date.setMonth(date.getMonth() + amount);
  return toISODate(date);
}

export function startOfWeekSunday(iso: string): string {
  const date = parseISODate(iso);
  date.setDate(date.getDate() - date.getDay());
  return toISODate(date);
}

export function weekDatesSunday(iso: string): string[] {
  const start = startOfWeekSunday(iso);
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

export function monthGrid(iso: string): (string | null)[] {
  const start = parseISODate(startOfMonth(iso));
  const year = start.getFullYear();
  const month = start.getMonth();
  const firstDow = start.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = [];
  for (let i = 0; i < firstDow; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(toISODate(new Date(year, month, day)));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function isFuture(iso: string): boolean {
  return iso > todayISO();
}

export function defaultMealForNow(): 'breakfast' | 'lunch' | 'dinner' | 'snacks' {
  const hour = new Date().getHours();
  if (hour < 11) return 'breakfast';
  if (hour < 15) return 'lunch';
  if (hour < 21) return 'dinner';
  return 'snacks';
}
