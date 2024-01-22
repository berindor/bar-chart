import './ChoroplethMap.scss';
import React from 'react';
import * as topojson from 'topojson';
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
    console.log('educationData[0]: ', educationData[0]);
    console.log('countyData: ', countyData);
    const mapWidth = 1000;
    const mapHeight = 600;
    d3.select('#map-div').remove();
    const chartDiv = d3.selectAll('#choropleth-map').append('div').attr('id', 'map-div');
    d3.select('#map').remove();
    const svgMap = chartDiv.append('svg').attr('id', 'map').attr('width', mapWidth).attr('height', mapHeight).style('background-color', 'green');

    const geojsonNation = topojson.feature(countyData, countyData.objects.nation);
    const geojsonStates = topojson.feature(countyData, countyData.objects.states);
    const geojsonCounties = topojson.feature(countyData, countyData.objects.counties);

    const geoGenerator = d3.geoPath();

    const gMap = svgMap.append('g').attr('id', 'gMap');

    const nationPath = gMap.selectAll('.nation').data(geojsonNation.features).enter().append('path').attr('d', geoGenerator).attr('class', 'nation');
    nationPath.attr('fill-opacity', '0').attr('stroke', 'red');
    const statesPath = gMap.selectAll('.states').data(geojsonStates.features).enter().append('path').attr('d', geoGenerator).attr('class', 'states');
    statesPath.attr('fill', 'orange');
    const countiesPath = gMap
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
      });
    countiesPath.attr('fill-opacity', '0');
    const minId = d3.min(geojsonCounties.features, d => d.id);
    const maxId = d3.max(geojsonCounties.features, d => d.id);
    console.log('min id: ', minId, 'max id: ', maxId, 'in geojsonCounties.features with length ', geojsonCounties.features.length);
    const minFips = d3.min(educationData, d => d.fips);
    const maxFips = d3.max(educationData, d => d.fips);
    console.log('min fips: ', minFips, 'max fips: ', maxFips, 'in educationData with length ', educationData.length);
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
      <ChoroplethMap />
    </div>
  );
}

export default ChoroplethMapPage;
