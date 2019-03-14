import React from 'react'
import { schemeSet1 } from 'd3-scale-chromatic'
import styled from 'styled-components'

import { useWeightData } from '../../lib'
import { LineChart } from '../common'
import { useWindowDimensions, useOrdinalScale } from '../../hooks'

import './Home.css'

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`

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
    <Container>
      <LineChart
        data={graphData.filter(d => d.active)}
        width={width}
        height={500}
        yAccessor={d => d.relative}
        xAccessor={d => d.datetime}
        title="Everyone, Relative loss to first reading"
        className="chart chart-full"
      />
      {graphData.map(d => (
        <LineChart
          key={d.id}
          data={[d]}
          width={width/(width > 1200 ? 2: 1)}
          height={500}
          yAccessor={d => d.weight}
          xAccessor={d => d.datetime}
          title={d.name}
          className="chart chart-half"
        />
      ))}
      <LineChart
        title="Inactive relative loss"
        data={graphData.filter(d => !d.active)}
        width={width}
        height={500}
        yAccessor={d => d.relative}
        xAccessor={d => d.datetime}
        className="chart chart-full"
      />
    </Container>
  )
}

export default Home;
