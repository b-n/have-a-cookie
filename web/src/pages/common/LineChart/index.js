import React from 'react';
import Chart, { Line, AxisBottom, AxisLeft } from '../../../components/Chart'
import { useTimeScale, useLinearScale } from '../../../hooks'
import { extent } from 'd3-array';
import { Text } from '@potion/element'

const padExtent = (array, factor) => {
  const range = array[1]-array[0];
  return [ array[0] - range*factor, array[1] + range*factor ];
}

const LineChart = ({
  height,
  width,
  data,
  title = '',
  dataAccessor = d => d.data,
  yAccessor = d => d,
  xAccessor = d => d,
  domainY = 'auto',
  domainX = 'auto',
  children
}) => {

  const scaleX = useTimeScale({
    domain: domainX === 'auto'
      ? extent(data.reduce((a, c) => a.concat(dataAccessor(c)),[]), xAccessor)
      : domainX
  })

  const scaleY = useLinearScale({
    domain: padExtent(
      domainY === 'auto'
        ? extent(data.reduce((a, c) => a.concat(dataAccessor(c)),[]), yAccessor)
        : domainY,
      0.05
    )
  })

  return (
    <Chart
      height={height}
      width={width}
      marginLeft={50}
      marginRight={30}
      marginTop={50}
    >
      <Text className="title" x={10} y={-10}>{title}</Text>
      <AxisBottom
        scale={scaleX}
        gridlines
      />
      <AxisLeft
        scale={scaleY}
        gridlines
      />
      <Line
        x={d => scaleX(xAccessor(d))}
        y={d => scaleY(yAccessor(d))}
        accessor={dataAccessor}
        data={data}
        animate
      />
    </Chart>
  );
}

export { LineChart };
