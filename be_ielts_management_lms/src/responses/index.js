// Response Messages Manager
const en = require("./en");
const vi = require("./vi");

const messages = {
  en,
  vi,
};

/**
 * Get messages for a specific language
 * @param {string} lang - Language code (en, vi)
 * @returns {Object} Messages object
 */
const getMessages = (lang = "en") => {
  return messages[lang] || messages.en;
};

/**
 * Get a specific message
 * @param {string} key - Message key (e.g., 'AUTH.LOGIN_SUCCESS')
 * @param {string} lang - Language code
 * @returns {string} Message
 */
const getMessage = (key, lang = "en") => {
  const msgs = getMessages(lang);
  const keys = key.split(".");
  let message = msgs;

  for (const k of keys) {
    message = message[k];
    if (!message) {
      return key; // Return key if message not found
    }
  }

  return message;
};

module.exports = {
  getMessages,
  getMessage,
};
