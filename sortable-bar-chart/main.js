d3.csv('alphabet.csv').then((data) => {
    render(data)
})

render = (data) => {
    const w = 1200, h = 500

    const svg = d3.select('#viz')
        .append('svg')
        .attr('viewBox', [0, 0, w, h])

    const margin = { top: 50, right: 50, bottom: 50, left: 50 }
    const innerWidth = w - margin.left - margin.right
    const innerHeight = h - margin.top - margin.bottom

    const xVal = d => d.letter
    const yVal = d => d.frequency,
        yAxisLabel = 'Frequency'

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const y = d3.scaleLinear()
        .domain(d3.extent(data, yVal))
        .range([innerHeight, 0])
        .nice()

    const yAxis = d3.axisLeft(y)

    const yAxisG = g.append('g')
        .call(yAxis)
    yAxisG.select('.domain')
        .remove()
    yAxisG.append('text')
        .attr('x', -innerHeight / 2)
        .attr('y', -40)
        .attr('fill', 'black')
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text(yAxisLabel);

    const x = d3.scaleBand()
        .range([0, innerWidth])
        .padding(.1)

    const xAxisG = g.append('g')

    xAxisG.attr('transform', `translate(0, ${innerHeight})`)

    update = (data) => {
        x.domain(data.map(d => xVal(d)))

        const xAxis = d3.axisBottom(x)
        xAxisG.call(xAxis)

        const u = g.selectAll('rect').data(data)
    
        u
            .enter()
            .append('rect')
            .merge(u)
            .style('mix-blend-mode', 'multiply')
            .style('fill', 'steelblue')
            .transition()
            .duration(750)
            .attr('x', d => x(xVal(d)))
            .attr('y', d => y(yVal(d)))
            .attr('height', d => y(0) - y(yVal(d)))
            .attr('width', x.bandwidth())

        u
            .exit()
            .remove()
    }

    // init
    update(data)

    d3.select('#sort-by').on('change', function() {
        const sortBy = this.value

        if (sortBy === 'ascending') {
            data.sort((a, b) => {
                return d3.ascending(a.frequency, b.frequency)
            })
        }
        else if (sortBy === 'descending') {
            data.sort((a, b) => {
                return d3.descending(a.frequency, b.frequency)
            })
        }
        else if (sortBy === 'alphabetical') {
            data.sort((a, b) => {
                return d3.ascending(a.letter, b.letter)
            })
        }

        update(data)
    })
}