import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  leftBg: {
    backgroundImage: (props) => props.background,
    backgroundSize: 'cover',
    backgroundPositionY: 'center',
    backgroundPositionX: 'left',
    height: '100vh',
    '@media (max-width:960px)': {
      height: '450px',
    },
    '@media (max-width:600px)': {
      height: '305px',
    },
  },
  background: {
    // backgroundColor: '#6A2C70',
    mixBlendMode: 'multiply',
    opacity: 0.65,
    borderRadius: '0px',
  },
  rightPanel: {
    '@media (max-width:960px)': {
      minHeight: 'calc(100vh - 300px)',
      alignItems: 'flex-start',
      marginTop: '24px',
      paddingBottom: '50px',
      paddingLeft: '8px',
      paddingRight: '8px',
      justifyContent: 'center',
    },
  },
});

export default (props) => {
  const classes = useStyles(props);

  return (
    <Grid container spacing={0} justify="flex-start" style={{ minHeight: '100vh' }}>
      <Grid item container xs={12} md={6} className={classes.leftBg}>
        <Grid item xs={12} className={classes.background}></Grid>
      </Grid>
      <Grid
        item
        container
        xs={12}
        md={6}
        alignItems="center"
        justify="flex-start"
        className={classes.rightPanel}
      >
        {props.children}
      </Grid>
    </Grid>
  );
};
