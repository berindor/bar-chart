import './ScatterPlot.css';
import React from 'react';
import * as d3 from 'd3';

class ScatterPlot extends React.Component {
  async componentDidMount() {
    const dataset = await this.loadData();
    this.drawChart(dataset);
  }

  async loadData() {
    return await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
      .then(response => response.json())
      .then(data => {
        const dataArr = Object.values(data);
        const dataWithDateFormat = dataArr.map(obj => {
          return { ...obj, TimeInDate: new Date(obj.Seconds * 1000) };
        });
        console.log(dataWithDateFormat);
        return dataWithDateFormat;
      });
  }

  drawChart(dataset) {
    const n = dataset.length;
    const minTime = d3.min(dataset, d => d.TimeInDate);
    const maxTime = d3.max(dataset, d => d.TimeInDate);
    const minYaxis = new Date(d3.min(dataset, d => d.Seconds) * 1000 - 10 * 1000);
    const maxYaxis = new Date(d3.max(dataset, d => d.Seconds) * 1000 + 10 * 1000);
    const minYear = d3.min(dataset, d => d.Year);
    const maxYear = d3.max(dataset, d => d.Year);
    console.log('number of data: ' + n + ', min time: ' + minTime + ' sec, max: ' + maxTime + ' sec');
    console.log('Years: ' + minYear + ' to ' + maxYear);
    const w = 900;
    const h = 800;
    const padding = 50;
    d3.selectAll('svg').remove();
    d3.select('.tooltip').remove();
    const xScale = d3
      .scaleLinear()
      .domain([minYear - 0.5, maxYear + 0.5])
      .range([1.5 * padding, w - padding]);
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format(''));
    const yScale = d3
      .scaleTime()
      .domain([maxYaxis, minYaxis])
      .range([h - padding, padding]);
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.utcFormat('%M:%S'));
    const svg = d3.selectAll('.App').append('svg').attr('width', w).attr('height', h).style('background-color', 'green');
    var tooltip = d3.selectAll('.App').append('div').attr('id', 'tooltip').style('visibility', 'hidden');
    const mouseover = function (event) {
      const year = event.target.getAttribute('data-xvalue');
      const time = event.target.getAttribute('data-time');
      const name = event.target.getAttribute('data-name');
      const nationality = event.target.getAttribute('data-nationality');
      const doping = event.target.getAttribute('data-doping');
      const htmlText = name + ', ' + nationality + '<br> year: ' + year + ', time: ' + time + (doping === '' ? '' : '<br> Doping: ' + doping);
      tooltip
        .style('visibility', 'visible')
        .attr('data-year', year)
        .attr('data-time', time)
        .attr('data-name', name)
        .attr('data-nationality', nationality)
        .attr('data-doping', doping)
        .html(htmlText)
        .style('left', event.target.getAttribute('cx') - w / 2 + 'px')
        .style('top', event.target.getAttribute('cy') - padding - h - (doping === '' ? 5 : 25) + 'px')
        .style('background-color', doping === '' ? 'white' : 'orange');
    };
    const mouseout = function () {
      tooltip.style('visibility', 'hidden').attr('data-year', undefined);
    };

    svg
      .selectAll('circle')
      .data(dataset)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.Year))
      .attr('cy', d => yScale(d.TimeInDate))
      .attr('r', 8)
      .attr('class', 'dot')
      .attr('data-xvalue', d => d.Year)
      .attr('data-time', d => d.Time)
      .attr('data-yvalue', d => d.TimeInDate)
      .attr('data-name', d => d.Name)
      .attr('data-nationality', d => d.Nationality)
      .attr('data-doping', d => d.Doping)
      .attr('fill', d => (d.Doping === '' ? 'white' : 'orange'))
      .on('mouseover', mouseover)
      .on('mouseout', mouseout);

    svg
      .append('g')
      .attr('id', 'x-axis')
      .attr('transform', 'translate( 0, ' + (h - padding) + ')')
      .call(xAxis);
    svg
      .append('g')
      .attr('id', 'y-axis')
      .attr('transform', 'translate(' + 1.5 * padding + ', 0)')
      .call(yAxis);
    svg
      .append('text')
      .attr('text-anchor', 'end')
      .attr('transform', 'rotate(-90)')
      .attr('x', -h / 2 + padding)
      .attr('y', padding / 2)
      .text('time in minutes');

    d3.selectAll('#legend').remove();
    d3.selectAll('.App').append('div').attr('id', 'legend').style('backgroound-color', 'black');
    this.drawLegend();
  }

  drawLegend() {
    const lh = 40;
    const lw = 40;
    const colors = ['white', 'orange'];
    const legendSelect = d3.selectAll('#legend');
    legendSelect.selectAll('svg').remove();
    legendSelect.selectAll('div').remove();
    legendSelect
      .selectAll('svg')
      .data(colors)
      .enter()
      .append('svg')
      .attr('width', lw)
      .attr('height', lh)
      .style('background-color', 'green')
      .append('circle')
      .attr('cx', lw / 2)
      .attr('cy', lh / 2)
      .attr('r', 8)
      .attr('fill', d => d);
    const legendText = ['no doping', 'doping'];
    legendSelect
      .selectAll('div')
      .data(legendText)
      .enter()
      .append('div')
      .attr('height', lh)
      .attr('class', 'legend-text-div')
      .html(d => d);
  }

  render() {
    return <div id="scatter-plot"></div>;
  }
}

function ScatterPlotApp() {
  return (
    <div className="App">
      <h1 id="title">Doping in Professional Bicycle Racing</h1>
      <ScatterPlot />
    </div>
  );
}

export default ScatterPlotApp;
