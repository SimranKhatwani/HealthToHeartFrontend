/**
 * Utility function to translate dynamic values coming from the backend/database.
 * It normalizes the value into a camelCase translation key.
 * 
 * @param {string} namespace - The translation namespace (e.g., 'statuses', 'departments')
 * @param {string} value - The dynamic value to translate (e.g., 'In Progress', 'Cardiology')
 * @param {function} t - The i18next translation function `t` obtained from `useTranslation`
 * @returns {string} - The translated string, or the original value if translation is missing.
 */
export const translateValue = (namespace, value, t) => {
    if (!value || typeof value !== 'string') return value;

    // Normalize the value to a safe translation key format (camelCase or lowercase with no spaces)
    // Example: "In Progress" -> "inProgress", "Emergency" -> "emergency"
    const normalizedKey = value
        .trim()
        .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
        .split(' ')
        .map((word, index) => 
            index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join('');

    return t(`${namespace}.${normalizedKey}`, { defaultValue: value });
};
