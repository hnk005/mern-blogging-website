export const storeInSession = (key: string, value: any) => {
  return sessionStorage.setItem(
    key,
    typeof value !== "string" ? JSON.stringify(value) : value
  );
};

export const lookInSession = (key: string) => {
  const store = sessionStorage.getItem(key);
  try {
    if (store) {
      return JSON.parse(store);
    }
  } catch {
    return store;
  }
};

export const removeFromSession = (key: string) => {
  return sessionStorage.removeItem(key);
};

export const clearSession = () => {
  return sessionStorage.clear();
};
