import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

class Navs extends Component {
  state = { active: '' }

  componentDidMount() {
    const { location: { pathname } } = this.props;
    this.setState({ active: pathname.slice(1) });
  }
  
  onClick = (tab) => {
    this.setState({ active: tab });
  }

  render() {
    const links = [['featured', 'Featured'], ['topgames', 'Top Games']];
    const list = links.map(item => {
      const { active } = this.state;
      const activeTab = active === item[0] ? 'text-white' : '';
      return (
        <li className="nav-item" key={item[0]}>
          <Link
            className={`nav-link my-2 my-sm-0 ${activeTab}`}
            to={`/${item[0]}`}
            onClick={() => this.onClick(item[0])}
          >
            {item[1]}
          </Link>
        </li>
      );
    });
    return (
      <ul className="navbar-nav mr-sm-4" role="tablist">
        {list}
      </ul>
    );
  }
}

export default withRouter(Navs);
