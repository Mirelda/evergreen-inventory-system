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

// Parallel data fetching function
export async function getParallelData(endpoints) {
  try {
    const promises = endpoints.map(endpoint => 
      fetch(`/api/${endpoint}`, {
        cache: 'no-store',
      }).then(response => {
        if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
        return response.json();
      })
    );
    
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error('getParallelData error:', error);
    return endpoints.map(() => []);
  }
}
