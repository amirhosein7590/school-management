export default function toPersianNumber(input) {
  if (!input) return "";

  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

  return input.toString().replace(/\d/g, function (match) {
    return persianDigits[parseInt(match)];
  });
}
