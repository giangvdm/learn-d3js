export const fruitBowl = (selection, { fruits }) => {
    const circles = selection.selectAll('circle').data(fruits)
    circles
        .enter()
            // these below do not change, so put under enter()
            .append('circle')
            .attr('cx', (d, i) => i * 120 + 60)
            .attr('cy', h / 2)
        .merge(circles)
            // these do change, so put under merge()
            .attr('r', d => radiusScale(d.type))
            .attr('fill', d => colorScale(d.type))

    circles
        .exit().remove()
}