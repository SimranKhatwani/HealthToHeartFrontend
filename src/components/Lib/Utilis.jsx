import clsx from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines and merges Tailwind classes
 * @param {...(string | object | undefined)[]} inputs - Tailwind class names
 * @returns {string} - Merged class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
