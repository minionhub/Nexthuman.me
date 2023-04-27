import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';

import { v4 as uuidv4 } from 'uuid';

const useStyles = makeStyles(theme => ({
  inputLabel: {
    backgroundColor: 'white',
    paddingLeft: 5,
    paddingRight: 5
  },
  formHelperText: {
    marginLeft: 0
  }
}));

export default ({
  fullWidth,
  label,
  id,
  onChange,
  options = [],
  required = false,
  error = false,
  ...props
}) => {
  const classes = useStyles();
  const [_id] = useState(id || uuidv4());

  const handleChange = event => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <FormControl variant="outlined" fullWidth={fullWidth} error={error}>
      <InputLabel id={_id} shrink className={classes.inputLabel}>
        {`${label} ${required && '*'}`}
      </InputLabel>
      <Select labelId={_id} {...props} onChange={handleChange} label={label}>
        {options.map(({ value, label }, index) => (
          <MenuItem key={id + '-' + index} value={value} data-testid="select-item">
            {label}
          </MenuItem>
        ))}
      </Select>
      {error && (
        <FormHelperText className={classes.formHelperText}>{`${label} is required`}</FormHelperText>
      )}
    </FormControl>
  );
};
