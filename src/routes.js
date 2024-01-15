import OverviewPage from './Overview';
import BarChartPage from './BarChart';
import ScatterPlotPage from './ScatterPlot';

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
  }
];

export default routes;
