d3.csv('heatmap_data.csv').then(data => {
    render(data)
})

render = data => {
    const title = 'Heat Map with D3.js'
    const width = 500,
        height = 500

    const margin = {
            top: 50,
            right: 50,
            bottom: 50,
            left: 50
        },
        innerWidth = width - margin.left - margin.right,
        innerHeight = height - margin.top - margin.bottom;

    // map title
    const header = d3.select('#viz').append('header')
    header.append('h1')
        .attr('x', innerWidth / 2)
        .attr('y', 0)
        .text(title)

    const xVal = d => d.group,
        yVal = d => d.variable

    const svg = d3.select('#viz').append('svg')
        .attr('viewBox', [0, 0, width, height])

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const x = d3.scaleBand()
        .domain(data.map(xVal))
        .range([0, innerWidth])
        .padding(0.01)

    const xAxis = d3.axisBottom(x)

    const xAxisG = g.append('g').call(xAxis)
    xAxisG.attr('transform', `translate(0, ${innerHeight})`)

    const y = d3.scaleBand()
        .domain(data.map(yVal))
        .range([innerHeight, 0])
        .padding(0.01)

    const yAxis = d3.axisLeft(y)

    const yAxisG = g.append('g').call(yAxis)

    const colorScale = d3.scaleLinear()
        .range(["#FFF", "#003B46"])
        .domain([1, data.length])

    const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .attr('id', 'tooltip')
        .style('opacity', 0);

    g.selectAll('rect').data(data)
        .enter()
        .append('rect')
        .attr('x', d => x(xVal(d)))
        .attr('y', d => y(yVal(d)))
        .attr('width', x.bandwidth())
        .attr('height', y.bandwidth())
        .style('fill', d => colorScale(d.value))
        .attr('data-group', d => xVal(d))
        .attr('data-var', d => yVal(d))
        .attr('data-value', d => d.value)
        .on('mouseover', d => mouseoverHandler(d))
        .on('mousemove', mousemoveHandler)
        .on('mouseout', d => mouseoutHandler(d))

    function mouseoverHandler(d) {
        const cell = d3.select(d.target)
        cell.style('opacity', .7)
        tooltip
            .transition()
            .duration(200)
            .style('opacity', .9)
        tooltip.attr('data-year', d.Year)
        tooltip
            .html(
                cell.attr('data-group') +
                ':' +
                cell.attr('data-var') +
                '<br/>' +
                'Value: ' +
                cell.attr('data-value')
            )
            .style('left', event.pageX + 'px')
            .style('top', event.pageY - 28 + 'px')
    }

    function mousemoveHandler() {
        tooltip
            .style('left', event.pageX + 'px')
            .style('top', event.pageY - 28 + 'px')
    }

    function mouseoutHandler(d) {
        const cell = d3.select(d.target)
        cell.style('opacity', 1)
        tooltip
            .transition()
            .duration(200)
            .style('opacity', 0)
    }
}