import React from 'react';
import { Link } from 'react-router-dom';
import routes from './routes';
import './Overview.scss';

class Overview extends React.Component {
  createLinkList(list) {
    const reducedList = list.slice(1);
    const linkList = reducedList.map(({ path, name }) => {
      return (
        <li key={path.slice(1)}>
          <Link to={path.slice(1)}>{name}</Link>
        </li>
      );
    });
    return linkList;
  }

  render() {
    return (
      <div id="content-list">
        <ul>{this.createLinkList(routes)}</ul>
      </div>
    );
  }
}

function OverviewPage() {
  return (
    <div className="OverviewPage">
      <h1 id="title">freeCodeCamp D3 projects</h1>
      <h2>by berindor</h2>
      <Overview />
    </div>
  );
}

export default OverviewPage;
