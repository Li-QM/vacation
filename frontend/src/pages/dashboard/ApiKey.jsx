import React from 'react'
import PasswordMask from 'react-password-mask';
import { dashboardService } from 'services/dashboard';
import { alertService } from 'services/alert';

import 'assets/styles/pages/dashboard/apikey.scss';

export default class ApiKey extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      public_api_key: "",
      secret_api_key: ""
    }
    this.handleGenerateApiKeys = this.handleGenerateApiKeys.bind(this)
  }
  componentDidMount() {
    dashboardService.getApiKey().then(res => {
      if (res) {
        this.setState({
          public_api_key: res.public_api_key,
          secret_api_key: res.secret_api_key,
        });
      } else {
        alertService.showError('Get API key');
      }
    });
  }

  handleGenerateApiKeys(e) {
    e.preventDefault();
    dashboardService.generateApiKey().then(res => {
      if (res) {
        this.setState({
          public_api_key: res.public_api_key,
          secret_api_key: res.secret_api_key,
        });
      } else {
        alertService.showError('Generate API key');
      }
    })
  }
  render() {
    return (
      <div className="aside-main-content">
        <div className="side-cnt">
          <div className="head-label">
            <h4>API Keys</h4>
          </div>
          <div className="aside-main-cn">
            <form onSubmit={this.handleGenerateApiKeys}>
              <div className="form-group">
                <label htmlFor="public_api_key">Public Key:</label>
                <PasswordMask
                  id="public-password"
                  name="password"
                  placeholder="Public API Key"
                  readOnly
                  value={this.state.public_api_key}
                  buttonStyles={{marginTop: '-14px'}}
                // onChange={this.handleChange.bind(this)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="secret_api_key">Secret Key:</label>
                {/* <input className="form-control" id="secret_api_key" readOnly/> */}
                <PasswordMask
                  id="secret-password"
                  name="password"
                  placeholder="Secret API Key"
                  readOnly
                  value={this.state.secret_api_key}
                  buttonStyles={{marginTop: '-14px'}}
                // onChange={this.handleChange.bind(this)}
                />
              </div>
              <button type="submit" className="btn btn-primary">{this.state.public_api_key ? 'Re-' : ''}Generate</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}