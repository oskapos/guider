import React, { useRef, useEffect } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

import './Map.css';

mapboxgl.accessToken =
  'pk.eyJ1Ijoib21hcmFsc2hheWViIiwiYSI6ImNsMXZ2YXdhYzBkYjkzaW1wMWlldmZ2NTcifQ._dPCjzR8nCFynQiLrR6mdg';

//MAP configuration component (with mapbox)
const Map = props => {
  const { center, zoom } = props;

  //link the map with the containing div
  const mapContainer = useRef();
  const map = useRef(null);

  useEffect(() => {
    // if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      //   style: 'mapbox://styles/mapbox/streets-v11',
      center: center,
      zoom: zoom,
    });
  }, [center, zoom]);

  return (
    <div
      ref={mapContainer}
      className={`map map-container ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;
