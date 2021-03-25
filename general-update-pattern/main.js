// import { fruitBowl } from './fruitBowl'

const svg = d3.select('svg')

const w = +svg.attr('width'), h = +svg.attr('height')

const colorScale = d3.scaleOrdinal()
    .domain(['apple', 'lemon'])
    .range(['#E73F0B', '#F4EC6A'])

const radiusScale = d3.scaleOrdinal()
    .domain(['apple', 'lemon'])
    .range([50, 30])

const makeFruit = type => ({
    type,
    id: Math.random()
})

let fruits = d3.range(5)
    .map(() => makeFruit('apple'))

const xPos = (d, i) => i * 120 + 60

let selectedFruit = null

const setSelectedFruit = (id) => {
    selectedFruit = id
    render()
}

const fruitBowl = (selection, props) => {
    const { fruits } = props

    const bowl = selection.selectAll('rect')
        .data([null]) // use this for singular element
        .enter()
        .append('rect')
        .attr('y', 110)
        .attr('width', 600)
        .attr('height', 300)
        .attr('rx', 300 / 2)

    const circles = selection.selectAll('circle').data(fruits, d => d.id) // pass in id for object constancy
    circles
        .enter()
            // these below do not change, so put under enter()
            .append('circle')
            .attr('cy', h / 2)
            .attr('r', 0)
            .attr('cx', xPos)
        .merge(circles)
            // these do change, so put under merge()
            .attr('r', d => radiusScale(d.type))
            .attr('stroke-width', 5)
            .attr('stroke', d => 
                d.id === selectedFruit
                    ? 'white'
                    : 'none'
            )
            .on('mouseover', (e, d) => setSelectedFruit(d.id))
            .on('mouseout', () => setSelectedFruit(null))
        .transition().duration(500)
            .attr('cx', xPos)
            .attr('fill', d => colorScale(d.type))

    circles
        .exit()
        .transition().duration(500)
            .attr('r', 0)
            .remove()
}

const render = () => {
    fruitBowl(
        svg,
        { fruits,  selectedFruit})
}

render()

// Eat an apple
setTimeout(() => {
    fruits.pop()
    render()
}, 1000)
// Swap an apple with a lemon
setTimeout(() => {
    fruits[2].type = 'lemon'
    render()
}, 2000)
// Eat the apple on the 2nd position
setTimeout(() => {
    fruits = fruits.filter((d, i) => i !== 1)
    render()
}, 3000)