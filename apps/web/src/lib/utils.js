
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function handlePocketBaseError(error) {
  if (error?.status === 404) {
    return "Record not found. The requested data may have been deleted or is unavailable.";
  }
  if (error?.status === 403) {
    return "You do not have permission to access this record.";
  }
  if (error?.status === 400) {
    return "Bad request. Please check your input and try again.";
  }
  return error?.message || "An unexpected error occurred while fetching data.";
}
