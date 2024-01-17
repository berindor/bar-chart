import './ChoroplethMap.scss';
import React from 'react';
import * as d3 from 'd3';

class ChoroplethMap extends React.Component {
  async componentDidMount() {
    const educationData = await this.loadEducationData();
    const countyData = await this.loadCountyData();
    this.drawChart(educationData, countyData);
  }

  async loadEducationData() {
    return await fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json').then(response =>
      response.json()
    );
  }

  async loadCountyData() {
    return await fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json').then(response => response.json());
  }

  drawChart(educationData, countyData) {
    console.log(educationData[0]);
    console.log(countyData);
    d3.select('#map-div').remove();
    const mapWidth = 700;
    const mapHeight = 500;
    const chartDiv = d3.selectAll('#choropleth-map').append('div').attr('id', 'map-div');
    d3.select('#map').remove();
    const svgMap = chartDiv.append('svg').attr('id', 'map').attr('width', mapWidth).attr('height', mapHeight).style('background-color', 'green');

    const projection = d3
      .geoMercator()
      .scale([180])
      .translate([mapWidth / 3, mapHeight / 3]);

    const geoGenerator = d3.geoPath(projection);

    svgMap.append('g').selectAll('path').data(countyData).enter().append('path').attr('d', geoGenerator).attr('fill', 'orange');
  }

  render() {
    return <div id="choropleth-map"></div>;
  }
}

function ChoroplethMapPage() {
  return (
    <div className="choropleth-map-page">
      <h1 id="title">United States Educational Attainment</h1>
      <ChoroplethMap />
    </div>
  );
}

export default ChoroplethMapPage;
