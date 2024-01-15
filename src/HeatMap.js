import './HeatMap.css';
import React from 'react';
import * as d3 from 'd3';

class HeatMap extends React.Component {
  async componentDidMount() {
    const dataset = await this.loadData();
    this.createSubtitle(dataset);
    this.drawChart(dataset);
    this.drawLegend(dataset);
  }

  async loadData() {
    return await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        return data;
      });
  }

  createSubtitle(dataset) {
    const baseTemperature = dataset.baseTemperature;
    const yearMin = dataset.monthlyVariance[0].year;
    const dataLength = dataset.monthlyVariance.length;
    const yearMax = dataset.monthlyVariance[dataLength - 1].year;
    d3.selectAll('h2').remove();
    d3.selectAll('#heat-map')
      .append('h2')
      .attr('id', 'description')
      .text(yearMin + ' - ' + yearMax + ' base temperature: ' + baseTemperature + '°C');
  }

  drawChart(dataset) {
    const baseTemperature = dataset.baseTemperature;
    const monthlyVariance = dataset.monthlyVariance;
    const yearMin = dataset.monthlyVariance[0].year;
    const dataLength = dataset.monthlyVariance.length;
    const yearMax = dataset.monthlyVariance[dataLength - 1].year;
    const numberOfYears = yearMax - yearMin + 1;
    const padding = 30;
    const height = 500;
    const width = 1000;
    const xScale = d3
      .scaleLinear()
      .domain([yearMin - 0.5, yearMax + 0.5])
      .range([2.5 * padding, width - padding]);
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format(''));
    const formatMonth = monthNumber => d3.timeFormat('%B')(d3.timeParse('%m')(monthNumber + 1));
    const yScale = d3
      .scaleLinear()
      .domain([-0.5, 11.5])
      .range([padding, height - padding]);
    const yAxis = d3.axisLeft(yScale).tickFormat(formatMonth);

    d3.select('#chart').remove();
    const svg = d3
      .selectAll('#heat-map')
      .append('svg')
      .attr('id', 'chart')
      .attr('width', width)
      .attr('height', height)
      .style('background-color', 'green');

    svg
      .append('g')
      .attr('id', 'x-axis')
      .attr('transform', 'translate( 0, ' + (height - padding) + ')')
      .call(xAxis);
    svg
      .append('g')
      .attr('id', 'y-axis')
      .attr('transform', 'translate(' + 2.5 * padding + ', 0)')
      .call(yAxis);
  }

  drawLegend(dataset) {
    const baseTemperature = dataset.baseTemperature;
    const monthlyVariance = dataset.monthlyVariance;
    const minVariance = d3.min(monthlyVariance, d => d.variance);
    const maxVariance = d3.max(monthlyVariance, d => d.variance);
    const legendHeight = 100;
    const legendWidth = 400;
    const legendPadding = 20;
    d3.select('#legend').remove();
    const legend = d3
      .selectAll('#heat-map')
      .append('svg')
      .attr('id', 'legend')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('background-color', 'green');

    const xScale = d3
      .scaleLinear()
      .domain([minVariance + baseTemperature, maxVariance + baseTemperature])
      .range([legendPadding, legendWidth - legendPadding]);
    const xAxis = d3.axisBottom(xScale).ticks(10);

    legend
      .append('g')
      .attr('id', 'x-axis')
      .attr('transform', 'translate( 0, ' + (legendHeight - legendPadding) + ')')
      .call(xAxis);
  }

  render() {
    return <div id="heat-map"></div>;
  }
}

function HeatMapPage() {
  return (
    <div className="HeatMapPage">
      <h1 id="title">Monthly Global Land-Surface Temperature</h1>
      <HeatMap />
    </div>
  );
}

export default HeatMapPage;
