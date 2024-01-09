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
        const Newdata = Object.values(data);
        console.log(Newdata);
        return Newdata;
      });
  }

  drawChart(dataset) {
    const n = dataset.length;
    const minTime = d3.min(dataset, d => d.Seconds);
    const maxTime = d3.max(dataset, d => d.Seconds);
    const minYear = d3.min(dataset, d => d.Year);
    const maxYear = d3.max(dataset, d => d.Year);
    console.log('number of data: ' + n + ', min time: ' + minTime + ' sec, max: ' + maxTime + ' sec');
    console.log('Years: ' + minYear + ' to ' + maxYear);
    const w = 900;
    const h = 600;
    const padding = 50;
    d3.select('svg').remove();
    d3.select('.tooltip').remove();
    const xScale = d3
      .scaleLinear()
      .domain([minYear, maxYear])
      .range([padding, w - padding]);
    const xAxis = d3.axisBottom(xScale);
    const yScale = d3
      .scaleLinear()
      .domain([minTime, maxTime])
      .range([h - padding, padding]);
    const yAxis = d3.axisLeft(yScale);
    d3.select('svg').remove();
    d3.select('.tooltip').remove();
    const svg = d3.selectAll('.App').append('svg').attr('width', w).attr('height', h).style('background-color', 'green');
    var tooltip = d3.selectAll('.App').append('div').attr('id', 'tooltip').style('visibility', 'hidden');

    svg
      .selectAll('circle')
      .data(dataset)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.Year))
      .attr('cy', d => yScale(d.Seconds))
      .attr('r', 5);

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
