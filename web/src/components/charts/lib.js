export const getChartSizesFromElem = elem => {
    const margin = { top: 20, right: 20, bottom: 30, left: 50 }
    const width = elem.offsetWidth - margin.left - margin.right
    const height = elem.offsetHeight - margin.top - margin.bottom

    return {
        container: {
            width: elem.offsetWidth,
            height: elem.offsetHeight,
        },
        chart: {
            margin,
            width,
            height,
        },
    }
}

export const setElemSize = (elem, { width, height }) => {
    elem.attr('width', width)
        .attr('height', height)
}

export const drawChartArea = (svg, margin) => {
    const chartArea = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')')
    chartArea.append('clipPath')
        .attr('id', 'clip')
        .append('rect')

    return chartArea
}

export const setClipPathSize = (chartArea, { width, height }) => {
    chartArea.select('clipPath').select('rect')
        .attr('width', width)
        .attr('height', height)
    return chartArea
}

export const drawAxes = (chartArea, { x, y }, height) => {
    chartArea.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0, ' + height + ')')
        .call(x)

    chartArea.append('g')
        .attr('class', 'axis axis--y')
        .call(y)
}

export const updateAxes = (chartArea, { x, y }, isRendering) => {
    if (isRendering) return

    chartArea.select('g.axis--x').transition()
        .duration(800)
        .call(x)

    chartArea.select('g.axis--y').transition()
        .duration(800)
        .call(y)
}
