/**
 * Convert ISO date string to YYYY-MM-DD
 * @param {string | Date} inputDate
 * @returns {string}
 */
export default function formatToYMD(inputDate) {
    const date = new Date(inputDate);
  
    if (isNaN(date.getTime())) return "";
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
  
    return `${year}-${month}-${day}`;
  }