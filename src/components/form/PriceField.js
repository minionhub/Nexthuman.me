import React from 'react';
import NumberFormat from 'react-number-format';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import TextField from './TextField';

const NumberFormatCustom = ({ inputRef, value, onChange, name, ...other }) => {
  return (
    <NumberFormat
      {...other}
      value={value || 0}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange(values.value || 0);
      }}
      thousandSeparator
      allowNegative={false}
      decimalScale={0}
      fixedDecimalScale
    />
  );
};

export default ({ ...props }) => {
  const handleFocus = function (event) {
    event.target.select();
  };

  return (
    <TextField
      {...props}
      InputProps={{
        inputComponent: NumberFormatCustom,
        startAdornment: (
          <InputAdornment position="start">
            <Typography style={{ fontSize: 16 }}>SEK</Typography>
          </InputAdornment>
        ),
      }}
      onFocus={handleFocus}
    />
  );
};
