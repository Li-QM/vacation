import React from 'react';
import GoogleMapReact from 'google-map-react';
import Marker from './Marker/Marker';
import RoomDetail from './RoomDetail/RoomDetail';
import {GOOGLE_MAP_KEY} from 'services/config';
import {searchService} from 'services/search';

class SearchMap extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open_detail: false
    };
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.handleMapChange = this.handleMapChange.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
  }
  handleMapChange({ center, zoom, bounds }) {
    this.setState(
      {
        open_detail: false
      },
      () => {
        this.props.handleMapChange({ center, zoom, bounds });
      }
    );
  }
  onMarkerClick(room_id) {
    let self = this;

    searchService.getRooms(room_id).then(res => {
      self.setState({
        room_detail: res.result,
        activeRoom_lat: res.latitude,
        activeRoom_lng: res.longitude,
        open_detail: true
      });
    });
  }
  
  handleMapClick({ x, y, lat, lng, event }) {
    this.setState({
      open_detail: false
    });
  }

  render() {
    return (
      <GoogleMapReact
        bootstrapURLKeys={{ key: GOOGLE_MAP_KEY }}
        onChange={this.handleMapChange}
        center={this.props.defaultCenter}
        onClick={this.handleMapClick}
        zoom={this.props.zoom}
      >
        {this.state.open_detail ? (
          <RoomDetail
            lat={this.state.activeRoom_lat}
            lng={this.state.activeRoom_lng}
            room_data={this.state.room_detail}
          ></RoomDetail>
        ) : null}
        {this.props.data.map((listing, index) => {
          return (
            <Marker
              is_active={this.props.hover_room === listing.id ? true : false}
              onClick={() => this.onMarkerClick(listing.id)}
              room_id={listing.id}
              key={listing.id}
              lat={listing.latitude}
              lng={listing.longitude}
            />
          );
        })}
      </GoogleMapReact>
    );
  }
}
export default SearchMap;
