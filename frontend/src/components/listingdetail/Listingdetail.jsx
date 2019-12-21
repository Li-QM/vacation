import React from 'react';

import ListingMenu from './listingmenu/ListingMenu';
import SubNav from './subnav/SubNav';
import ListingRoom from './listingroom/ListingRoom';
import ListingMap from './listingmap/ListingMap';
import SimilarListing from './similarlisting/SimilarListing';

import { listingDetailService } from 'services/listingDetail';

import 'assets/styles/pages/homes/listingdetail.scss';

const anchor_style = {
  display: 'block',
  height: '150px', 
  marginTop: '-150px', 
  visibility: 'hidden',
}

class Listingdetail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      room_detail : {},
      user_details : {},
      similar : []
    }
  }
  componentDidMount() {
    let address_url = this.props.match.params.address_url;
    let room_id = this.props.match.params.room_id;

    listingDetailService.getHomesData(address_url, room_id).then(res => {
      if (res) {
          this.setState({
          room_detail : res.result,
          user_details : res.user_details,
        });
      }
    });

    listingDetailService.getSimilarData(room_id).then(res => {
      if (res) {
          this.setState({
          similar : res.similar,
        });
      }
    });
  }

  render() {
    let room_id = this.props.match.params.room_id;
    
    return (
      <main>
        <div className="homes-page container-fluid">
        	<ListingMenu room_name={this.state.room_detail != null ? this.state.room_detail.name : ''} address = {this.state.room_detail != null ? this.state.room_detail.rooms_address : {}}/>
					<SubNav/>
					<ListingRoom room_id={room_id} room_detail = {this.state.room_detail} user_details = {this.state.user_details} /> 
        </div>
				<ListingMap address={this.state.room_detail ? this.state.room_detail.rooms_address : {}}/>
        <span style={ anchor_style } id='similar-listing'> </span>
        <SimilarListing listings={this.state.similar} /> 
      </main>
    );
  }
}

export default Listingdetail;