import { useState, useEffect } from 'react';
import debounce from 'debounce'

const useWindowDimensions = () => {
  const [dimensions, setDimensions] = useState([ window.innerWidth, window.innerHeight]);

  useEffect(() => {
    window.addEventListener('resize', debounce(() => {
      setDimensions([document.body.clientWidth, document.body.clientHeight]);
    }, 500));
  }, [])

  return dimensions;
}

export { useWindowDimensions };
