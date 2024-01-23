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
    await this.loadData();
    this.drawPage();
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
  }

  drawPage() {
    this.drawHeader();
    this.drawTreemap(this.state.dataset);
  }

  drawNavBar() {
    return (
      <div id="nav-bar">
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
    );
  }

  drawHeader() {
    d3.selectAll('#header').remove();
    d3.select('.TreemapDiagramPage').append('div').attr('id', 'header');
    d3.select('#header').append('h1').text(this.state.title);
    d3.select('#header').append('div').text(this.state.description).attr('id', 'description');
    // Ez itt lent a navbar próbálkozás. Nem sikerült a handleClick függvényt működővé varázsolni. A drawNavBar függvény működik.
    /*
    d3.select('#header').append('div').html('Chose dataset: ').attr('id', 'nav-bar');
    d3.select('#nav-bar').append('ul');
    const navBarList = [
      ['Video Game Data Set', 'VideoGame'],
      ['Movies Data Set', 'Movies'],
      ['Kickstarter Data Set', 'Kickstarter']
    ];
    function handleClick(mapType) {
      return function () {
        this.setState({ mapType });
        this.componentDidMount();
      };
    }
    d3.select('ul')
      .selectAll('li')
      .data(navBarList)
      .enter()
      .append('li')
      .append('button')
      .html(d => d[0])
      .attr('onClick', d => handleClick(d[1]));
      */
  }

  drawTreemap(dataset) {
    console.log(dataset);
  }

  drawLegend(dataset) {
    console.log(dataset);
  }

  render() {
    return <div className="TreemapDiagramPage">{this.drawNavBar()}</div>;
  }
}

export default TreemapDiagramPage;
