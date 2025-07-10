import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Generic data fetching function (with cache: 'no-store')
export async function getData(endpoint) {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch data');
    return await response.json();
  } catch (error) {
    console.error('getData error:', error);
    return [];
  }
}
