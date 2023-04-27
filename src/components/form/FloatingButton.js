import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';
const styles = theme => ({
  root: {
    padding: '14px 18px',
    borderRadius: '50rem',
    minWidth: '160px',
    whiteSpace: 'nowrap',
    '& .MuiButton-startIcon': {
      marginLeft: '-4px',
      fontSize: 20,
      marginRight: '5px',
      [theme.breakpoints.up('sm')]: {
        marginRight: '8px'
      }
    }
  }
});

export default withStyles(styles)(Button);
