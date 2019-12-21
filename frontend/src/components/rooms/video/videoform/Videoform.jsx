import React from 'react';
import { Link } from 'react-router-dom';

import { roomsService } from 'services/rooms';
import { alertService } from 'services/alert';

class Videoform extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      video_url: ''
    }
    this.handleInputURL = this.handleInputURL.bind(this)
  }
  componentDidMount() {
    roomsService.getVideoUrl(this.props.room_id).then(res => {
      if (res) {
        this.setState({ video_url : res.result.video });
      } else {
        alertService.showError('Get Video URL');
      }
    });
  }
  handleInputURL(e) {
    let value = e.target.value;
    let req = { data : JSON.stringify({video : value}) };
    roomsService.updateRoomPropertySummary(this.props.room_id, req).then(res => {
      if (res && res.success === 'true') {
        this.setState({
          video_url : res.video
        })
      } else {
        alertService.showError('Update Video URL');
      }
    });
  }
  render() {
    return (
      <form name="overview">
        <div className="">
          <div className="saving-progress" style={{ display: 'none' }}>
            <h5 className="m0">Saving...</h5>
          </div>
          <div className="error-value-required row-space-top-1" style={{ float: 'right', display: 'block' }}>
            <h5 className="m0">Please Enter a Valid URL</h5>
          </div>
          <div className="row-space-2 clearfix" id="help-panel-video" ng-init="video=''">
            <div className="row row-space-top-2">
              <div className="col-4">
                <label className="m0 pt-10 pb-5">YouTube URL</label>
              </div>
            </div>
            <input type="text" name="video" id="video" className="input-large" placeholder="YouTube URL" onChange={this.handleInputURL} />
            <p />
            <span style={{ color: 'red', float: 'left', fontSize: 'smaller', margin: '0 0 10px 0' }}>Note*:Only Embed Video Ex:(https://youtu.be/IZXU_9pRabI)</span>
          </div>
          <br />
          <div className="row pt-10">
            <div className={this.state.video_url !== '' ? "col-md-12" : "col-md-12 hide"}>
              <Link to="#" className="remove_rooms_video link-reset" style={{ float: 'right', position: 'absolute', top: 47, right: 33, color: 'white', fontSize: 23, backgroundColor: '#f51f24' }}><i className="icon icon-trash" /></Link>
              <iframe title="room video preview" src={this.state.video_url} style={{ width: '100%', height: 250 }} id="rooms_video_preview" allowFullScreen="allowfullscreen" mozallowfullscreen="mozallowfullscreen" msallowfullscreen="msallowfullscreen" oallowfullscreen="oallowfullscreen" webkitallowfullscreen="webkitallowfullscreen" />
            </div>
          </div>
        </div>
      </form>
    )
  }
}

export default Videoform;