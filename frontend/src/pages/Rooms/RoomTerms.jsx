import React from "react";

import Termstitle from 'components/rooms/terms/termstitle/Termstitle';
import Canceleditor from 'components/rooms/terms/canceleditor/Canceleditor';
import Termsbutton from 'components/rooms/terms/termsbutton/Termsbutton';

import { roomsService } from 'services/rooms';
import { alertService } from 'services/alert';

import property_help from 'assets/images/property-help.png';
import 'assets/styles/rooms/room_terms.scss';

class RoomTerms extends React.Component {
  constructor(props) {
  	super(props);
    this.state = {
      content: '',
      enable_rerender: true
    };
    
    this.onTermChange = this.onTermChange.bind(this);
  }

  componentDidMount() {
    roomsService.getCancelMessage(this.props.match.params.room_id).then(res => {
      if (res) {
        this.setState({
          content: res.cancel_message
        })
      } else {
        alertService.showError('Get Cancel Message');
      }
    });
  }
  shouldComponentUpdate(nextProps, nextState) { 
    if (nextState.enable_rerender === false) { 
      return false;
    }
    return true;
  }

  onTermChange(value) {
    let req = {
      data : JSON.stringify({cancel_message: value})
    }
    roomsService.updateRoomPropertySummary(this.props.match.params.room_id, req).then(res => {
      if (res && res.success === 'true') {
        this.setState({ 
          content: value,
          enable_rerender: false
        });
        this.props.onUpdateSidebar();
      } else {
        // alertService.showError('Update Room Property Summary');
      }
    });
  }

  render() {
    return (
      <div className="room_term">
        <div className="manage-listing-content-wrapper clearfix">
          <div className="listing_whole col-md-9" id="js-manage-listing-content">
            <div className="common_listpage">
              <Termstitle roomId={this.props.match.params.room_id} />
              <Canceleditor value={this.state.content} onChange={this.onTermChange}/>
              <Termsbutton roomId={this.props.match.params.room_id} />
            </div>
          </div>
          <div className="col-md-3 col-sm-12 listing_desc">
            <div className="manage_listing_left">
              <img
                src={property_help}
                alt="property-help"
                className="col-center"
                width="75"
                height="75"
              />
              <div className="amenities_about">
                <h4>List Your Cancellation Policy</h4>
                <p>
                  Be descriptive with your cancellation policy and let your
                  customers know the policies and penalties for early
                  cancellations and no shows.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RoomTerms;
