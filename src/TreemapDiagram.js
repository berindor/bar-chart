import './TreemapDiagram.scss';
import React from 'react';
import * as d3 from 'd3';

class TreemapDiagramPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapType: 'VideoGame'
    };
    this.loadData = this.loadData.bind(this);
    this.drawPage = this.drawPage.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount() {
    const { title, description, dataset } = await this.loadData();
    this.drawPage(title, description, dataset);
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
    return { title, description, dataset };
  }

  async handleClick(mapType) {
    this.setState({ mapType });
    const { title, description, dataset } = await this.loadData();
    this.drawPage(title, description, dataset);
  }

  drawPage(title, description, dataset) {
    this.drawHeader(title, description);
    this.drawTreemap(dataset);
  }

  drawNavBar() {
    return (
      <div id="nav-bar">
        Chose dataset:
        <ul>
          <li>
            <button onClick={() => this.handleClick('VideoGame')}>Video Game Data Set</button>
          </li>
          <li>
            <button onClick={() => this.handleClick('Movies')}>Movies Data Set</button>
          </li>
          <li>
            <button onClick={() => this.handleClick('Kickstarter')}>Kickstarter Data Set</button>
          </li>
        </ul>
      </div>
    );
  }

  drawHeader(title, description) {
    d3.selectAll('#header').remove();
    d3.select('.TreemapDiagramPage').append('div').attr('id', 'header');
    d3.select('#header').append('h1').text(title).attr('id', 'title');
    d3.select('#header').append('div').text(description).attr('id', 'description');
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

  createCategoryColors(categoryList) {
    //for at most 24 colors
    let categoryColors = [];
    function createColor(number) {
      if (number < 12) {
        return 'hsl(' + 30 * number + ', 100%, 50%)';
      } else {
        return 'hsl(' + (30 * number - 360) + ', 100%, 70%)';
      }
    }
    for (let n = 0; n < categoryList.length; n++) {
      categoryColors.push([createColor(n), categoryList[n]]);
    }
    return categoryColors;
  }

  findCategoryColor(categoryList, category) {
    const categoryColors = this.createCategoryColors(categoryList);
    const subarr = categoryColors.find(subarr => subarr[1] === category); //nem sikerült destrukturálva, valami nem működött
    return subarr[0];
  }

  drawTreemap(dataset) {
    console.log(dataset);
    const treemapWidth = 700;
    const treemapHeight = 500;

    d3.select('#treemap-div').remove();
    d3.select('.TreemapDiagramPage').append('div').attr('id', 'treemap-div');
    const svgTreemap = d3.select('#treemap-div').append('svg').attr('id', 'treemap').attr('width', treemapWidth).attr('height', treemapHeight);

    const root = d3.hierarchy(dataset).sum(d => d.value);
    root.sort((a, b) => b.value - a.value);
    d3.treemap().size([treemapWidth, treemapHeight]).padding(2)(root);
    console.log('root: ', root);
    const categoryList = root.children.map(node => node.data.name);
    console.log('categoryList: ', categoryList);

    const treemapTiles = svgTreemap
      .selectAll('g')
      .data(root.leaves())
      .enter()
      .append('g')
      .attr('transform', d => 'translate(' + d.x0 + ', ' + d.y0 + ')')
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0);

    treemapTiles
      .append('rect')
      .attr('class', 'tile')
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .attr('data-name', d => d.data.name)
      .attr('data-category', d => d.data.category)
      .attr('data-value', d => d.data.value)
      .attr('data-x0', d => d.x0)
      .attr('data-y0', d => d.y0)
      .style('fill', d => this.findCategoryColor(categoryList, d.data.category));
    treemapTiles
      .append('text')
      .text(d => d.data.name)
      .style('font-size', '11px')
      .attr('transform', 'translate(5, 15)');

    var tooltip = d3.select('#treemap-div').append('div').attr('id', 'tooltip').style('visibility', 'hidden');
    const handleMouseover = function (event) {
      const value = event.target.getAttribute('data-value');
      const category = event.target.getAttribute('data-category');
      const name = event.target.getAttribute('data-name');
      const htmlText = name + ' <br> Category: ' + category + ' <br> Value: ' + value;
      tooltip
        .style('visibility', 'visible')
        .attr('data-value', value)
        .attr('data-category', category)
        .attr('data-name', name)
        .html(htmlText)
        .style('left', event.target.getAttribute('data-x0') - 5 + 'px')
        .style('top', event.target.getAttribute('data-y0') - 5 + 'px');
    };
    const handleMouseout = function () {
      tooltip.style('visibility', 'hidden');
    };

    treemapTiles.on('mouseover', handleMouseover).on('mouseout', handleMouseout);

    this.drawLegend(categoryList);
  }

  drawLegend(categoryList) {
    const legendWidth = 500;
    const legendHeight = 400;
    const itemSize = 30;
    d3.selectAll('#legend').remove();
    d3.select('.TreemapDiagramPage').append('svg').attr('id', 'legend').attr('width', legendWidth).attr('height', legendHeight);
    //const categoryColors = this.createCategoryColors(dataset.children);
    function findLegendPlace(itemIndex) {
      const x = ((itemIndex % 3) * legendWidth) / 3;
      const y = (((itemIndex - (itemIndex % 3)) / 3) * legendHeight) / 6;
      return [x, y];
    }
    const legendItems = d3
      .select('#legend')
      .selectAll('g')
      .data(categoryList)
      .enter()
      .append('g')
      .attr('transform', (d, i) => 'translate(' + findLegendPlace(i)[0] + ', ' + findLegendPlace(i)[1] + ')');
    legendItems
      .append('rect')
      .attr('class', 'legend-item')
      .attr('width', itemSize)
      .attr('height', itemSize)
      .attr('fill', d => this.findCategoryColor(categoryList, d));
    legendItems
      .append('text')
      .text(d => d)
      .attr('transform', 'translate(' + Number(itemSize + 5) + ', ' + Number(itemSize / 2 + 5) + ')');
  }

  render() {
    return <div className="TreemapDiagramPage">{this.drawNavBar()}</div>;
  }
}

export default TreemapDiagramPage;
