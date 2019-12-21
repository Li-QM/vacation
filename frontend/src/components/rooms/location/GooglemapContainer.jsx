import React from "react";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

const GooglemapContainer = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyA34nBk3rPJKXaNQaSX4YiLFoabX3DhkXs&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    defaultZoom={props.zoom ? props.zoom : 14}
    onBoundsChanged={props.onBoundsChanged}
    onCenterChanged={props.onCenterChanged}
    defaultCenter={{ lat: props.lat, lng: props.lng }}
    ref={props.onMapMounted}
    onZoomChanged={props.onCenterChanged}
  >
    {props.isMarkerShown && (
      <Marker position={{ lat: props.lat, lng: props.lng }} />
    )}
  </GoogleMap>
));

export default GooglemapContainer;
