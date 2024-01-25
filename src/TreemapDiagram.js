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
        <span>Choose dataset: </span>
        <div id="button-wrapper">
          <button onClick={() => this.handleClick('VideoGame')}>Video Game Data Set</button>
          <button onClick={() => this.handleClick('Movies')}>Movies Data Set</button>
          <button onClick={() => this.handleClick('Kickstarter')}>Kickstarter Data Set</button>
        </div>
      </div>
    );
  }

  drawHeader(title, description) {
    d3.selectAll('#header').remove();
    d3.select('.TreemapDiagramPage').append('div').attr('id', 'header');
    d3.select('#header').append('h1').text(title).attr('id', 'title');
    d3.select('#header').append('div').text(description).attr('id', 'description');
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
    const treemapWidth = 1000;
    const treemapHeight = 500;

    d3.select('#treemap-div').remove();
    d3.select('.TreemapDiagramPage').append('div').attr('id', 'treemap-div');

    const root = d3.hierarchy(dataset).sum(d => d.value);
    root.sort((a, b) => b.value - a.value);
    d3.treemap().size([treemapWidth, treemapHeight]).padding(2)(root);
    const categoryList = root.children.map(node => node.data.name);

    const svgTreemap = d3.select('#treemap-div').append('svg').attr('id', 'treemap').attr('width', treemapWidth).attr('height', treemapHeight);
    const treemapTiles = svgTreemap
      .selectAll('rect')
      .data(root.leaves())
      .enter()
      .append('rect')
      .attr('class', 'tile')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .attr('data-name', d => d.data.name)
      .attr('data-category', d => d.data.category)
      .attr('data-value', d => d.data.value)
      .style('fill', d => this.findCategoryColor(categoryList, d.data.category));

    d3.select('#treemap-div').append('div').attr('id', 'tile-div-wrapper');
    const tileDivs = d3
      .select('#tile-div-wrapper')
      .selectAll('div')
      .data(root.leaves())
      .enter()
      .append('div')
      .attr('class', 'tile-div')
      .style('left', d => d.x0 + 'px')
      .style('top', d => d.y0 + 'px')
      .style('width', d => d.x1 - d.x0 + 'px')
      .style('height', d => d.y1 - d.y0 + 'px')
      .attr('data-name', d => d.data.name)
      .attr('data-category', d => d.data.category)
      .attr('data-value', d => d.data.value)
      .attr('x0', d => d.x0)
      .attr('y0', d => d.y0)
      .html(d => d.data.name);

    var tooltip = d3.select('#treemap-div').append('div').attr('id', 'tooltip').style('visibility', 'hidden');
    const handleMouseover = function (event) {
      const value = event.target.getAttribute('data-value');
      const category = event.target.getAttribute('data-category');
      const name = event.target.getAttribute('data-name');
      const htmlText = name + ' <br> Category: ' + category + ' <br> Value: ' + value;
      const x0 = event.target.getAttribute('x0');
      const y0 = event.target.getAttribute('y0');
      var leftPosition = Number(event.offsetX + 5);
      var topPosition = Number(event.offsetY - 65);
      if (event.target.className === 'tile-div') {
        leftPosition += Number(x0);
        topPosition += Number(y0);
      }
      tooltip
        .style('visibility', 'visible')
        .attr('data-value', value)
        .attr('data-category', category)
        .attr('data-name', name)
        .html(htmlText)
        .style('left', leftPosition + 'px')
        .style('top', topPosition + 'px');
    };
    const handleMouseout = function () {
      tooltip.style('visibility', 'hidden');
    };

    treemapTiles.on('mousemove', handleMouseover).on('mouseout', handleMouseout);
    tileDivs.on('mousemove', handleMouseover).on('mouseout', handleMouseout);

    this.drawLegend(categoryList);
  }

  drawLegend(categoryList) {
    const itemSize = 30;
    const legendWidth = 800;
    const legendHeight = Math.ceil(categoryList.length / 3) * itemSize * 1.3 + 40;
    d3.selectAll('#legend').remove();
    const legendSvg = d3.select('.TreemapDiagramPage').append('svg').attr('id', 'legend').attr('width', legendWidth).attr('height', legendHeight);
    legendSvg.append('text').text('Categories: ').attr('transform', 'translate(5 , 25)').style('font-size', '20px');
    function findLegendPlace(itemIndex) {
      const x = ((itemIndex % 3) * legendWidth) / 3;
      const y = 35 + ((itemIndex - (itemIndex % 3)) / 3) * itemSize * 1.3;
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
