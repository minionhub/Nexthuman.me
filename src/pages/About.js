import React from 'react';
import { Grid, Typography, makeStyles, useTheme } from '@material-ui/core';
import Bg1 from '../img/about-bg-1.png';
import Bg2 from '../img/about-bg-2.png';

const useStyles = makeStyles(theme => ({
  root: {
    height: 'auto',
    minHeight: 'calc(100vh - 130px)',
    paddingTop: 40,
    paddingBottom: 40,
    [theme.breakpoints.up('sm')]: {
      minHeight: 'calc(100vh - 130px)',
      paddingTop: 60,
      paddingBottom: 60
    },
    ['@media (min-width: 780px)']: {
      minHeight: 'calc(100vh - 160px)'
    }
  },
  container: {
    maxWidth: 1440,
    paddingLeft: 20,
    paddingRight: 20,
    [theme.breakpoints.up('sm')]: {
      paddingLeft: 20,
      paddingRight: 20
    },
    [theme.breakpoints.up('md')]: {
      paddingLeft: 40,
      paddingRight: 40
    },
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 160,
      paddingRight: 160
    }
  },
  aboutUsImg: {
    width: '100%',
    height: 'auto'
  },
  marginBottom40: {
    marginBottom: 24,
    [theme.breakpoints.up('sm')]: {
      marginBottom: 40
    }
  },
  marginBottom24: {
    marginBottom: 24
  }
}));

export default () => {
  const classes = useStyles({ theme: useTheme() });

  return (
    <Grid className={classes.root} container justify="center">
      <Grid item container className={classes.container}>
        <Grid item xs={12}>
          <Typography className={classes.marginBottom40} variant="h4" color="primary">
            About us
          </Typography>
        </Grid>
        <Grid item container spacing={4}>
          <Grid item sm={6} xs={12}>
            <img
              className={[classes.aboutUsImg, classes.marginBottom40].join(' ')}
              src={Bg1}
              alt="about bg1"
            />
            <Typography className={classes.marginBottom24} variant="h5" color="primary">
              Title 1
            </Typography>
            <Typography variant="body2">
              Ac gravida aenean et scelerisque nibh. Amet at eget egestas eget. Mi senectus quam
              facilisi auctor nunc. Tristique egestas lorem enim, dui lacus ut. Leo vulputate cursus
              dignissim at id neque blandit. Mauris, id a turpis tincidunt. Tempor, eu tincidunt
              tellus, adipiscing lobortis libero. Mi leo scelerisque egestas ridiculus elit a leo.
              Neque platea eget ullamcorper potenti tortor. Tempus non, ipsum erat pharetra. <br />
              <br />
              Sagittis, quis pharetra nec dignissim bibendum aliquam. Euismod turpis ultrices
              malesuada nunc amet dis. Adipiscing malesuada sed auctor viverra. Varius arcu arcu mi
              accumsan, sem morbi purus. Faucibus vitae, sem venenatis lacus, facilisi augue. Eget
              tortor tempus nisl, eget tristique viverra. Suspendisse in elementum ac nunc lacus.
              Nunc et placerat condimentum tristique ut eu.
            </Typography>
          </Grid>
          <Grid item sm={6} xs={12}>
            <Typography className={classes.marginBottom24} variant="h5" color="primary">
              Title 2
            </Typography>
            <Typography className={classes.marginBottom40} variant="body2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Varius suscipit in maecenas
              pharetra amet sed adipiscing facilisis dui. Diam sit eget lacus, elementum in
              ultricies sed dolor. Egestas pellentesque eget libero enim arcu ut. Egestas felis
              aliquam pellentesque nisi gravida dictumst elementum. Magna augue facilisi nulla sit.
              Turpis nulla neque pretium, neque. Non lectus donec et amet molestie mi et. Sed ac sit
              orci, pretium cras. Leo vel eu ac orci egestas magna volutpat.
              <br />
              <br />
              Venenatis faucibus habitant tortor volutpat vel enim cursus. Est ullamcorper
              pellentesque senectus sagittis. Ac gravida aenean et scelerisque nibh. Amet at eget
              egestas eget. Mi senectus quam facilisi auctor nunc. Tristique egestas lorem enim, dui
              lacus ut. Leo vulputate cursus dignissim at id neque blandit. Mauris, id a turpis
              tincidunt.
            </Typography>
            <img className={classes.aboutUsImg} src={Bg2} alt="about bg2" />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
