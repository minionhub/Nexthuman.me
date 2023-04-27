import React, { useEffect, useState } from 'react';

let googleMap = null;

export default ({ center, zoom, location = {} } = {}) => {
  useEffect(() => {
    googleMap = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: -33.866, lng: 151.196 },
      zoom: 17,
    });
  }, []);

  useEffect(() => {
    if (googleMap && location && location.data) {
      const marker = new window.google.maps.Marker({
        position: location.data.geometry.location,
        icon: location.data.icon,
        map: googleMap,
      });
      googleMap.fitBounds(location.data.geometry.viewport);
    }
  }, [location]);

  return <div id="map" style={{ height: 300, width: '100%', borderRadius: 8 }} />;
};
