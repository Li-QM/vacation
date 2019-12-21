import React from 'react';
import { Redirect, Link } from 'react-router-dom';

import { roomsService } from 'services/rooms';
import { alertService } from 'services/alert';

class Publishbutton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      is_redirect: false
    }
    this.handleDraft = this.handleDraft.bind(this)
    this.handlePublish = this.handlePublish.bind(this)
  }
  handlePublish (e) {
    //Unlisted
    let req = {
      data: JSON.stringify({ status: 'Unlisted' })
    };
    roomsService.updateRoomPropertySummary(this.props.roomId, req).then(res => {
      if (res) {
        if(res.steps_count > 0) {
          alertService.showWarning("You still have "+res.steps_count+" steps left to complete before you can publish.", '');
        } else {
          this.setState({
            is_redirect : true
          })
        }
      } else {
        alertService.showError('Update Room Property Summary');
      }
    });
  }
  handleDraft(e) {
    //Draft
    let req = {
      data: JSON.stringify({ status: 'Draft' })
    };
    roomsService.updateRoomPropertySummary(this.props.roomId, req).then(res => {
      if (res) {
        alertService.showSuccess("Saved to draft!", '');
      } else {
        alertService.showError('Update Room Property Summary');
      }
    });
  }
  render () {
    if (this.state.is_redirect) {
      return <Redirect to={`/rooms/subscribe/${this.props.roomId}`} />
    }
    return (
      <div className="calendar_savebuttons">
        <div className="col-md-12">
          <Link to={`/rooms/manage/${this.props.roomId}/terms`} className="right_save">Back</Link>
          <Link to="#" className="right_save_draft" onClick={this.handleDraft}>Draft</Link>
          <Link to="#" className="right_save_publish" onClick={this.handlePublish}>Publish</Link>
        </div>
      </div>
    )
  }
}

export default Publishbutton;