import { useState, useEffect } from 'react';
import debounce from 'debounce'

const useWindowDimensions = () => {
  const [dimensions, setDimensions] = useState([ window.innerWidth, window.innerHeight]);

  useEffect(() => {
    window.addEventListener('resize', debounce(() => {
      setDimensions([window.innerWidth, window.innerHeight]);
    }, 500));
  }, [])

  return dimensions;
}

export { useWindowDimensions };
