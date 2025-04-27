export function excelSerialToDate(serial: number): Date | undefined {
  if (typeof serial !== "number" || isNaN(serial)) return undefined;

  const utcDays = serial - 25569;
  const utcSeconds = utcDays * 86400;
  const date = new Date(utcSeconds * 1000);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return undefined;
  }

  return date;
}
