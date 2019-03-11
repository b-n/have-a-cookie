import React from 'react';
import { useWeightData } from './lib';

const App = () => {
  const data = useWeightData({includeHistory: true});
  console.log(data);

  return (
    <div>Hello World</div>
  )
}

export default App;
