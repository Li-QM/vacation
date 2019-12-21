import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';

class RateItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: null,
      data: null,
      opened: false
    };
    this.handleEdit = this.handleEdit.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }
  handleEdit(id) {
    this.props.parentHandleEdit(this.props.type, this.props.index, id);
  }
  handleRemove(id) {
    this.props.parentHandleRemove(this.props.type, this.props.index, id);
  }
  handleSubMenu(event) {
    this.setState({
      opened : !this.state.opened
    })
  }
  componentDidMount() {
    this.setState({
      type: this.props.type,
      data: this.props.data
    });
  }
  render() {
    const name_field = this.props.namefield;
    const propertyid = this.props.propertyid;
    const propertyname = this.props.propertyname;
    let seasonal = "";
    let dollarsign = "";
    if (propertyid === "price") {
      dollarsign = "$";
    }

    if (
      this.props.data["seasonal_name"] === "" ||
      this.props.data["seasonal_name"] === null ||
      this.props.data["seasonal_name"] === undefined
    ) {
      seasonal =
        this.props.data["start_date"] + " ~ " + this.props.data["end_date"];
    } else {
      seasonal = this.props.data["seasonal_name"];
    }
    return (
      <div className="rate-item">
        <div className="collapse-link">
          <Link
            className="btn"
            data-toggle="collapse"
            // href={`#example${this.props.data["id"]}`}
            to="#"
            role="button"
            aria-expanded="false"
            aria-controls={this.props.data["id"]}
            onClick={event => this.handleSubMenu(event)}
          >
            {seasonal}
          </Link>
        </div>
        <div id={`example${this.props.data["id"]}`} className={this.state.opened ? "collapse show" : "collapse"}>
          <div className="col-sm-12">
            <p className="item-title col-lg-6 col-sm-6"> {name_field}</p>
            <p className="item-content col-lg-6 col-sm-6">
              {" "}
              {this.props.data["seasonal_name"]}
            </p>
          </div>
          <div className="col-lg-12">
            <p className="item-title col-lg-6 col-sm-6"> Start Date</p>
            <p className="item-content col-lg-6 col-sm-6">
              {" "}
              {this.props.data["start_date"]}
            </p>
          </div>
          <div className="col-lg-12">
            <p className="item-title col-lg-6 col-sm-6"> End Date</p>
            <p className="item-content col-lg-6 col-sm-6">
              {" "}
              {this.props.data["end_date"]}
            </p>
          </div>
          <div className="col-lg-12">
            <p className="item-title col-lg-6 col-sm-6"> {propertyname}</p>
            <p className="item-content col-lg-6 col-sm-6">
              {" "}
              {dollarsign}
              {this.props.data[propertyid]}
            </p>
          </div>
          <div className="col-lg-12 d-flex" style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            <button
              className="btn btn-warning"
              onClick={() => this.handleEdit(this.props.data["id"])}
            >
              <FontAwesomeIcon className="edit-mark" icon={faEdit} />
              <span>Edit</span>
            </button>
            <button
              className="btn btn-danger"
              onClick={() => this.handleRemove(this.props.data["id"])}
            >
              <FontAwesomeIcon className="remove-mark" icon={faTimes} />
              <span>Remove</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

class RatePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: props.data, display_id: 0 };
  }
  componentDidMount() {}

  handlePrev() {
    if (this.state.display_id > 0)
      this.setState(state => ({
        display_id: this.state.display_id - 1
      }));
  }

  handleNext() {
    if (this.state.display_id < this.state.data.length)
      this.setState(state => ({
        display_id: this.state.display_id + 1
      }));
  }
  onParentHandleRemove(type, index, id) {
    this.props.handleRemove(type, index, id);
  }

  onParentHandleEdit(type, index, id) {
    this.props.handleEdit(type, index, id);
  }
  render() {
    const name_field = this.props.namefield;
    const propertyid = this.props.propertyid;
    const propertyname = this.props.propertyname;

    if (!this.props.data) return <div> Empty list </div>;
    return this.props.data.map((record, index) => (
      <RateItem
        data={record}
        type={this.props.type}
        parentHandleRemove={this.onParentHandleRemove.bind(this)}
        parentHandleEdit={this.onParentHandleEdit.bind(this)}
        index={index}
        key={record.id + record.room_id}
        namefield={name_field}
        propertyid={propertyid}
        propertyname={propertyname}
      />
    ));
  }
}

export default RatePanel;
