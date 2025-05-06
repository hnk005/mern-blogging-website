export const storeInSesstion = (key: string, value: string) => {
  return sessionStorage.setItem(key, JSON.stringify(value));
};

export const lookInSession = (key: string) => {
  const store = sessionStorage.getItem(key);
  if (store) {
    return JSON.parse(store);
  }
  return null;
};

export const removeFromSession = (key: string) => {
  return sessionStorage.removeItem(key);
};

export const clearSession = () => {
  return sessionStorage.clear();
};
