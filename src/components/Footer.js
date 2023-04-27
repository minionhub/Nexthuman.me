import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import routes from '../constants/routes.json';
import theme from '../theme';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    justifyContent: 'center',
  },
  footer: {
    color: 'white',
    padding: '0px 20px',
    maxWidth: '1440px',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      padding: '0px  20px',
    },
    [theme.breakpoints.up('md')]: {
      padding: '0px  40px',
    },
    [theme.breakpoints.up('lg')]: {
      padding: '0px  160px',
    },
  },
  toolbar: {
    margin: 'auto',
    width: '100%',
    height: '70px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    padding: '0px',
  },
  title: {
    '@media (max-width:1024px)': {
      // eslint-disable-line no-useless-computed-key
      fontSize: '16px',
      lineHeight: '19px',
      letterSpacing: '0.15px',
      position: 'absolute',
      top: 16,
    },
  },
  links: {
    '& a:last-child span': {
      marginRight: 0,
    },
    '@media (max-width:1024px)': {
      // eslint-disable-line no-useless-computed-key
      fontSize: '12px',
      lineHeight: '14px',
      letterSpacing: '0.25px',
      position: 'absolute',
      right: '0',
      top: 16,
    },
  },
  link: {
    fontSize: '13px',
    lineHeight: '16px',
    letterSpacing: '0.4px',
    margin: '0px 10px',
    '@media (max-width:1024px)': {
      // eslint-disable-line no-useless-computed-key
      margin: '0px 5px',
      fontSize: '12px',
      lineHeight: '14px',
      letterSpacing: '0.25px',
    },
  },
  copyright: {
    fontSize: '13px',
    lineHeight: '16px',
    letterSpacing: '0.4px',
    margin: '0px 10px',
    '@media (max-width:1024px)': {
      // eslint-disable-line no-useless-computed-key
      margin: '0',
      fontSize: '10px',
      lineHeight: '12px',
      letterSpacing: '0.25px',
      position: 'absolute',
      right: 0,
      bottom: '15px',
    },
  },
});

export default () => {
  const theme = useTheme();
  const classes = useStyles({ theme });
  const preventDefault = (event) => event.preventDefault();

  return (
    <div className={classes.root}>
      <div className={classes.footer}>
        <div className={classes.toolbar}>
          <Typography className={classes.title} variant="h6">
            NextHuman
          </Typography>
          <Typography
            className={classes.copyright}
            variant="caption"
          >{`Copyright © ${new Date().getFullYear()} NextHuman`}</Typography>
          <div className={classes.links}>
            <Link href={routes.ABOUT} color="inherit">
              <Typography className={classes.link} variant="caption">
                About
              </Typography>
            </Link>
            <Link href={routes.POLICY} color="inherit">
              <Typography className={classes.link} variant="caption">
                Privacy and Policy
              </Typography>
            </Link>
            <Link href={routes.TERMS} color="inherit">
              <Typography className={classes.link} variant="caption">
                Terms and Conditions
              </Typography>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
