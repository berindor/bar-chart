import './ChoroplethMap.scss';
import React from 'react';
import * as topojson from 'topojson';
import * as d3 from 'd3';
import * as turf from '@turf/turf';
import { geojsonType } from '@turf/turf';

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
    //    console.log(educationData[0]);
    console.log(countyData);
    d3.select('#map-div').remove();
    const mapWidth = 700;
    const mapHeight = 500;
    const chartDiv = d3.selectAll('#choropleth-map').append('div').attr('id', 'map-div');
    d3.select('#map').remove();
    const svgMap = chartDiv.append('svg').attr('id', 'map').attr('width', mapWidth).attr('height', mapHeight).style('background-color', 'green');

    const geojsonNation = topojson.feature(countyData, countyData.objects.nation);
    console.log('topojson to geojson: ', geojsonNation);

    const geojson = {
      //nem kell, csak próba
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            name: 'Africa'
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-6, 36],
                [33, 30],
                [43, 11],
                [51, 12],
                [29, -33],
                [18, -35],
                [7, 5],
                [-17, 14],
                [-6, 36]
              ]
            ]
          }
        },
        {
          type: 'Feature',
          properties: {
            name: 'Australia'
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [143, -11],
                [153, -28],
                [144, -38],
                [131, -31],
                [116, -35],
                [114, -22],
                [136, -12],
                [140, -17],
                [143, -11]
              ]
            ]
          }
        },
        {
          type: 'Feature',
          properties: {
            name: 'Timbuktu'
          },
          geometry: {
            type: 'Point',
            coordinates: [-3.0026, 16.7666]
          }
        }
      ]
    };

    const projection = d3.geoEquirectangular(); //nem kell
    projection.fitExtent(
      //nem kell
      [
        [0, 0],
        [mapWidth, mapHeight]
      ],
      geojsonNation
    );

    const geoGenerator = d3.geoPath().projection(null);

    svgMap.append('g').selectAll('path').data(geojsonNation.features).enter().append('path').attr('d', geoGenerator);
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
