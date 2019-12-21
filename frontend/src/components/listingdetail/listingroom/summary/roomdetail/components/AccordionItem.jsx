import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

const title_active = {
  transform: `rotate(270deg)`
}

const title_inactive = {
  transform: `rotate(90deg)`
}

class AccordionItem extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      active: false
    };
    this.toggle = this.toggle.bind(this);
  }
  toggle() {
    this.setState({
      active: !this.state.active,
      className: "active"
    });
  }
  render() {
    const activeClass = this.state.active ? "active" : "inactive";
    const activeTitle = this.state.active ? title_active : title_inactive;
    const question = this.props.details;
    return (
      <div className={"row w-100"}>
        <div className="col-md-12 lang-chang-label col-sm-12 amenities_title">
          <Link to="#" onClick={this.toggle}>
            {question.title}
            <FontAwesomeIcon className="fa-angle-up" icon={faAngleRight} style={activeTitle} />
          </Link>
        </div>
        <div className={"col-md-12 col-sm-12 amenities_info " + activeClass}>
          {question.content}
        </div>
      </div>
    );
  }
}
export default AccordionItem;
