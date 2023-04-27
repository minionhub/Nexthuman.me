import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Grid, Box, Typography } from '@material-ui/core';
import backgroundImg from '../img/main-bg.jpg';
import routes from '../constants/routes.json';
import { Button } from '../components/form/Buttons';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    height: 'auto',
    minHeight: 'calc(100vh - 130px)',
    backgroundImage: `url(${backgroundImg})`,
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    [theme.breakpoints.up('sm')]: {
      minHeight: 'calc(100vh - 130px)',
    },
    ['@media (min-width: 780px)']: {
      minHeight: 'calc(100vh - 160px)',
    },
  },
  container: {
    zIndex: 1,
    maxWidth: 1440,
    width: '100%',
    padding: '20px 20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      padding: '60px  20px',
    },
    [theme.breakpoints.up('md')]: {
      padding: '60px  40px',
      alignItems: 'flex-start',
    },
    [theme.breakpoints.up('lg')]: {
      padding: '60px  160px',
    },
  },
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(180deg, rgba(14, 33, 90, 0.9) 0%, rgba(241, 85, 76, 0.5) 100%)',
  },
  contentTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '42px',
    lineHeight: '48px',
    textAlign: 'center',
    textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    [theme.breakpoints.up('md')]: {
      fontSize: '96px',
      lineHeight: '115px',
      textAlign: 'left',
      textShadow: 'none',
    },
  },
  contentSubtitle: {
    maxWidth: 730,
    margin: '24px 0 0 0',
    color: 'white',
    fontSize: '16px',
    lineHeight: '19px',
    textAlign: 'center',
    letterSpacing: '0.15px',
    [theme.breakpoints.up('md')]: {
      margin: '40px 0 0 0',
      textAlign: 'left',
      fontSize: '24px',
      lineHeight: '29px',
    },
  },
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    marginTop: 60,
    '& .MuiButtonBase-root': {
      width: '100%',
      maxWidth: 368,
      margin: '12px 0 0 0',
    },
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      '& .MuiButtonBase-root': {
        width: 160,
      },
      '& .MuiButtonBase-root:nth-child(2)': {
        marginLeft: 24,
      },
    },
  },
}));

export default () => {
  const theme = useTheme();
  const classes = useStyles({ theme });
  const history = useHistory();

  return (
    <Grid className={classes.root} container justify="center">
      {/* <Box className={classes.overlay}></Box> */}
      <Grid className={classes.container} item>
        <Typography className={classes.contentTitle} variant="h1">
          Welcome to your new
          <br />
          world
        </Typography>
        <Typography className={classes.contentSubtitle} variant="h5">
          NextHuman elementum tellus commodo. Volutpat mauris egestas auctor dolor lacus magnis
          turpis pulvinar.
        </Typography>
        <Box className={classes.buttonWrapper}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              history.push(routes.BOOKS);
            }}
            size="large"
          >
            Books
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => {
              history.push(routes.EVENTS);
            }}
          >
            Events
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};
