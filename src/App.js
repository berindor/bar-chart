import './App.css';
import React from 'react';
import * as d3 from 'd3';

class BarChart extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.drawChart();
    this.loadData();
  }

  loadData() {
    document.addEventListener('DOMContentLoaded', function () {
      fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
        .then(response => response.json())
        .then(data => {
          const GDPdata = Object.values(data.data);
          console.log(GDPdata);
        });
    });
  }

  drawChart() {
    const svg = d3.select('body').append('svg').attr('width', 200).attr('height', 100).style('background-color', 'red');
  }

  render() {
    return <div></div>;
  }
}

function App() {
  <script>
    document.addEventListener('DOMContentLoaded', function()
    {fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
      .then(response => response.json())
      .then(data => {
        const GDPdata = Object.values(data.data);
      })}
    ); const svg = d3.select('body').append('svg').attr('width', 200).attr('height', 100).style('background-color', 'red');
  </script>;
  return (
    <div className="App">
      <h1 id="title">United States GDP</h1>
      <BarChart />
    </div>
  );
}

export default App;
