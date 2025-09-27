export const storage = {
  set: (key, value, ttl = null) => {
    try {
      const item = { value };
      if (ttl) item.expiry = Date.now() + ttl;
      localStorage.setItem(key, JSON.stringify(item));
    } catch (err) {
      console.error('localStorage set error:', err);
    }
  },

  get: (key) => {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      if (item.expiry && Date.now() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return item.value;
    } catch (err) {
      console.error('localStorage get error:', err);
      return null;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error('localStorage remove error:', err);
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (err) {
      console.error('localStorage clear error:', err);
    }
  }
};
