import OverviewPage from './Overview';
import BarChartPage from './BarChart';
import ScatterPlotPage from './ScatterPlot';
import HeatMapPage from './HeatMap';
import ChoroplethMapPage from './ChoroplethMap';

const routes = [
  {
    path: '/',
    element: <OverviewPage />,
    name: 'Overview Page'
  },
  {
    path: '/bar-chart',
    element: <BarChartPage />,
    name: 'Bar Chart'
  },
  {
    path: '/scatter-plot',
    element: <ScatterPlotPage />,
    name: 'Scatter Plot'
  },
  {
    path: '/heat-map',
    element: <HeatMapPage />,
    name: 'Heat Map'
  },
  {
    path: '/choropleth-map',
    element: <ChoroplethMapPage />,
    name: 'Choropleth Map'
  }
];

export default routes;
