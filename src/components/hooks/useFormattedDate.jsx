import { useCallback } from 'react';

const useFormattedDate = () => {
  const formatDate = useCallback((dateString, options = {}) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };

    return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
  }, []);

  return formatDate;
};

export default useFormattedDate;
