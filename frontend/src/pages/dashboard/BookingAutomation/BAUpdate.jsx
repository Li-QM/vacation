import React from 'react';
import { dashboardService } from 'services/dashboard';
import { alertService } from 'services/alert';

import 'assets/styles/pages/dashboard/bookingAutomation.scss';

class BAUpdate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isUpdating: false,
      is_ba_memeber: false,
      credentials: []
    };
    this.onClickUpdate = this.onClickUpdate.bind(this);
  }

  onClickUpdate(event) {
    if (this.state.isUpdating) {
      alertService.showError('Updating now ...', '');
      return;
    }
    this.setUpdateStatus();
    dashboardService.updateBAKeys()
      .then(res => {
        if (res.success === true) {
          alertService.showSuccess('Update data from BA', 'Successfully!');
        } else {
          alertService.showError('Update data from BA', 'Not Success!');
        }
        this.clearUpdateStatus();
      })
      .catch(error => {
        alertService.showError('Update data from BA', 'Not Success!');
        this.clearUpdateStatus();
      });
  }
  setUpdateStatus() {
    this.setState({ isUpdating: true });
  }
  clearUpdateStatus() {
    this.setState({ isUpdating: false });
  }
  showMessage(type, content) {
    if (type === 'error') {
      alertService.showError('Update data from BA', content);
    }
    if (type === 'success') {
       alertService.showSuccess('Update data from BA', content);
    }
  }

  render() {
    return (
      <div className="ba-update ba-panel col-lg-8 col-md-11 col-sm-12">
        <div className="card p-5 mt-0">
          <div className="row title-bar">
            <p className="mt-0"> Updated data from Booking Automation </p>
          </div>
          <div className="clearfix" />
          <button className="btn btn-info w-100" onClick={this.onClickUpdate}>
            Update
             {
              (this.state.isUpdating) ?
              (<div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div>)
              : null
            }
          </button>
        </div>
      </div>
    );
  }
}

export default BAUpdate;