export type LocalStorage = {
  getItem: (key: string) => string;
  setItem: (key: string, value: string) => boolean;
  clear: () => void;
};
export function getLocalStorage(): LocalStorage {
  const isBrowser: boolean = typeof window !== "undefined";

  const getItem = (key: string): string => {
    return isBrowser ? window.localStorage[key] : "";
  };

  const setItem = (key: string, value: string): boolean => {
    if (isBrowser) {
      window.localStorage.setItem(key, value);
      return true;
    }

    return false;
  };

  const clear = (): void => {
    window.localStorage.clear();
  };

  return {
    getItem,
    setItem,
    clear,
  };
}
