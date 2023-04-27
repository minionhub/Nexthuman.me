import React from 'react';
import NumberFormat from 'react-number-format';
import TextField from './TextField';

const NumberFormatCustom = ({ inputRef, value, onChange, name, ...other }) => {
  return (
    <NumberFormat
      {...other}
      value={value}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange(values.value || 0);
      }}
      thousandSeparator
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
      }}
      onFocus={handleFocus}
    />
  );
};
