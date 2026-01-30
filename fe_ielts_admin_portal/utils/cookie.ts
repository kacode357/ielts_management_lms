import Cookies from 'js-cookie';

export const cookieUtils = {
  set: (key: string, value: string, days: number = 7) => {
    Cookies.set(key, value, { expires: days });
  },

  get: (key: string): string | undefined => {
    return Cookies.get(key);
  },

  setJSON: <T,>(key: string, value: T, days: number = 7) => {
    Cookies.set(key, JSON.stringify(value), { expires: days });
  },

  getJSON: <T,>(key: string): T | null => {
    const value = Cookies.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  },

  remove: (key: string) => {
    Cookies.remove(key);
  },
};
