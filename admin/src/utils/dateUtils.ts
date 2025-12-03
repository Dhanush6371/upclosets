// Date utility functions for consistent formatting across the application

/**
 * Formats a date string to DD-MM-YYYY format
 * @param dateString - ISO date string or date object
 * @returns Formatted date string in DD-MM-YYYY format
 */
export const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

/**
 * Formats a date string to DD-MM-YYYY HH:MM format
 * @param dateString - ISO date string or date object
 * @returns Formatted date string in DD-MM-YYYY HH:MM format
 */
export const formatDateTime = (dateString: string | Date): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}-${month}-${year} ${hours}:${minutes}`;
};
