import React, { useState, useEffect } from 'react';
import TagManager from 'react-gtm-module';
import { Grid, Typography, makeStyles, Box } from '@material-ui/core';
import { Button } from '../components/form/Buttons';
import TextField from '../components/form/TextField';
import {
  doVerifyPasswordResetCode,
  doConfirmPasswordReset,
  doVerifyEmail,
} from '../services/auth/auth.firebase';
import AuthLayout from '../components/AuthLayout';
import bg1 from '../img/left_bg_forgot.jpg';
import bg2 from '../img/left_bg_2.jpg';
import bg4 from '../img/left_bg.jpg';
import routes from '../constants/routes.json';
import { authIsReady } from 'react-redux-firebase';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    '@media (max-width:960px)': {
      paddingBottom: '0px',
      fontWeight: 'normal',
      fontSize: '34px',
      lineHeight: '41px',
      letterSpacing: '0.25px',
    },
  },
  form: {
    maxWidth: '400px',
    marginLeft: '100px',
    '@media (max-width:1200px)': {
      marginLeft: '40px',
    },
    '@media (max-width:960px)': {
      margin: 0,
    },
  },
  actions: {
    '@media (max-width:780px)': {
      flexDirection: 'column-reverse',
    },
    '& button': {
      '@media (max-width:780px)': {
        width: '100%',
        margin: '10px 0px',
        flexDirection: 'column-reverse',
      },
    },
  },
  rootWelcome: {
    width: '100%',
    minHeight: '100vh',
  },
  leftGrid: {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    position: 'relative',
    height: 554,
    [theme.breakpoints.up('md')]: {
      height: 'auto',
    },
    '& .overlay': {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(106, 44, 112, 0.65)',
    },
  },
  rightGrid: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '40px 40px 85px 23px',
    [theme.breakpoints.up('sm')]: {
      alignItems: 'center',
    },
    [theme.breakpoints.up('md')]: {
      alignItems: 'flex-start',
      paddingLeft: 65,
      paddingBottom: 40,
    },
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 125,
    },
    '& .MuiTypography-h2': {
      fontWeight: 500,
    },
  },
  content: {
    width: 'auto',
  },
  signBtn: {
    margin: '40px 0 0 0',
  },
}));

export default () => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [isResetCodeVerified, setResetCodeVerified] = useState(false);
  const [isConfirmReset, setIsConfirmReset] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [info, setInfo] = useState(null);
  const [mode, setMode] = useState('');

  // For reset password
  const [isSubmitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    password: {
      value: '',
      validate: true,
      errorMsg: '',
    },
    confirmPassword: {
      value: '',
      validate: true,
      errorMsg: '',
    },
  });

  const [actionCode, setActionCode] = useState('');

  const resetPassword = () => {
    setSubmitted(true);

    let passwordValidate = true;
    const passwordConfirmValidate = formData.confirmPassword.value.length > 0;

    let errorMsg = '';
    if (formData.password.value.length === 0) {
      errorMsg = 'Please input new password.';
      passwordValidate = false;
    } else if (formData.password.value.length < 6) {
      errorMsg = 'Password should be at least 6 characters.';
      passwordValidate = false;
    } else if (formData.password.value !== formData.confirmPassword.value) {
      errorMsg = "Confirm password didn't match.";
      passwordValidate = false;
    }

    setFormData({
      password: {
        ...formData.password,
        validate: passwordValidate,
        errorMsg: errorMsg,
      },
      confirmPassword: {
        ...formData.confirmPassword,
        validate: passwordConfirmValidate,
        errorMsg: passwordConfirmValidate ? '' : 'Please input confirm password.',
      },
    });

    if (!(passwordValidate && passwordConfirmValidate)) return;

    doConfirmPasswordReset(actionCode, formData.password.value)
      .then(() => {
        setIsConfirmReset(true);
        setInfo({ state: 'success', message: 'Password was reset successfully' });
      })
      .catch();
  };

  const signIn = (e) => {
    e.preventDefault();
    window.location.href = routes.LOGIN;
    return false;
  };

  const verifyAccount = (actionCode) => {
    // console.log('send verify email');
    // console.log(actionCode);
    doVerifyEmail(actionCode)
      .then(() => {
        // console.log('success verify email');
        const authUser = JSON.parse(localStorage.getItem('authUser'));
        authUser.emailVerified = true;
        TagManager.dataLayer({
          dataLayer: {
            event: 'newEmailVerified',
            eventProps: {
              email: authUser.name,
              name: authUser.name,
            },
          },
        });
        localStorage.setItem('authUser', JSON.stringify(authUser));
        setIsVerified(true);
        setInfo({ state: 'success', message: 'Email address has been verified.' });
      })
      .catch((error) => {
        console.log(error);
        setInfo({ state: 'error', message: error.message });
      });
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('oobCode');
    const action = url.searchParams.get('mode');

    if (action === 'resetPassword' && code !== '') {
      setMode(action);
      doVerifyPasswordResetCode(code)
        .then((email) => {
          setActionCode(code);
          setEmail(email);
          setResetCodeVerified(true);
        })
        .catch((error) => {
          setInfo({ state: 'error', message: error.message });
        });
    } else if (action === 'verifyEmail') {
      setActionCode(code);
      setMode(action);
      verifyAccount(code);
    } else {
      setInfo({ state: 'error', message: 'Invalid reset Url' });
    }
  }, []);

  if (isVerified)
    return (
      <Grid className={classes.rootWelcome} container>
        <Grid
          className={classes.leftGrid}
          item
          md={6}
          xs={12}
          style={{
            backgroundImage: `url(${bg4})`,
          }}
        >
          {/* <Box className="overlay"></Box> */}
        </Grid>
        <Grid className={classes.rightGrid} item md={6} xs={12}>
          <Grid className={classes.content} container direction="column" alignItems="start">
            <Typography variant="h3" color="secondary">
              Welcome to
            </Typography>
            <Typography variant="h2" color="secondary">
              NextHuman
            </Typography>
            <Button
              className={classes.signBtn}
              variant="contained"
              data-testid="btnsignIn"
              color={'secondary'}
              onClick={(e) => signIn(e)}
              size="large"
            >
              SIGN IN
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  else
    return (
      <AuthLayout
        background={!isConfirmReset && mode === 'resetPassword' ? `url(${bg2})` : `url(${bg1})`}
      >
        <Grid item container xs={12} className={classes.form} spacing={4}>
          {isResetCodeVerified && !isConfirmReset && mode === 'resetPassword' && (
            <>
              <Grid item>
                <Typography variant="h3" color="secondary" className={classes.title}>
                  New Password
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id={'Password'}
                  label="Password"
                  type="password"
                  error={isSubmitted && !formData.password.validate}
                  value={formData.password.value}
                  fullWidth
                  variant="outlined"
                  placeholder="Set a password"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: {
                        ...formData.password,
                        value: e.target.value,
                      },
                    })
                  }
                  helperText={isSubmitted && formData.password.errorMsg}
                  inputProps={{ 'data-testid': 'password' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id={'ConfirmPassword'}
                  label="Confirm Password"
                  value={formData.confirmPassword.value}
                  error={isSubmitted && !formData.confirmPassword.validate}
                  type="password"
                  fullWidth
                  variant="outlined"
                  placeholder="Repeat password again"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: {
                        ...formData.confirmPassword,
                        value: e.target.value,
                      },
                    })
                  }
                  inputProps={{ 'data-testid': 'password2' }}
                  helperText={isSubmitted && formData.confirmPassword.errorMsg}
                />
              </Grid>
              <Grid item container xs={12} justify="space-between" className={classes.actions}>
                <Button
                  variant="contained"
                  color="secondary"
                  data-testid="btnReset"
                  onClick={resetPassword}
                  size="large"
                >
                  RESET
                </Button>
              </Grid>
            </>
          )}
          {isConfirmReset && (
            <>
              <Grid item>
                <Typography variant="h3" color="secondary" className={classes.title}>
                  Password reset successful
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  NextHuman elementum tellus commodo. Volutpat maur egestas auctor dolor lacus
                  magnis turpis pulvinar ibero quis adipiscing.
                </Typography>
              </Grid>
              <Grid item container xs={12} justify="space-between" className={classes.actions}>
                <Button
                  variant="contained"
                  data-testid="btnsignIn"
                  color={'secondary'}
                  onClick={signIn}
                  size="large"
                >
                  SIGN IN
                </Button>
              </Grid>
            </>
          )}
        </Grid>
      </AuthLayout>
    );
};
