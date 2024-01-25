import './ChoroplethMap.scss';
import React from 'react';
import * as topojson from 'topojson';
import * as d3 from 'd3';

const numberOfColors = 7;

class ChoroplethMap extends React.Component {
  async componentDidMount() {
    const [educationData, countyData] = await Promise.all([this.loadEducationData(), this.loadCountyData()]);
    this.drawChart(educationData, countyData);
    const educationMaxValue = d3.max(educationData, d => d.bachelorsOrHigher);
    this.drawLegend(educationMaxValue);
  }

  async loadEducationData() {
    return await fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json').then(response =>
      response.json()
    );
  }

  async loadCountyData() {
    return await fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json').then(response => response.json());
  }

  getColorBorders(maxValue) {
    let arr = [];
    for (let i = 0; i <= numberOfColors; i++) {
      arr.push((maxValue * i) / numberOfColors);
    }
    return arr;
  }

  getColor(education, maxValue) {
    const colorBorders = this.getColorBorders(maxValue);
    const upperBorderIndex = colorBorders.findIndex(element => element > education);
    const lightness = 95 - (upperBorderIndex * (95 - 20)) / numberOfColors;
    const color = `hsl(39, 100%, ${lightness}%)`;
    return color;
  }

  drawLegend(maxValue) {
    const legendHeight = 50;
    const legendWidth = 400;
    const legendPadding = 30;
    d3.select('#legend-div').remove();
    const legendDiv = d3.selectAll('#choropleth-map').append('div').attr('id', 'legend-div');
    d3.select('#legend').remove();
    const legend = legendDiv.append('svg').attr('id', 'legend').attr('width', legendWidth).attr('height', legendHeight);

    const legendScale = d3
      .scaleLinear()
      .domain([0, maxValue])
      .range([legendPadding, legendWidth - legendPadding]);
    const legendAxis = d3
      .axisBottom(legendScale)
      .tickValues(this.getColorBorders(maxValue))
      .tickFormat(num => d3.format('.1%')(num / 100));

    legend
      .append('g')
      .attr('id', 'legend-axis')
      .attr('transform', `translate( 0, ${legendHeight - legendPadding})`)
      .call(legendAxis);

    const legendData = this.getColorBorders(maxValue);
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
      .attr('fill', d => this.getColor(d, maxValue));
  }

  drawChart(educationData, countyData) {
    const mapWidth = 1100;
    const mapHeight = 680;
    d3.select('#map-div').remove();
    const chartDiv = d3.selectAll('#choropleth-map').append('div').attr('id', 'map-div');
    d3.select('#map').remove();
    const svgMap = chartDiv.append('svg').attr('id', 'map').attr('width', mapWidth).attr('height', mapHeight).style('background-color', 'white');

    const geojsonStates = topojson.feature(countyData, countyData.objects.states);
    const geojsonCounties = topojson.feature(countyData, countyData.objects.counties);

    const geoGenerator = d3.geoPath();

    const gMap = svgMap.append('g').attr('id', 'gMap');
    gMap.attr('transform', 'translate(100, 30)');

    const educationMaxValue = d3.max(educationData, d => d.bachelorsOrHigher);

    d3.select('#tooltip').remove();
    var tooltip = d3.select('#choropleth-map').append('div').attr('id', 'tooltip').style('visibility', 'hidden');
    const handleMouseover = event => {
      const [x, y] = d3.pointer(event);
      const countyFips = event.target.getAttribute('data-fips');
      const countyObject = educationData.find(obj => obj.fips === Number(countyFips));
      const htmlText = `${countyObject.area_name} (${countyObject.state}): ${countyObject.bachelorsOrHigher}%`;
      tooltip
        .style('visibility', 'visible')
        .attr('data-fips', countyFips)
        .attr('data-education', countyObject.bachelorsOrHigher)
        .html(htmlText)
        .style('left', x + 'px')
        .style('top', y + 'px')
        .style('background-color', 'white');
    };
    const handleMouseout = function () {
      tooltip.style('visibility', 'hidden');
    };

    const statesPath = gMap.selectAll('.states').data(geojsonStates.features).enter().append('path').attr('d', geoGenerator).attr('class', 'states');
    statesPath.attr('fill-opacity', 0).attr('stroke', 'black');
    gMap
      .selectAll('.county')
      .data(geojsonCounties.features)
      .enter()
      .append('path')
      .attr('d', geoGenerator)
      .attr('class', 'county')
      .attr('data-fips', d => d.id)
      .attr('data-education', d => {
        let obj = educationData.find(obj => obj.fips === d.id);
        return obj.bachelorsOrHigher;
      })
      .attr('fill', d => {
        let obj = educationData.find(obj => obj.fips === d.id);
        return this.getColor(obj.bachelorsOrHigher, educationMaxValue);
      })
      .on('mouseover', handleMouseover)
      .on('mouseout', handleMouseout);
  }

  render() {
    return <div id="choropleth-map"></div>;
  }
}

function ChoroplethMapPage() {
  return (
    <div className="choropleth-map-page">
      <h1 id="title">United States Educational Attainment</h1>
      <div id="description">Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)</div>
      <div id="source">
        Source of data:{' '}
        <a href="https://www.ers.usda.gov/data-products/county-level-data-sets/county-level-data-sets-download-data/">
          USDA Economic Research Service
        </a>
      </div>
      <ChoroplethMap />
    </div>
  );
}

export default ChoroplethMapPage;
