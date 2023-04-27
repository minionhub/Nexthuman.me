import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { Box, Grid, Typography, Button, IconButton, Container } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useCookies } from 'react-cookie';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    left: 0,
    fontFamily: 'Lato',
    height: 150,
    background: '#283C63',
    zIndex: 1000,
    '& .MuiContainer-maxWidthLg': {
      maxWidth: '1168px !important',
    },
    [theme.breakpoints.down('sm')]: {
      height: 200,
    },
  },
  consentWrapper: {
    flexWrap: 'nowrap',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
      flexWrap: 'wrap',
      textAlign: 'center',
    },
  },
  cookieNotice: {
    fontSize: 15,
    lineHeight: '18px',
    color: '#fff',
  },
  accept: {
    padding: '12px 24px',
    fontSize: 15,
    margin: '0 8px',
    minWidth: 170,
    [theme.breakpoints.down('sm')]: {
      marginTop: 20,
    },
  },
  decline: {
    color: '#fff',
    [theme.breakpoints.down('sm')]: {
      position: 'absolute',
      top: 0,
      right: 0,
    },
  },
}));
export default () => {
  const classes = useStyles({ theme: useTheme() });
  const [cookies, setCookie] = useCookies(['acceptCookies']);
  const [showConsent, setShowConsent] = useState(true);

  function onAcceptCookies() {
    setCookie('acceptCookies', true, { path: '/' });
  }

  return (
    <>
      {cookies.acceptCookies != 'true' && showConsent && (
        <Grid container alignItems="center" className={classes.root}>
          <Container>
            <Grid
              container
              className={classes.consentWrapper}
              justify="space-between"
              alignItems="center"
            >
              <Typography className={classes.cookieNotice}>
                This website uses cookies in order to offer you the most relevant information.
                Please accept cookies for optimal performance.
              </Typography>
              <Button
                data-testid="btn-acceptCookies"
                className={classes.accept}
                variant="contained"
                size="small"
                color="secondary"
                onClick={() => onAcceptCookies()}
              >
                YES, I ACCEPT
              </Button>
              <IconButton
                className={classes.decline}
                color="primary"
                component="span"
                onClick={() => setShowConsent(false)}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
          </Container>
        </Grid>
      )}
    </>
  );
};
