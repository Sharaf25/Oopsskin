// utils/cache.js
const cacheData = {};
const cacheExpiry = {};

const cache = {
  get: function(key) {
    if (!cacheData[key]) return null;
    if (cacheExpiry[key] && cacheExpiry[key] < Date.now()) {
      delete cacheData[key];
      delete cacheExpiry[key];
      return null;
    }
    return cacheData[key];
  },
  set: function(key, value, ttlMs) {
    if (!ttlMs) ttlMs = 30 * 60 * 1000; // default 30 min
    cacheData[key] = value;
    cacheExpiry[key] = Date.now() + ttlMs;
  }
};

module.exports = cache;
