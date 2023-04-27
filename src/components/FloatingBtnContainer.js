import React from 'react';
import { Box } from '@material-ui/core';
import { withStyles } from '@material-ui/core';
import { Translate } from '@material-ui/icons';

const styles = theme => ({
  root: {
    position: 'fixed',
    bottom: 80,
    zIndex: 999,
    transform: 'translateX(0)',
    width: 'min-content',
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      right: 20
    },
    [theme.breakpoints.up('md')]: {
      right: 40
    },
    [theme.breakpoints.up('lg')]: {
      right: 160
    },
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      right: 20,
      transform: 'translateX(0)'
    },
    '@media (min-width: 1440px)': {
      left: 'calc(50% + 560px)',
      transform: 'translate(-100%)'
    },
    '& .MuiButtonBase-root:nth-child(2)': {
      marginLeft: '30px',
      [theme.breakpoints.down('sm')]: {
        marginTop: '12px'
      }
    }
  }
});

export default withStyles(styles)(Box);
