import React from "react";
import { Link } from 'react-router-dom';
import EditFormModal from "react-responsive-modal";
import {roomsService} from "services/rooms";
import {alertService} from "services/alert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

class Additionalcharge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible_modal: false,
      is_edit: false,
      additional_data: [],
      temp_data: {
        calc_type: "0",
        guest_opt: "0",
        label: "",
        price: "",
        taxable: "No",
        price_type: "0"
      }
    };
    this.openEditModal = this.openEditModal.bind(this);
    this.closeEditModal = this.closeEditModal.bind(this);
    this.handleChangeTemp = this.handleChangeTemp.bind(this);
    this.handleAddData = this.handleAddData.bind(this);
    this.handleChangeAdditionalData = this.handleChangeAdditionalData.bind(this);
    this.handleRemoveAdditional = this.handleRemoveAdditional.bind(this);
  }

  componentDidMount() {
    roomsService.getAdditionalCharges(this.props.room_id).then(res => {
      if (res) {
        this.setState({additional_data: res});
      }
    });
  }
  componentDidUpdate() {}
  closeEditModal() {
    this.setState({
      visible_modal: false
    });
  }
  openEditModal() {
    this.setState({
      visible_modal: true
    });
  }
  handleChangeTemp(e) {
    let name = e.target.name;
    let value = e.target.value;
    let temp_data = this.state.temp_data;

    if (name === "taxable1") {
      temp_data["taxable"] = value;
    } else {
      temp_data[name] = value;
    }

    this.setState({
      temp_data: temp_data
    });
  }
  handleAddData() {
    let { temp_data, additional_data } = this.state;
    // price_type price_type
    additional_data.push(temp_data);
    temp_data = {
      calc_type: "0",
      guest_opt: "0",
      label: "",
      price: "",
      price_type: "0"
    };
    this.setState({
      temp_data: temp_data,
      additional_data: additional_data
    });

    roomsService.updateAdditionalPrice({id: this.props.room_id, additional_charges: this.state.additional_data}).then(res => {
      if (res && res.success === "true") {
        alertService.showSuccess("Success",'');
      } else {
        alertService.showError("Faild",'');
      }
      this.setState({visible_modal: false});
    });
  }

  handleChangeAdditionalData(e, index) {
    let name = e.target.name;
    let value = e.target.value;
    let additional_data = this.state.additional_data;

    if (name.indexOf("taxable_") === 0) {
      // name is taxable_:index:
      // so should change taxable_:index: to taxable.
      additional_data[index]["taxable"] = value;
    } else {
      additional_data[index][name] = value;
    }

    this.setState({
      additional_data: additional_data
    });

    roomsService.updateAdditionalPrice({id: this.props.room_id, additional_charges: this.state.additional_data}).then(res => {
      if (res && res.success === "true") {
        alertService.showSuccess("Success", '');
      } else {
        alertService.showError("Faild", '');
      }
      this.setState({visible_modal: false});
    });
  }

  handleRemoveAdditional(e, index) {
    e.preventDefault();
    // let name = e.target.name;
    // let value = e.target.value;
    let additional_data = this.state.additional_data;
    additional_data = additional_data.splice(index, 1);

    this.setState({
      additional_data: additional_data
    });
    
    roomsService.updateAdditionalPrice({id: this.props.room_id, additional_charges: this.state.additional_data}).then(res => {
      if (res && res.success === "true") {
        alertService.showSuccess("Success", '');
      } else {
        alertService.showError("Faild", '');
      }
      this.setState({visible_modal: false});
    });

  }
  
  render() {
    let additional_charges_list = this.state.additional_data && this.state.additional_data.map(
      (additional, index) => {
        return (
          <div
            className="additional_charge_row input-group mb-4"
            key={additional.label}
          >
            <hr className="d-md-none" />
            <div className="aditionalrj">
              <div className="tax-item">
                <div className="add-item-taxable">
                  <div className="content extra-field pr-2">
                    <label className="title pl-1">
                      TAXABLE?{" "}
                      <i
                        rel="tooltip"
                        className="icon icon-question"
                        title='Set to "Yes" if you&apos;d like to add tax price.'
                      />
                    </label>
                  </div>

                  <div className="radio-group d-flex justify-content-left">
                    <div className="form-group row m-0">
                      <div className="radio radio-inline">
                        <label className="btn-option">
                          <input
                            type="radio"
                            name={"taxable_" + index}
                            checked={additional.taxable === "Yes"}
                            value="Yes"
                            onChange={event =>
                              this.handleChangeAdditionalData(event, index)
                            }
                          />
                          <i className="helper">Yes</i>
                        </label>
                      </div>
                      <div className="radio radio-inline pl-1">
                        <label className="btn-option">
                          <input
                            type="radio"
                            name={"taxable_" + index}
                            checked={additional.taxable !== "Yes"}
                            value="No"
                            onChange={event =>
                              this.handleChangeAdditionalData(event, index)
                            }
                          />
                          <i className="helper">No</i>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="item-content">
                  <div className="base_pric">
                    <input
                      type="text"
                      name="label"
                      className="form-control"
                      style={{
                        marginBottom: "10px",
                        backgroundColor: "transparent",
                        color: "black"
                      }}
                      onChange={event =>
                        this.handleChangeAdditionalData(event, index)
                      }
                      value={additional.label}
                    />
                  </div>
                </div>
              
              </div>
              <div className="options">
                <div className="charge-amount">
                  <label className="h6">
                    Enter charges amount{" "}
                    <i
                      rel="tooltip"
                      className="icon icon-question"
                      title="The amount of the additional charge.  You can set the amount to be applied as a flat dollar value or as a percentage of the subtotal before taxes."
                    />
                  </label>
                  <div className="base_pric">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <select
                            className=" bg-transparent border-0"
                            name="price_type"
                            onChange={event =>
                              this.handleChangeAdditionalData(event, index)
                            }
                            value={additional.price_type}
                          >
                            <option value={0}> % </option>
                            <option value={1}>{this.props.code}</option>
                          </select>
                        </span>
                      </div>
                      <input
                        type="number"
                        className="form-control input-appended"
                        name="price"
                        min={0}
                        onChange={event =>
                          this.handleChangeAdditionalData(event, index)
                        }
                        value={additional.price}
                      />
                    </div>
                  </div>
                </div>
                <div className="fee-calc extra-field">
                  <label className="h6">
                    Fee calculation{" "}
                    <i
                      rel="tooltip"
                      className="icon icon-question"
                      title="Determines how the fee is calculated.  Single fee is applied one time to the total of the order, Per Night fee's are applied for each night of the stay & Per Guest fee's are applied once for each guest."
                    />
                  </label>
                  <div className="base_pric select">
                    <select
                      className="form-control"
                      name="calc_type"
                      onChange={event =>
                        this.handleChangeAdditionalData(event, index)
                      }
                      value={additional.calc_type}
                    >
                      <option value={0}> Single Fee </option>
                      <option value={1}> Per Night </option>
                      <option value={2}> Per Guest </option>
                    </select>
                  </div>
                </div>
                <div className="optional-remove extra-field">
                  <div className="optional">
                    <label className="h6">
                      Optional{" "}
                      <i
                        rel="tooltip"
                        className="icon icon-question"
                        title='Set to "Yes" if you&apos;d like to allow guests the option to apply this fee.  Works best for things such as Pet fees or special usage fees'
                      />
                    </label>
                    <div className="base_pric select">
                      <select
                        className="form-control"
                        name="guest_opt"
                        onChange={event =>
                          this.handleChangeAdditionalData(event, index)
                        }
                        value={additional.guest_opt}
                      >
                        <option value={0}> Yes </option>
                        <option value={1}> No </option>
                      </select>
                    </div>
                  </div>
                  <button
                    className="btn btn-danger remove-additional_charge"
                    type="button"
                    onClick={event => this.handleRemoveAdditional(event, index)}
                  >
                    <FontAwesomeIcon icon={faTrashAlt}/>
                  </button>
                </div>
                
              </div>
              {/* <Link to="#" className="view-more d-md-none" data-state="hiden">
                {" "}
                + More{" "}
              </Link> */}
            </div>
          </div>
        );
      }
    );

    return (
      <div className="base_priceamt">
        <EditFormModal
          open={this.state.visible_modal}
          onClose={() => this.closeEditModal()}
          styles={{ modal: { padding: "0px" } }}
        >
          <div className="panel rjbedbathpanel" id="add_language_des">
            <div className="panel-header">
              <Link
                data-behavior="modal-close"
                className="modal-close"
                to="#"
              />
              <div className="h4 js-address-nav-heading">
                {this.state.is_edit
                  ? "Edit Additional Charge"
                  : "Add Additional Charge"}
              </div>
            </div>
            <div className="panel-body">
              <div className="aditionalrj">
                <div className="row">
                  <div className="col-md-6">
                    <label className="h6">
                      Enter charges name{" "}
                      <i
                        rel="tooltip"
                        className="icon icon-question"
                        title="The name of the charge as it will be displayed to your guests when making a reservation."
                      />
                    </label>
                    <div className="base_pric">
                      <input
                        type="text"
                        name="label"
                        className="form-control"
                        value={this.state.temp_data.label}
                        onChange={this.handleChangeTemp}
                      />
                    </div>
                  </div>

                  <div className="col-md-6 ">
                    <div className="row">
                      <div className="col-md-12 text-center">
                        <label className="h6">
                          {" "}
                          TAXABLE?{" "}
                          <i
                            rel="tooltip"
                            className="icon icon-question"
                            title="The taxable selection of the charge."
                          />
                        </label>
                      </div>
                    </div>

                    <div className="form-group row justify-content-center pt-10">
                      <div className="radio radio-inline col-md-5 col-3 text-center">
                        <label>
                          <input
                            type="radio"
                            name="taxable"
                            value="Yes"
                            checked={this.state.temp_data.taxable === "Yes"}
                            onChange={this.handleChangeTemp}
                          />
                          <i className="helper">Yes</i>
                        </label>
                      </div>
                      <div className="radio radio-inline col-md-5 col-3 text-center">
                        <label>
                          <input
                            type="radio"
                            name="taxable"
                            value="No"
                            checked={this.state.temp_data.taxable !== "Yes"}
                            onChange={this.handleChangeTemp}
                          />
                          <i className="helper">No</i>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row pt-20">
                  <div className="col-md-4 col-sm-12 col-xs-8">
                    <label className="h6">
                      Enter charges amount{" "}
                      <i
                        rel="tooltip"
                        className="icon icon-question"
                        title="The amount of the additional charge.  You can set the amount to be applied as a flat dollar value or as a percentage of the subtotal before taxes."
                      />
                    </label>
                    <div className="base_pric">
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <select
                              className=" bg-transparent border-0"
                              name="price_type"
                              value={this.state.temp_data.price_type}
                              onChange={this.handleChangeTemp}
                            >
                              <option value={0}> % </option>
                              <option value={1}>{this.props.code}</option>
                            </select>
                          </span>
                        </div>
                        <input
                          type="number"
                          className="form-control input-appended"
                          name="price"
                          min={0}
                          value={this.state.temp_data.price}
                          onChange={this.handleChangeTemp}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-12    col-xs-12 ">
                    <label className="h6">
                      Fee calculation{" "}
                      <i
                        rel="tooltip"
                        className="icon icon-question"
                        title="Determines how the fee is calculated.  Single fee is applied one time to the total of the order, Per Night fee's are applied for each night of the stay & Per Guest fee's are applied once for each guest."
                      />
                    </label>
                    <div className="base_pric select">
                      <select
                        className="form-control"
                        name="calc_type"
                        onChange={this.handleChangeTemp}
                        value={this.state.temp_data.calc_type}
                      >
                        <option value={0}> Single Fee </option>
                        <option value={1}> Per Night </option>
                        <option value={2}> Per Guest </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-12   col-xs-12 ">
                    <label className="h6">
                      Optional{" "}
                      <i
                        rel="tooltip"
                        className="icon icon-question"
                        title='Set to "Yes" if you&apos;d like to allow guests the option to apply this fee.  Works best for things such as Pet fees or special usage fees'
                      />
                    </label>
                    <div className="base_pric select">
                      <select
                        className="form-control"
                        name="guest_opt"
                        onChange={this.handleChangeTemp}
                        value={this.state.temp_data.guest_opt}
                      >
                        <option value={0}> Yes </option>
                        <option value={1}> No </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <div className="force-oneline">
                  <button
                    type="button"
                    className="btn js-secondary-btn"
                    onClick={() => this.closeEditModal()}
                  >
                    Cancel
                  </button>
                  <button
                    id="bedroom_submit"
                    type="submit"
                    className="btn btn-primary"
                    onClick={this.handleAddData}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </EditFormModal>
        <div className="input-group control-group after-add-more-additional_charge">
          <p data-error="additional_charge" className="ml-error hide">
            There is a empty charge name or charge fee.
          </p>
          {additional_charges_list}
        </div>

        <div className="input-group-btn rjaddcharge">
          <button
            id="save_additional_charge"
            className="btn btn-success add-more-additional_charge1"
            type="button"
            onClick={this.openEditModal}
          >
            + Add additional charges
          </button>
        </div>
      </div>
    );
  }
}

export default Additionalcharge;
