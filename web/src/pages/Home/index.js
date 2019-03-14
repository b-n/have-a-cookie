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
  const lineColors = useOrdinalScale({domain: ids, range: schemeSet1 })

  const graphData = allData.map(d => {
    const start = d.initialReading || +d.data[0].weight;
    const data = d.data.map(e => ({ ...e, weight: +e.weight, relative: +e.weight - start, datetime: Date.parse(e.datetime)}))
    
    return {
      ...d,
      key: d.id,
      data,
      color: lineColors(d.id) 
    }
  })


  return (
    <>
      <LineChart
        data={graphData.filter(d => d.active)}
        width={width}
        height={400}
        yAccessor={d => d.relative}
        xAccessor={d => d.datetime}
        title="Everyone, Relative loss to first reading"
      />
      {graphData.map(d => (
        <LineChart
          key={d.id}
          data={[d]}
          width={width}
          height={400}
          yAccessor={d => d.weight}
          xAccessor={d => d.datetime}
          title={d.name}
        />
      ))}
      <LineChart
        title="Inactive relative loss"
        data={graphData.filter(d => !d.active)}
        width={width}
        height={400}
        yAccessor={d => d.relative}
        xAccessor={d => d.datetime}
      />
    </>
  )
}

export default Home;
