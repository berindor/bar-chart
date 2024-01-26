import './BarChart.scss';
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
    const numberOfBars = dataset.length;
    const maxGDP = d3.max(dataset, d => d[1]);
    const width = 900;
    const height = 600;
    const padding = 50;
    const xScale = d3
      .scaleUtc()
      .domain([new Date(dataset[0][0]), new Date(dataset[numberOfBars - 1][0])])
      .range([padding, width - padding]);
    const xAxis = d3.axisBottom(xScale).ticks(20);
    const yScale = d3
      .scaleLinear()
      .domain([0, maxGDP])
      .range([height - padding, padding]);
    const yAxis = d3.axisLeft(yScale).ticks(15);

    d3.select('#chart-wrapper').remove();
    d3.select('#bar-chart').append('div').attr('id', 'chart-wrapper').style('width', width).style('height', height);
    const svg = d3.selectAll('#chart-wrapper').append('svg').attr('width', width).attr('height', height).style('background-color', 'green');
    var tooltip = d3.selectAll('#chart-wrapper').append('div').attr('id', 'tooltip').style('visibility', 'hidden');

    const handleMouseover = function (event) {
      const date = event.target.getAttribute('data-date');
      const gdp = event.target.getAttribute('data-gdp');
      tooltip
        .style('visibility', 'visible')
        .attr('data-date', date)
        .attr('data-gdp', gdp)
        .html('date: ' + date + '<br> GDP: ' + gdp)
        .style('left', xScale(new Date(date)) + -padding + 'px')
        .style('top', yScale(gdp) - padding / 2 + 'px');
    };
    const handleMouseout = function () {
      tooltip.style('visibility', 'hidden').attr('data-date', undefined).attr('data-gdp', undefined);
    };
    svg
      .selectAll('rect')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('x', (d, i) => xScale(new Date(d[0])))
      .attr('y', d => yScale(d[1]))
      .attr('width', (width - 2 * padding) / numberOfBars)
      .attr('height', d => height - padding - yScale(d[1]))
      .attr('class', 'bar')
      .attr('data-date', d => d[0])
      .attr('data-gdp', d => d[1])
      .attr('fill', 'orange')
      .on('mouseover', handleMouseover)
      .on('mouseout', handleMouseout);
    svg
      .append('g')
      .attr('id', 'y-axis')
      .attr('transform', 'translate(' + padding + ', 0)')
      .call(yAxis);
    svg
      .append('g')
      .attr('id', 'x-axis')
      .attr('transform', 'translate( 0, ' + (height - padding) + ')')
      .call(xAxis);
  }

  render() {
    return <div id="bar-chart"></div>;
  }
}

function BarChartPage() {
  return (
    <div className="BarChartPage">
      <h1 id="title">United States GDP</h1>
      <BarChart />
    </div>
  );
}

export default BarChartPage;
