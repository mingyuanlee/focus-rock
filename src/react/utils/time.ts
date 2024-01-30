
export function convertToLocalTimeAndFormat(isoString: string) {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}