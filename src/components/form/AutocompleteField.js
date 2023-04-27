import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import StarIcon from '@material-ui/icons/Star';
import { Popper } from '@material-ui/core';

const useStyles = makeStyles({
  root: {},
});

const filter = createFilterOptions();

const getOptionLabelDefault = (option) => {
  if (typeof option === 'string') {
    return option;
  }
  return option ? option.label : 'N/A';
};

export default ({
  value,
  onChange = () => {},
  fullWidth,
  placeholder,
  label,
  error = false,
  helperText = null,
  options = [],
  PopperComponent,
  multiple,
  creatable = false,
  onCreate,
  minimum,
  color,
  getOptionLabel = getOptionLabelDefault,
  renderOption = getOptionLabelDefault,
  getOptionSelected = (o, v) => o === v,
  renderTags,
  showAdorn = false,
  ...props
}) => {
  const classes = useStyles({ theme: useTheme() });

  const handleChange = async (event, newValue, reason) => {
    if (reason == 'remove-option' && value.length <= minimum) return;
    let addedOption = multiple ? newValue.pop() : newValue;
    // creating new value
    if (addedOption && addedOption.inputValue) {
      addedOption = await onCreate(addedOption.inputValue);
    }

    if (addedOption) {
      multiple ? onChange([...newValue, addedOption]) : onChange(addedOption);
    } else {
      onChange(newValue);
    }
  };

  return (
    <Autocomplete
      {...props}
      id="free-solo-demo"
      value={value}
      onChange={handleChange}
      multiple={multiple}
      fullWidth={fullWidth}
      options={options}
      PopperComponent={PopperComponent}
      ChipProps={{ icon: <StarIcon style={{ fill: '#F2994A' }} /> }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        // Suggest the creation of a new value
        if (params.inputValue !== '' && creatable) {
          filtered.push({
            inputValue: params.inputValue,
            label: `Add "${params.inputValue}"`,
          });
        }
        return filtered;
      }}
      getOptionLabel={(option) => (option.inputValue ? option.label : getOptionLabel(option))}
      renderOption={(option) => (option.inputValue ? option.label : renderOption(option))}
      getOptionSelected={getOptionSelected}
      renderTags={renderTags}
      renderInput={({ InputProps, InputLabelProps, ...params }) => (
        <TextField
          {...params}
          variant="outlined"
          label={label}
          placeholder={placeholder}
          error={error}
          color={color}
          helperText={helperText}
          InputProps={{
            ...InputProps,
            endAdornment: showAdorn && (
              <InputAdornment position="end">
                <SearchIcon style={{ color: '#828282' }} />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{
            ...InputLabelProps,
            shrink: true,
          }}
        />
      )}
      disableClearable
    />
  );
};
