export default function dateToUTC(date) {
  const d = new Date(date);
  const utcDate = new Date(d.toUTCString());
  return utcDate;
}
