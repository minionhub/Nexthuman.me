import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

const LoadingOverlay = () => {
  const classes = useStyles({ theme: useTheme() });
  return (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  );
};

export default LoadingOverlay;
