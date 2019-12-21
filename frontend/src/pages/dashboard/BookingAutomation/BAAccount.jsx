import React from "react";
import { dashboardService } from 'services/dashboard';
import { alertService } from 'services/alert';

import 'assets/styles/pages/dashboard/bookingAutomation.scss';

class BAAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      is_ba_memeber: false,
      prop_id: null,
      ota_password: null,
      api_key: null,
      prop_key: null,
      is_bin_enable: 0,
      disabled_bin: true
    };
    this.handleChecked = this.handleChecked.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    dashboardService.getBACredential().then(res => {
      if (res) {
        if (res.success === true) {
          let param = res.data;
          let disabled_bin = true;
          let is_bin_enable = param.is_bin_enable;
          if (
            param.prop_id === null || param.prop_id === '' ||
            param.ota_password === null || param.ota_password === '' ||
            param.api_key === null || param.api_key === '' ||
            param.prop_key === null || param.prop_key === '' 
          ) {
            disabled_bin = true;
            is_bin_enable = 0;
          } else {
            disabled_bin = 0;
          }
          this.setState({
            is_ba_memeber: true,
            prop_id : param.prop_id,
            ota_password : param.ota_password,
            api_key : param.api_key,
            prop_key : param.prop_key,
            is_bin_enable : is_bin_enable,
            disabled_bin: disabled_bin
          });
        }
      } else {
        alertService.showError('Get BA credential');
      }
    });
  }
  
  onClickUpdate(event) {
    dashboardService.updateBAKeys().then(res => {
      if (res && res.success) {
        alertService.showSuccess('Update BA keys');
      } else {
        alertService.showError('Update BA keys');
      }
    });
  }

  handleChecked(event) {
    this.setState({
      is_bin_enable : (this.state.is_bin_enable === 1 ? 0 : 1),
    });
  }

  handleChange(event) {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;
    const state = this.state;
    state[fieldName] = fieldValue;
    if (
      state.prop_id === null || state.prop_id === '' ||
      state.ota_password === null || state.ota_password === '' ||
      state.api_key === null || state.api_key === '' ||
      state.prop_key === null || state.prop_key === '' 
    ) {
      state.disabled_bin = true;
      state.is_bin_enable = 0;
    } else {
      state.disabled_bin = 0;
    }

    this.setState({
      [fieldName] : fieldValue,
      disabled_bin: state.disabled_bin,
      is_bin_enable: state.is_bin_enable
    });
  }

  handleSubmit(event){
    event.preventDefault();
    const req = {
      prop_id: this.state.prop_id,
      ota_password: this.state.ota_password,
      api_key : this.state.api_key,
      prop_key: this.state.prop_key,
      is_bin_enable: this.state.is_bin_enable
    };
    dashboardService.submitBAKeys(req).then(res => {
      if (res && res.success) {
        alertService.showSuccess('Register BA Account');
      } else {
        alertService.showError('Register BA Account');
      }
    });
  }
  render() {
    return (
      <div className="ba-panel col-md-12 col-sm-12 col-lg-11">
        <div className="panel">
          <div className="panel panel-header">
            <h1>Booking Automation Credential Info</h1>
          </div>
          <div className="panel panel-body">
            <div>
              <form onSubmit={ this.handleSubmit }>
                <div className="form-group">
                  <label className="col-sm-4">Prop ID</label>
                  <input
                    type="text"
                    placeholder="prop_id"
                    name="prop_id"
                    onChange={this.handleChange}
                    defaultValue={this.state.prop_id || ""}
                  />
                </div>

                <div className="form-group">
                  <label className="col-sm-4">OTA Password</label>
                  <input
                    type="text"
                    placeholder="OTA password"
                    name="ota_password"
                    onChange={this.handleChange}
                    defaultValue={this.state.ota_password || ""}
                  />
                </div>

                <div className="form-group">
                  <label className="col-sm-4">APIKey</label>
                  <input
                    type="text"
                    placeholder="api_key"
                    name="api_key"
                    onChange={this.handleChange}
                    defaultValue={this.state.api_key || ""}
                  />
                </div>

                <div className="form-group">
                  <label className="col-sm-4">PropKey</label>
                  <input
                    type="text"
                    placeholder="propkey"
                    name="prop_key"
                    onChange={this.handleChange}
                    defaultValue={this.state.prop_key || ""}
                  />
                </div>

                <div className="form-group" style={{display:'inline-flex'}}>
                  <input type="checkbox"
                          name="is_bin_enable"
                          checked={ (this.state.is_bin_enable === 1 ? true : false) }
                          disabled={this.state.disabled_bin ? "disabled" : ""}
                          onChange={this.handleChecked} style={{ verticalAlign: "initial", marginTop:'10px', cursor:'pointer'}}/>
                  {
                    (this.state.disabled_bin === true) ?
                      <label style={{'color': '#ccc'}}>Enable Book it now?</label>
                    :
                      <label style={{'color': 'black'}}>Enable Book it now?</label>
                  }
                </div>

                <div className="form-group">
                  <button className="btn btn-success" type="submit">
                    Save
                  </button>
                  <button className="btn btn-danger" type="reset">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BAAccount;