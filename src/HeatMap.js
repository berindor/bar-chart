import './HeatMap.css';
import React from 'react';
import * as d3 from 'd3';

class HeatMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      baseTemperature: undefined,
      monthlyVariance: [],
      minVariance: undefined,
      maxVariance: undefined,
      numberOfColors: 6
    };
    this.drawPage = this.drawPage.bind(this);
    this.setColorBorders = this.setColorBorders.bind(this);
    this.setColor = this.setColor.bind(this);
  }

  async componentDidMount() {
    const dataset = await this.loadData();
    this.setState(
      {
        baseTemperature: dataset.baseTemperature,
        monthlyVariance: dataset.monthlyVariance,
        minVariance: d3.min(dataset.monthlyVariance, d => d.variance),
        maxVariance: d3.max(dataset.monthlyVariance, d => d.variance)
      },
      this.drawPage
    );
  }

  drawPage() {
    this.createSubtitle();
    this.drawChart();
    this.drawLegend();
  }

  async loadData() {
    return await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
      .then(response => response.json())
      .then(data => {
        return data;
      });
  }

  setColorBorders(numberOfColors) {
    let arr = [];
    for (let i = 0; i < numberOfColors + 1; i++) {
      arr.push(this.state.baseTemperature + this.state.minVariance + ((this.state.maxVariance - this.state.minVariance) * i) / numberOfColors);
    }
    return arr;
  }

  setColor(temperature, numberOfColors) {
    const colorBorders = this.setColorBorders(numberOfColors);
    const upperBorder = colorBorders.find(element => element > temperature);
    const colorCode = 9 - colorBorders.indexOf(upperBorder);
    const color = '#' + colorCode + colorCode + colorCode;
    return color;
  }

  createSubtitle() {
    const yearMin = this.state.monthlyVariance[0].year;
    const dataLength = this.state.monthlyVariance.length;
    const yearMax = this.state.monthlyVariance[dataLength - 1].year;
    d3.selectAll('h2').remove();
    d3.selectAll('#heat-map')
      .append('h2')
      .attr('id', 'description')
      .text(yearMin + ' - ' + yearMax + ' base temperature: ' + this.state.baseTemperature + '°C');
  }

  drawChart() {
    const yearMin = this.state.monthlyVariance[0].year;
    const dataLength = this.state.monthlyVariance.length;
    const yearMax = this.state.monthlyVariance[dataLength - 1].year;
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

  drawLegend() {
    const legendHeight = 100;
    const legendWidth = 400;
    const legendPadding = 30;
    const numberOfColors = this.state.numberOfColors;
    d3.select('#legend').remove();
    const legend = d3
      .selectAll('#heat-map')
      .append('svg')
      .attr('id', 'legend')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('background-color', 'green');

    const legendScale = d3
      .scaleLinear()
      .domain([this.state.minVariance + this.state.baseTemperature, this.state.maxVariance + this.state.baseTemperature])
      .range([legendPadding, legendWidth - legendPadding]);
    const legendAxis = d3.axisBottom(legendScale).tickValues(this.setColorBorders(numberOfColors)).tickFormat(d3.format('.2f'));

    legend
      .append('g')
      .attr('id', 'legend-axis')
      .attr('transform', 'translate( 0, ' + (legendHeight - legendPadding) + ')')
      .call(legendAxis);

    const legendData = this.setColorBorders(numberOfColors);
    legendData.pop();

    legend
      .selectAll('rect')
      .data(legendData)
      .enter()
      .append('rect')
      .attr('height', legendHeight * 0.5)
      .attr('width', (legendWidth - 2 * legendPadding) / numberOfColors)
      .attr('x', d => legendScale(d))
      .attr('y', legendHeight * 0.5 - legendPadding)
      .attr('fill', d => this.setColor(d, numberOfColors));
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
