import React from 'react';
import { Link } from 'react-router-dom';

import GoogleMapContainer from 'components/rooms/location/GooglemapContainer';

const hover_card_style = {
  position: 'absolute',
  top: '0px',
  left: '50%',
  transform: 'translate(-50%)'
};
const anchor_style = {
  display: 'block',
  height: '150px',
  marginTop: '-150px',
  visibility: 'hidden'
};

class ListingMap extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      refs: {
        map: undefined
      },
      address: this.props.address ? this.props.address : {}
    };
    this.onMapMounted = this.onMapMounted.bind(this);
    this.onCenterChanged = this.onCenterChanged.bind(this);
  }
  onMapMounted(ref) {
    let refs = this.state.refs;
    refs.map = ref;
    this.setState({
      refs: refs
    });
  }
  onCenterChanged() {
    let refs = this.state.refs;
    let center = refs.map.getCenter();
    let address = this.state.address;
    address.latitude = center.lat();
    address.longitude = center.lng();
    this.setState({
      address: address
    });
  }
  render() {
    return (
      <div className="room-section">
        <span style={anchor_style} id="neighborhood"></span>
        <div
          className=""
          id="map-id"
          data-reactid=".2"
          style={{ position: "relative" }}
        >
          <div className="panel location-panel" style={{ height: 400 }}>
            {this.props.address ? (
              <GoogleMapContainer
                zoom={18}
                onCenterChanged={this.onCenterChanged}
                onMapMounted={this.onMapMounted}
                lng={
                  this.props.address
                    ? parseFloat(this.props.address.longitude)
                    : 0
                }
                lat={
                  this.props.address
                    ? parseFloat(this.props.address.latitude)
                    : 0
                }
                isMarkerShown
                onBoundsChanged={console.log()}
              />
            ) : (
              <div> </div>
            )}

            <div id="hover-card" className="panel" style={hover_card_style}>
              <div className="panel-body">
                <div className="text-center">Listing Location</div>
                <div className="text-center">
                  <span>
                    <Link to="#" className="text-muted">
                      <span>
                        {this.props.address
                          ? this.props.address.state
                          : "Loading..."}
                        ,
                      </span>
                    </Link>
                  </span>
                  <span>
                    <Link to="#" className="text-muted">
                      <span>
                        {this.props.address
                          ? this.props.address.country_name
                          : "Loading..."}
                      </span>
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default ListingMap;
