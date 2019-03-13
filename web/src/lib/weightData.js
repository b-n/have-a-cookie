import { useState, useEffect } from 'react';
import { config } from '../config';

const useWeightData = ({includeHistory = true}) => {
  
  const [ data, setData ] = useState([]);

  useEffect(() => {
    const url = new URL('users', config.endpoint);
    if (includeHistory) url.searchParams.append('includeHistory', includeHistory);
    fetch(
      url,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      }
    )
      .then(res => res.json())
      .then(res => setData(Object.values(res.payload)));
  }, [includeHistory]);

  return data;
}

export { useWeightData }
