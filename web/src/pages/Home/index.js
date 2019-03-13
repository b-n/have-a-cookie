import React from 'react'
import { schemeSet1 } from 'd3-scale-chromatic'

import { useWeightData } from '../../lib'
import { LineChart } from '../common'
import { useWindowDimensions, useOrdinalScale } from '../../hooks'


import './Home.css'

const Home = () => {
  const allData = useWeightData({includeHistory: true});

  const [ width ] = useWindowDimensions();

  const ids = allData.map(d => d.id);
  console.log(ids, schemeSet1);
  const lineColors = useOrdinalScale({domain: ids, range: schemeSet1 })

  const graphData = allData.map(d => ({ ...d, key: d.id, color: lineColors(d.id), ratio: 1 }))
  console.log(graphData);

  const yAccessor = d => +d.weight;
  const xAccessor = d => Date.parse(d.datetime);

  return (
    <>
      <LineChart
        data={graphData}
        width={width}
        height={400}
        yAccessor={yAccessor}
        xAccessor={xAccessor}
      />
      {graphData.map(d => (
        <LineChart
          key={d.id}
          data={[d]}
          width={width}
          height={400}
          yAccessor={d => +d.weight}
          xAccessor={d => Date.parse(d.datetime)}
        />
      ))}
    </>
  )
}

export default Home;
