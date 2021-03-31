export const colorLegend = (selection, props) => {
    const {
        colorScale,
        circleRadius,
        spacing,
        textOffset,
        backgroundRectWidth
    } = props

    const backgroundRect = selection.selectAll('rect')
        .data([null])
    backgroundRect.enter().append('rect')
        .merge(backgroundRect)
        .attr('x', -circleRadius * 2)
        .attr('y', -circleRadius * 2)
        .attr('rx', circleRadius * 2)
        .attr('width', backgroundRectWidth)
        .attr('height', spacing * colorScale.domain().length + (circleRadius * 2))
        .attr('fill', '#FFF')

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