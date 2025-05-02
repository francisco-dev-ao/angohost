
import { supabase } from '@/integrations/supabase/client';

// Cache for currency format to avoid excessive requests
let cachedFormat: string | null = null;
let formatFetchPromise: Promise<string> | null = null;

/**
 * Fetches the current currency format from admin settings
 */
export const getCurrencyFormat = async (): Promise<string> => {
  // If we already have a cached format, return it immediately
  if (cachedFormat !== null) {
    return cachedFormat;
  }
  
  // If there's already a fetch in progress, wait for it
  if (formatFetchPromise !== null) {
    return formatFetchPromise;
  }
  
  // Start a new fetch
  formatFetchPromise = new Promise<string>(async (resolve) => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('settings')
        .eq('id', 'general_settings')
        .single();
      
      if (!error && data && data.settings && data.settings.currencyFormat) {
        cachedFormat = data.settings.currencyFormat;
        resolve(data.settings.currencyFormat);
      } else {
        // Default to dot as separator if not found
        cachedFormat = '.';
        resolve('.');
      }
    } catch (error) {
      console.error('Error fetching currency format:', error);
      cachedFormat = '.';  // Default
      resolve('.');
    } finally {
      formatFetchPromise = null;
    }
  });
  
  return formatFetchPromise;
};

/**
 * Formats a price with the system-wide currency format
 */
export const formatPrice = async (price: number | string): Promise<string> => {
  const format = await getCurrencyFormat();
  
  // Convert price to a number if it's a string
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Format the number based on the currency format setting
  if (format === ',') {
    // Use comma as decimal separator (e.g., European format)
    return numericPrice.toString().replace('.', ',');
  } else {
    // Use dot as decimal separator (e.g., US/UK format)
    return numericPrice.toString();
  }
};

/**
 * Formats a price with the system-wide currency format (synchronous version)
 * This uses the cached format or falls back to the default
 */
export const formatPriceSync = (price: number | string): string => {
  const format = cachedFormat || '.';
  
  // Convert price to a number if it's a string
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Format the number based on the currency format setting
  if (format === ',') {
    // Use comma as decimal separator (e.g., European format)
    return numericPrice.toString().replace('.', ',');
  } else {
    // Use dot as decimal separator (e.g., US/UK format)
    return numericPrice.toString();
  }
};

// Initialize by fetching the current format
getCurrencyFormat().catch(console.error);
