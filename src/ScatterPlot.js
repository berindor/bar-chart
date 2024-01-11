import './ScatterPlot.css';
import React from 'react';
import * as d3 from 'd3';
import { utcFormat } from 'd3';

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
    const minYear = d3.min(dataset, d => d.Year);
    const maxYear = d3.max(dataset, d => d.Year);
    console.log('number of data: ' + n + ', min time: ' + minTime + ' sec, max: ' + maxTime + ' sec');
    console.log(minTime.toLocaleString(undefined, { minute: 'numeric', second: 'numeric' }));
    console.log('Years: ' + minYear + ' to ' + maxYear);
    const w = 900;
    const h = 800;
    const padding = 50;
    d3.select('svg').remove();
    d3.select('.tooltip').remove();
    d3.select('.legend').remove();
    const xScale = d3
      .scaleLinear()
      .domain([minYear - 0.5, maxYear + 0.5])
      .range([padding, w - padding]);
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format(''));
    const yScale = d3
      .scaleTime()
      .domain([minTime, maxTime])
      .range([h - padding, padding]);
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.utcFormat('%M:%S'));
    const svg = d3.selectAll('.App').append('svg').attr('width', w).attr('height', h).style('background-color', 'green');
    var tooltip = d3.selectAll('.App').append('div').attr('id', 'tooltip').style('visibility', 'hidden');
    const mouseover = function (event) {
      const year = event.target.getAttribute('data-xvalue');
      const time = event.target.getAttribute('data-time');
      const timeInDate = event.target.getAttribute('data-yvalue');
      const name = event.target.getAttribute('data-name');
      const nationality = event.target.getAttribute('data-nationality');
      const doping = event.target.getAttribute('data-doping');
      console.log(event.target);
      tooltip
        .style('visibility', 'visible')
        .attr('data-year', year)
        .attr('data-time', time)
        .attr('data-name', name)
        .attr('data-nationality', nationality)
        .attr('data-doping', doping)
        .html(name + ', ' + nationality + '<br> year: ' + year + ', time: ' + time + '<br> Doping: ' + doping)
        .style('left', event.target.getAttribute('cx') - w / 2 + 'px')
        .style('top', event.target.getAttribute('cy') - padding - h - 25 + 'px')
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
      .attr('transform', 'translate(' + padding + ', 0)')
      .call(yAxis);
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
