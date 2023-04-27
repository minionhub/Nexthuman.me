import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import MUIButton from '@material-ui/core/Button';

export const Button = withStyles(theme => ({
  root: {
    color: 'white',
    backgroundColor: theme.palette.secondary.main,
    borderRadius: '4px',
    fontFamily: 'Lato',
    fontStyle: 'normal',
    fontSize: '15px',
    lineHeight: '18px',
    fontWeight: 500,
    letterSpacing: '1.25px',
    textTransform: 'uppercase',
    padding: '11px 20px',
    minWidth: 140,
    minHeight: 40
  },
  contained: {
    '&:hover': {
      backgroundColor: '#793179'
    },
    '&:focus': {
      backgroundColor: '#6A2C70'
    },
    '&:active': {
      backgroundColor: '#50245D'
    },
    '&:disabled': {
      backgroundColor: '#CB97C3',
      color: 'white'
    }
  },
  outlined: {
    backgroundColor: 'white',
    color: theme.palette.secondary.main,
    border: '1px solid #6A2C70',
    '&:hover': {
      color: '#793179',
      border: '1px solid #793179'
    },
    '&:active': {
      color: '#50245D',
      border: '1px solid #50245D'
    },
    '&:disabled': {
      color: '#CB97C3',
      border: '1px solid #CB97C3'
    }
  },
  text: {
    border: 'none',
    background: 'none',
    color: '#6A2C70',
    '&:hover': {
      color: '#793179'
    },
    '&:active': {
      color: '#50245D'
    },
    '&:disabled': {
      color: '#CB97C3'
    }
  },
  sizeSmall: {
    fontFamily: 'Lato',
    fontStyle: 'normal',
    fontSize: '10px',
    lineHeight: '12px',
    fontWeight: 500,
    letterSpacing: '1.25px',
    textTransform: 'uppercase',
    minWidth: 100,
    minHeight: 30,
    padding: '5px 10px'
  },
  textSizeSmall: {
    fontFamily: 'Lato',
    fontStyle: 'normal',
    fontSize: '10px',
    lineHeight: '12px',
    fontWeight: 500,
    letterSpacing: '1.25px',
    textTransform: 'uppercase'
  },
  sizeLarge: {
    padding: '14px 40px',
    minWidth: 160,
    minHeight: 48
  },
  iconSizeSmall: {}
}))(MUIButton);

export const ErrorButton = withStyles(theme => ({
  root: {
    color: 'white',
    backgroundColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: red[300]
    }
  }
}))(Button);
