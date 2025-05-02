
import { supabase } from '@/integrations/supabase/client';

// Define a type for the admin settings
type AdminSettings = {
  currencyFormat: string;
  [key: string]: any;
};

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
      
      if (!error && data && data.settings) {
        // Cast settings to AdminSettings type
        const settings = data.settings as AdminSettings;
        if (settings.currencyFormat) {
          cachedFormat = settings.currencyFormat;
          resolve(settings.currencyFormat);
          return;
        }
      }
      
      // Default to dot as separator if not found
      cachedFormat = '.';
      resolve('.');
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

// Use synchronous version only in component renders
export const formatPrice = formatPriceSync;

// Add parsing function if it doesn't exist
export const parsePrice = (price: string): number => {
  if (!price) return 0;
  
  // First remove any currency symbols and spaces
  let cleaned = price.replace(/[^0-9.,]/g, '');
  
  // Replace commas with dots for calculation
  cleaned = cleaned.replace(',', '.');
  
  return parseFloat(cleaned);
};

// Initialize by fetching the current format
getCurrencyFormat().catch(console.error);
