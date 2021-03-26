import { select, arc } from 'd3';

/** SMILING FACE */
const smilingFaceSvg = select('#smiling-face');

const w = +(smilingFaceSvg.attr('width')),
    h = +(smilingFaceSvg.attr('height'));

const eyeSpacing = 120,
    eyeYOffset = 100,
    eyeRadius = 30,
    eyebrowWidth = 70,
    eyebrowHeight = 15,
    eyebrowYOffset = -70;

const g = smilingFaceSvg
    .append('g')
        .attr('transform', `translate(${w / 2}, ${h / 2})`);

const circle = g
    .append('circle')
        .attr('r', h / 2)
        // .attr('cx', w / 2)
        // .attr('cy', h / 2)
        .attr('fill', 'yellow')
        .attr('stroke', 'black');

const eyesG = g
    .append('g')
        .attr('transform', `translate(0, ${-eyeYOffset})`);

const leftEye = eyesG
    .append('circle')
        .attr('r', eyeRadius)
        .attr('cx', -eyeSpacing);

const rightEye = eyesG
    .append('circle')
        .attr('r', eyeRadius)
        .attr('cx', eyeSpacing);

const eyebrowsG = eyesG
    .append('g')
    .attr('transform', `translate(0, ${eyebrowYOffset})`);
// separate like this,
// as trasition() cannot be called from attr()
eyebrowsG
    .transition().duration(2000)
        .attr('transform', `translate(0, ${eyebrowYOffset - 50})`)
    .transition().duration(2000)
        .attr('transform', `translate(0, ${eyebrowYOffset})`);

const leftEyebrow = eyebrowsG
    .append('rect')
        .attr('x', -eyeSpacing - eyebrowWidth / 2)
        .attr('width', eyebrowWidth)
        .attr('height', eyebrowHeight)

const rightEyebrow = eyebrowsG
    .append('rect')
        .attr('x', eyeSpacing - eyebrowWidth / 2)
        .attr('width', eyebrowWidth)
        .attr('height', eyebrowHeight);

const mouth = g
    .append('path')
        .attr('d', arc()({
            innerRadius: 170,
            outerRadius: 200,
            startAngle: Math.PI / 2,
            endAngle: Math.PI * 3/2
        }));line
/** End SMILING FACE */

/** BAR CHART */
import {
    csv,
    scaleLinear,
    max,
    scaleBand,
    axisLeft,
    axisBottom,
    format
} from 'd3';

const barChartSvg = select('#bar-chart');

const bchartW = +barChartSvg.attr('width'),
    bchartH = +barChartSvg.attr('height');

const renderBarChart = data => {
    const xVal = d => d.population, yVal = d => d.country;
    const margin = { top: 50, right: 20, bottom: 50, left: 80 };
    const innerWidth = bchartW - margin.left - margin.right;
    const innerHeight = bchartH - margin.top - margin.bottom;

    const xScale = scaleLinear()
        .domain([0, max(data, d => xVal(d))])
        .range([0, innerWidth])
        .nice();

    const yScale = scaleBand()
        .domain(data.map(d => yVal(d)))
        .range([0, innerHeight])
        .padding(0.1);

    // layout convention
    const g = barChartSvg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const customXAxisTickFormat = num =>
        format('.3s')(num)
            .replace('G', 'B');

    const xAxis = axisBottom(xScale)
        .tickFormat(customXAxisTickFormat)
        .tickSize(-innerHeight);
    const xAxisG = g.append('g').call(xAxis)
        .attr('transform', `translate(0, ${innerHeight})`);
        // .attr('font-size', '1.1rem');
    xAxisG.select('.domain')
        .remove(); // remove the domain line

    xAxisG.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', 30)
        .attr('fill', 'black')
        .text('Population');

    // ordinary way
    // const yAxis = axisLeft(yScale);
    // yAxis(g.append('g'));
    // OR
    // modern way
    g.append('g')
        .call(axisLeft(yScale))
        .selectAll('.tick > line')
            .remove(); // remove the yAxis' ticks

    g.append('text')
        .attr('x', 350)
        .attr('y', -10)
        .text('Top 10 Most Populous Countries');

    g.selectAll('rect').data(data)
        .enter().append('rect')
            .attr('y', d => yScale(yVal(d)))
            .attr('width', d => xScale(xVal(d)))
            .attr('height', yScale.bandwidth())
            .attr('fill', 'steelblue');
}

csv('./data/pop.csv').then(data => {
    data.forEach(d => {
        d.population = +d.population * 1000;
    });
    renderBarChart(data);
});
/** End BAR CHART */

/** SCATTER PLOT */
import { extent } from 'd3';

const renderScatterPlot = data => {
    const scatterPlotSvg = select('#scatter-plot');
    
    const sPlotW = +scatterPlotSvg.attr('width'),
        sPlotH = +scatterPlotSvg.attr('height');

    const xVal = d => d.weight, xAxisLabel = 'Weight';
    const yVal = d => d.horsepower, yAxisLabel = 'Horsepower';
    const circleRadius = 5;
    const margin = { top: 50, right: 20, bottom: 50, left: 80 };
    const innerWidth = sPlotW - margin.left - margin.right;
    const innerHeight = sPlotH - margin.top - margin.bottom;

    const xScale = scaleLinear()
        // .domain([min(data, xVal), max(data, xVal)])
        // equivalent to
        .domain(extent(data, xVal))
        .range([0, innerWidth])
        .nice();

    const yScale = scaleLinear()
        .domain(extent(data, yVal))
        .range([innerHeight, 0])
        .nice();

    const g = scatterPlotSvg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const customXAxisTickFormat = num =>
        format('.3s')(num)
            .replace('G', 'B');

    const xAxis = axisBottom(xScale)
        .tickFormat(customXAxisTickFormat)
        .tickSize(-innerHeight)
        .tickPadding(10);
    const xAxisG = g.append('g').call(xAxis)
        .attr('transform', `translate(0, ${innerHeight})`);
    xAxisG.select('.domain')
        .remove(); // remove the domain line

    xAxisG.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', 30)
        .attr('fill', 'black')
        .text(xAxisLabel);

    const yAxis = axisLeft(yScale)
        .tickFormat(customXAxisTickFormat)
        .tickSize(-innerWidth)
        .tickPadding(10);

    const yAxisG = g.append('g')
        .call(yAxis);

    yAxisG.selectAll('.domain')
        .remove();
    yAxisG.append('text')
            .attr('x', -innerHeight / 2)
            .attr('y', -30)
            .attr('fill', 'black')
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'middle')
            .text(yAxisLabel);

    g.append('text')
        .attr('x', 350)
        .attr('y', -10)
        .text('Cars');

    g.selectAll('circle').data(data)
        .enter().append('circle')
            .attr('cx', d => xScale(xVal(d)))
            .attr('cy', d => yScale(yVal(d)))
            .attr('r', circleRadius)
            .attr('fill', 'steelblue');
}

csv('./data/auto-mpg.csv').then(data => {
    data.forEach(d => {
        d.mpg = +d.mpg;
        d.cylinders = +d.cylinders;
        d.displacement = +d.displacement;
        d.horsepower = +d.horsepower;
        d.weight = +d.weight;
        d.acceleration = +d.acceleration;
        d.year = +d.year;
    });
    renderScatterPlot(data);
});
/** End SCATTER PLOT */

/** LINE CHART */
import { scaleTime, timeFormat, line, curveBasis } from 'd3';

const renderLineChart = data => {
    const lineChartSvg = select('#line-chart');

    const lChartW = +lineChartSvg.attr('width'),
        lChartH = +lineChartSvg.attr('height');

    const xVal = d => d.timestamp, xAxisLabel = 'Time';
    const yVal = d => d.temperature, yAxisLabel = 'Temperature';
    const margin = { top: 50, right: 20, bottom: 50, left: 80 };
    const innerWidth = lChartW - margin.left - margin.right;
    const innerHeight = lChartH - margin.top - margin.bottom;

    const xScale = scaleTime()
        .domain(extent(data, xVal))
        .range([0, innerWidth]);

    const yScale = scaleLinear()
        .domain(extent(data, yVal))
        .range([innerHeight, 0])
        .nice();

    const g = lineChartSvg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const customXAxisTickFormat = timeFormat('%a %d');
    const customYAxisTickFormat = num =>
        format('.2s')(num);

    const xAxis = axisBottom(xScale)
        .tickFormat(customXAxisTickFormat)
        .ticks(7)
        .tickSize(-innerHeight)
        .tickPadding(10);
    const xAxisG = g.append('g').call(xAxis)
        .attr('transform', `translate(0, ${innerHeight})`);
    xAxisG.select('.domain')
        .remove(); // remove the domain line

    xAxisG.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', 30)
        .attr('fill', 'black')
        .text(xAxisLabel);

    const yAxis = axisLeft(yScale)
        .tickFormat(customYAxisTickFormat)
        .tickSize(-innerWidth)
        .tickPadding(10);

    const yAxisG = g.append('g')
        .call(yAxis);

    yAxisG.selectAll('.domain')
        .remove();
    yAxisG.append('text')
        .attr('x', -innerHeight / 2)
        .attr('y', -30)
        .attr('fill', 'black')
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text(yAxisLabel);

    g.append('text')
        .attr('x', 350)
        .attr('y', -10)
        .text('Temperature in a Week in San Francisco');

    const lineGenerator = line()
        .x(d => xScale(xVal(d)))
        .y(d => yScale(yVal(d)))
        .curve(curveBasis);

    g.append('path')
        .attr('d', lineGenerator(data))
        .attr('fill', 'none')
        .attr('stroke', 'maroon')
        // can use this but d3.curve(curveBasis) is better
        // .attr('stroke-linejoin', 'round')
        .attr('stroke-width', 5);
}

csv('./data/temp-in-sf.csv').then(data => {
    data.forEach(d => {
        d.temperature = +d.temperature;
        d.timestamp = new Date(d.timestamp);
    });
    renderLineChart(data);
});
/** End LINE CHART */

/** AREA CHART */
import { area } from 'd3'

const renderAreaChart = data => {
    const svg = select('#area-chart')

    const w = +svg.attr('width'),
        h = +svg.attr('height')

    const xVal = d => d.year, xAxisLabel = 'Time'
    const yVal = d => d.population, yAxisLabel = 'Population'
    const margin = { top: 50, right: 20, bottom: 50, left: 100 }
    const innerWidth = w - margin.left - margin.right
    const innerHeight = h - margin.top - margin.bottom

    const xScale = scaleTime()
        .domain(extent(data, xVal))
        .range([0, innerWidth])
        .nice()

    const yScale = scaleLinear()
        .domain([0, max(data, yVal)])
        .range([innerHeight, 0])

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const customXAxisTickFormat = timeFormat('%Y');
    const customYAxisTickFormat = num =>
        format('.1s')(num)
            .replace('G', 'B');

    const xAxis = axisBottom(xScale)
        .tickFormat(customXAxisTickFormat)
        .ticks(7)
        .tickSize(-innerHeight)
        .tickPadding(10)

    const xAxisG = g.append('g').call(xAxis)
        .attr('transform', `translate(0, ${innerHeight})`);
    xAxisG.select('.domain')
        .remove()

    xAxisG.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', 30)
        .attr('fill', 'black')
        .text(xAxisLabel)

    const yAxis = axisLeft(yScale)
        .tickFormat(customYAxisTickFormat)
        .tickSize(-innerWidth)
        .tickPadding(10)

    const yAxisG = g.append('g')
        .call(yAxis)

    yAxisG.selectAll('.domain')
        .remove()
    yAxisG.append('text')
        .attr('x', -innerHeight / 2)
        .attr('y', -30)
        .attr('fill', 'black')
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text(yAxisLabel)

    g.append('text')
        .attr('x', 350)
        .attr('y', -10)
        .text('World Population by Year (1950 - 2015)')

    const areaGenerator = area()
        .x(d => xScale(xVal(d)))
        .y0(innerHeight)
        .y1(d => yScale(yVal(d)))

    g.append('path')
        .attr('d', areaGenerator(data))
        .attr('fill', 'maroon')
        .attr('stroke', 'maroon')
        .attr('stroke-width', 5)
}

csv('./data/world-pop-by-year-2015.csv').then(data => {
    data.forEach(d => {
        d.population = +d.population
        d.year = new Date(d.year)
    });
    renderAreaChart(data)
});
/** End AREA CHART */

/** WORLD MAP */
import {
    json,
    tsv,
    geoPath,
    geoNaturalEarth1,
    zoom,
    transform
} from 'd3'
import { feature } from 'topojson-client'

// Load multiple data files
Promise.all([
    tsv('https://unpkg.com/world-atlas@1.1.4/world/110m.tsv'),
    json('https://unpkg.com/world-atlas@1.1.4/world/110m.json')
]).then(([tsvData, topoJSONData]) => {
    /** Use this, or use reduce() better */
    // const countryName = {}
    // tsvData.forEach(d => {
    //     countryName[d.iso_n3] = d.name
    // })
    const countryName = tsvData.reduce((accumulator, d) => {
        accumulator[d.iso_n3] = d.name
        return accumulator
    }, {})

    const countries = feature(topoJSONData, topoJSONData.objects.countries)
    const projection = geoNaturalEarth1()
        // where to center the map in degrees
        .center([0, 100])
        // zoomlevel
        .scale(2000)
        // map-rotation
        .rotate([0,0]);
    const pathGenerator = geoPath().projection(projection)
    
    const svg = select('#world-map')

    const width = svg.attr('width'), height = svg.attr('height')

    const g = svg.append('g')
    
    g.append('path')
        .attr('class', 'sphere')
        .attr('d', pathGenerator({type: 'Sphere'}))

    svg.call(zoom()
        .extent([[0, 0], [width, height]])
        // .scaleExtent([1, 8])
        .on('zoom', ({transform}) => {
            console.log(transform)
            g.attr('transform', transform)
        })
    )
    
    g.selectAll('path')
        .data(countries.features)
        .enter().append('path')
            .attr('class', 'country')
            .attr('d', d => pathGenerator(d))
        .append('title')
            .text(d => countryName[d.id])
})
/** End WORLD MAP */