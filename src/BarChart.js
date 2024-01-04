import './App.css';
import React from 'react';
import * as d3 from 'd3';

class BarChart extends React.Component {
  async componentDidMount() {
    const dataset = await this.loadData();
    this.drawChart(dataset);
  }

  async loadData() {
    return await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
      .then(response => response.json())
      .then(data => {
        const GDPdata = Object.values(data.data);
        return GDPdata;
      });
  }

  drawChart(dataset) {
    const n = dataset.length;
    const minGDP = d3.min(dataset, d => d[1]);
    const maxGDP = d3.max(dataset, d => d[1]);
    console.log('number of data: ' + n + ', min: ' + minGDP + ', max: ' + maxGDP);
    console.log('first two dates: ' + dataset[0][0] + ', ' + dataset[1][0]);
    console.log('last date: ' + dataset[n - 1][0]);
    const w = 900;
    const h = 600;
    const padding = 50;
    const xScale = d3
      .scaleUtc()
      .domain([new Date(dataset[0][0]), new Date(dataset[n - 1][0])])
      .range([padding, w - padding]);
    const xAxis = d3.axisBottom(xScale).ticks(20);
    const yScale = d3
      .scaleLinear()
      .domain([0, maxGDP])
      .range([h - padding, padding]);
    const yAxis = d3.axisLeft(yScale).ticks(15);
    d3.select('svg').remove();
    const svg = d3.selectAll('.App').append('svg').attr('width', w).attr('height', h).style('background-color', 'green');
    svg
      .selectAll('rect')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('x', (d, i) => xScale(new Date(d[0])))
      .attr('y', d => yScale(d[1]))
      .attr('width', (w - 2 * padding) / n)
      .attr('height', d => h - padding - yScale(d[1]))
      .attr('class', 'bar')
      .attr('data-date', d => d[0])
      .attr('data-gdp', d => d[1])
      .attr('fill', 'orange');
    svg
      .append('g')
      .attr('id', 'y-axis')
      .attr('transform', 'translate(' + padding + ', 0)')
      .call(yAxis);
    svg
      .append('g')
      .attr('id', 'x-axis')
      .attr('transform', 'translate( 0, ' + (h - padding) + ')')
      .call(xAxis);
  }

  render() {
    return <div></div>;
  }
}

function BarChartApp() {
  return (
    <div className="App">
      <h1 id="title">United States GDP</h1>
      <BarChart />
    </div>
  );
}

export default BarChartApp;
