const svg = d3.select('svg')

const w = +svg.attr('width'), h = +svg.attr('height')

const colorScale = d3.scaleOrdinal()
    .domain(['apple', 'lemon', 'orange', 'lime', 'grape'])
    .range(['#E73F0B', '#F4EC6A', 'orange', 'green', 'purple'])

const sizeScale = d3.scaleSqrt()
    .domain([0, 10])
    .range([0, 50])

const xPos = (d, i) => i * 120 + 60

const colorLegend = (selection, props) => {
    const {
        colorScale,
        circleRadius,
        spacing,
        textOffset
    } = props

    const groups = selection.selectAll('g')
        .data(colorScale.domain())
    const groupsEnter = groups.enter().append('g')
    groupsEnter
        .merge(groups)
            .attr('transform', (d, i) => `translate(0, ${i * spacing})`)
    groups.exit().remove()

    groupsEnter.append('circle')
        .merge(groups.select('circle'))
            .attr('r', circleRadius)
            .attr('fill', d => colorScale(d))

    groupsEnter.append('text')
        .merge(groups.select('text'))
            .text(d => d)
            .attr('dy', '0.32em')
            .attr('x', textOffset)
}

const sizeLegend = (selection, props) => {
    const {
        sizeScale,
        spacing,
        textOffset
    } = props

    const ticks = sizeScale.ticks(5).filter(d => d !== 0)

    const groups = selection.selectAll('g')
        .data(ticks)
    const groupsEnter = groups.enter().append('g')
    groupsEnter
        .merge(groups)
            .attr('transform', (d, i) => `translate(0, ${i * spacing})`)
    groups.exit().remove()

    groupsEnter.append('circle')
        .merge(groups.select('circle'))
            .attr('r', d => sizeScale(d))
            .attr('fill', 'rgba(0, 0, 0, 0.5)')

    groupsEnter.append('text')
        .merge(groups.select('text'))
            .text(d => d)
            .attr('dy', '0.32em')
            .attr('x', d => sizeScale(d) + textOffset)
}

svg.append('g')
    .attr('transform', 'translate(100, 100)')
    .call(colorLegend, {
        colorScale,
        circleRadius: 20,
        spacing: 50,
        textOffset: 30
    }
)

svg.append('g')
    .attr('transform', 'translate(300, 100)')
    .call(sizeLegend, {
        sizeScale,
        circleRadius: 20,
        spacing: 80,
        textOffset: 30
    }
)