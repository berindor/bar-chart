import './App.css';
import React from 'react';
import * as d3 from 'd3';

class BarChart extends React.Component {
  constructor(props) {
    super(props);
  }

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
    const w = 900;
    const h = 600;
    const padding = 30;
    const yScale = d3
      .scaleLinear()
      .domain([0, maxGDP])
      .range([0, h - 2 * padding]);
    d3.select('svg').remove();
    const svg = d3.selectAll('.App').append('svg').attr('width', w).attr('height', h).style('background-color', 'green');
    svg
      .selectAll('rect')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('x', (d, i) => padding + ((w - 2 * padding) / n) * i)
      .attr('y', d => h - padding - yScale(d[1]))
      .attr('width', (w - 2 * padding) / n)
      .attr('height', d => yScale(d[1]))
      .attr('fill', 'orange');
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
