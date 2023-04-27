import React from 'react';
import { withStyles, fade } from '@material-ui/core';

import MUITextField from '@material-ui/core/TextField';

const styles = theme => ({
  root: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#BDBDBD'
      },
      '&:hover fieldset': {
        borderColor: '#6A2C70'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#6A2C70',
        borderWidth: '1px'
      },
      '&.Mui-disabled fieldset': {
        borderColor: '#E0E0E0'
      },
      '& .MuiInputBase-input': {
        fontFamily: 'Roboto, sans-serif'
      },
      '& .MuiInputBase-input::placeholder': {
        color: '#BDBDBD',
        opacity: 1
      },
      '& .MuiInputBase-input.Mui-disabled::placeholder': {
        color: '#E0E0E0'
      }
    },
    '&:hover': {
      '& .MuiInputLabel-outlined': {
        color: '#6A2C70'
      }
    },
    '& .MuiFormLabel-root': {
      fontFamily: 'Roboto, sans-serif',
      '&.Mui-disabled': {
        color: '#E0E0E0 !important'
      }
    }
  },
  input: {
    //overflow: 'hidden',
    borderRadius: 4,
    lineHeight: 1
    // transition: theme.transitions.create(['border-color', 'box-shadow'])
  },
  label: {
    lineHeight: 1
  },
  helperText: {
    fontSize: 13,
    lineHeight: 1,
    marginLeft: 0,
    marginTop: 5
  }
});

const TextField = ({ classes, InputProps, InputLabelProps, FormHelperTextProps, ...props }) => {
  return (
    <MUITextField
      variant="outlined"
      color="secondary"
      {...props}
      classes={{
        root: classes.root
      }}
      InputProps={{
        ...InputProps,
        classes: {
          root: classes.input,
          error: classes.inputError,
          focused: classes.inputFocused
        }
      }}
      InputLabelProps={{
        ...InputLabelProps,
        classes: { root: classes.label },
        shrink: true
      }}
      FormHelperTextProps={{
        ...FormHelperTextProps,
        classes: { root: classes.helperText }
      }}
    />
  );
};

export default withStyles(styles)(TextField);
