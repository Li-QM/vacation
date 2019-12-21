import React from 'react';

import './markercluster.css';

import markerImage from './home_marker.png';
import activeMarkerImage from './home_marker_active.png';

class Marker extends React.PureComponent {
  // constructor(props){
  //   super(props)
  // }
  render() {
    if(this.props.is_active) {
      return (
        <div className="mapMarker" onClick = { this.props.onClick }>
          <img src={activeMarkerImage} className="home_marker_image marker_active"  width='30px' height='30px' alt="map Marker"/>
        </div>
      );
    }
    else{
      return (
        <div className="mapMarker " onClick = { this.props.onClick }>
          <img src={markerImage} className="home_marker_image " width='30px' height='30px' alt="map Marker"/>
        </div>
      );
    }
  }
}

export default Marker;