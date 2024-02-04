
export function convertToLocalTimeAndFormat(isoString: string) {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isototime(isoString: string) {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes}`;
  return timeString;
}

export  const makeISOString = (dateString: string, timeString: string) => {

  const dateTimeString = `${dateString}T${timeString}:00`;
  const dateTime = new Date(dateTimeString);
  
  const isoString = dateTime.toISOString();
  return isoString;
    }