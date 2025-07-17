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

// Format currency for Turkish locale
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '₺0,00';
  
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

// Format date for Turkish locale
export function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Format number with thousand separators
export function formatNumber(number) {
  if (number === null || number === undefined) return '0';
  
  return new Intl.NumberFormat('tr-TR').format(number);
}

// Calculate percentage
export function calculatePercentage(value, total) {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100 * 100) / 100;
}
