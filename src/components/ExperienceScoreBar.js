import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box'
  },
  experienceTitle: {
    color: '#793179',
    margin: '0 0 12px 0'
  },
  scoreContainer: {
    width: '100%',
    height: '32px',
    backgroundColor: '#F2F2F2',
    borderRadius: '4px'
  }
});

export default ({ experience }) => {
  const classes = useStyles({ theme: useTheme() });

  return (
    <Box className={classes.root}>
      <Typography variant="h6" className={classes.experienceTitle}>
        {experience.name}
      </Typography>
      <Box className={classes.scoreContainer}></Box>
    </Box>
  );
};
