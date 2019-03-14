import React from 'react'
import { schemeSet1 } from 'd3-scale-chromatic'

import { useWeightData } from '../../lib'
import { LineChart } from '../common'
import { useWindowDimensions, useOrdinalScale } from '../../hooks'

import './Home.css'

const formatDataForGraph = (d, lineColors) => {
  
  const {
    initialReading = +d.data[0].weight,
    data,
    id
  } = d;

  return {
    ...d,
    key: id,
    data: data.map(e => ({
      ...e,
      weight: +e.weight,
      relative: +e.weight - initialReading,
      datetime: Date.parse(e.datetime)
    })),
    color: lineColors(id) 
  }
}

const Home = () => {

  const [ width ] = useWindowDimensions();

  const lineColors = useOrdinalScale({ range: schemeSet1 })

  const graphData = useWeightData({includeHistory: true})
    .map(d => formatDataForGraph(d, lineColors))

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
