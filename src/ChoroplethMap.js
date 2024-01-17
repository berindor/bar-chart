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

    const arcsCoord = countyData.arcs;
    const nationObj = countyData.objects.nation;
    console.log('nationObj with arc id-s: ', nationObj);

    const arcIdToCoord = id => {
      return id > 0 ? arcsCoord[id] : [arcsCoord[-1 * id][1], arcsCoord[-1 * id][0]];
    };

    const setArcsCoord = arr => {
      let newArr = [];
      for (let i = 0; i < arr.length; i++) {
        if (typeof arr[i] === 'number') {
          newArr.push(arcIdToCoord(arr[i]));
        } else {
          newArr.push(setArcsCoord(arr[i]));
        }
      }
      return newArr;
    };

    const nationArcsCoord = nationObj.geometries[0].arcs.map(arr => setArcsCoord(arr));
    var nationCoord = { ...nationObj };
    nationCoord.geometries[0].arcs = nationArcsCoord;
    nationCoord.geometries[0].coordinates = nationArcsCoord;
    console.log('nationObj with arc coordinates', nationCoord);
    const geojsonNation = [{ type: 'Feature', properties: { name: 'USA' }, geometry: nationCoord.geometries[0] }]; //ezzel se működik a kirajzolás

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

    const projection = d3.geoEquirectangular().translate([mapWidth / 4, mapHeight / 3]);

    const geoGenerator = d3.geoPath().projection(projection);

    svgMap.append('g').selectAll('path').data(geojson.features).enter().append('path').attr('d', geoGenerator).attr('fill', 'orange');
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
