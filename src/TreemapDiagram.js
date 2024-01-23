import './TreemapDiagram.scss';
import React from 'react';
import * as d3 from 'd3';

class TreemapDiagramPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapType: 'VideoGame',
      dataset: {},
      title: '',
      description: ''
    };
    this.loadData = this.loadData.bind(this);
    this.drawPage = this.drawPage.bind(this);
  }

  async componentDidMount() {
    const dataset = await this.loadData();
    console.log(dataset);
    //    this.drawPage;
  }

  async loadData() {
    const data = {
      Kickstarter: {
        link: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json',
        title: 'Kickstarter Pledges',
        description: 'Top 100 Most Pledged Kickstarter Campaigns Grouped By Category'
      },
      Movies: {
        link: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json',
        title: 'Movie Sales',
        description: 'Top 100 Highest Grossing Movies Grouped By Genre'
      },
      VideoGame: {
        link: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json',
        title: 'Video Game Sales',
        description: 'Top 100 Most Sold Video Games Grouped by Platform'
      }
    };
    let { link, title, description } = data[this.state.mapType];
    const dataset = await fetch(link).then(response => response.json());
    this.setState({ link, title, description, dataset });
    console.log('state:', this.state);
    return dataset;
  }

  drawPage() {
    return (
      <div className="TreemapDiagramPage">
        {this.drawHeader()}
        <div id="treemap-diagram"></div>
      </div>
    );
  }

  drawHeader() {
    return (
      <div id="header">
        <h1 id="title">{this.state.title}</h1>
        <div id="description">{this.state.description}</div>
        <div id="menu">
          Chose dataset:
          <ul>
            <li>
              <button
                onClick={() => {
                  this.setState({ mapType: 'VideoGame' });
                  this.componentDidMount();
                }}
              >
                Video Game Data Set
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  this.setState({ mapType: 'Movies' });
                  this.componentDidMount();
                }}
              >
                Movies Data Set
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  this.setState({ mapType: 'Kickstarter' });
                  this.componentDidMount();
                }}
              >
                Kickstarter Data Set
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  render() {
    return this.drawPage();
  }
}

export default TreemapDiagramPage;
