// useClickAway.js (or hooks/useClickAway.js)
import { useEffect } from 'react';

const useClickAway = (ref, onClickAway) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickAway();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, onClickAway]);
};

export default useClickAway;