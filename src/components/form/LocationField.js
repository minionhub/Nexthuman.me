import React, { useState, useEffect } from 'react';

import TextField from './TextField';
import Map from './Map';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {},
}));

export default ({
  value = {},
  onChange,
  showMap = false,
  placeholder = 'Enter a location',
  ...props
} = {}) => {
  const classes = useStyles({ theme: useTheme() });
  const [inputValue, setInputValue] = useState(value.name || '');
  let googleAutocomplete = null;
  const onPlaceChanged = () => {
    const place = googleAutocomplete.getPlace();
    const location = {
      id: place.place_id,
      name: place.formatted_address,
      geometry: place.geometry,
      icon: place.icon,
      url: place.url,
    };
    setInputValue(location.name);
    onChange && onChange(JSON.parse(JSON.stringify(location)));
  };
  useEffect(() => {
    if (value.name) {
      setInputValue(value.name);
    }
  }, [value]);
  useEffect(() => {
    googleAutocomplete = new window.google.maps.places.Autocomplete(
      document.getElementById('location-field'),
      { types: [] }
    );
    googleAutocomplete.addListener('place_changed', onPlaceChanged);
  }, []);

  return (
    <div className={classes.root}>
      <TextField
        id="location-field"
        variant="outlined"
        label="Location"
        fullWidth
        data-testid="locationField"
        value={inputValue}
        placeholder={placeholder}
        onChange={(e) => setInputValue(e.target.value)}
        {...props}
      />
      {showMap && (
        <div style={{ marginTop: 30 }}>
          <Map location={value} />
        </div>
      )}
    </div>
  );
};
