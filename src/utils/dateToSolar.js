export default function dateToSolar(date) {
  const d = new Date(date);
  return d.toLocaleDateString("FA");
}
