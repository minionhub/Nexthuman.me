import React, { useState, useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  makeStyles,
  Grid,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from '@material-ui/core';
import MUILink from '@material-ui/core/Link';
import Alert from '@material-ui/lab/Alert';
import TextField from '../components/form/TextField';
import { Button } from '../components/form/Buttons';
import {
  doCreateUserWithEmailAndPassword,
  doSendEmailVerification,
} from '../services/auth/auth.firebase';
import { emailValidation } from '../utils';
import users from '../store/actions/users';
import AuthLayout from '../components/AuthLayout';
import routes from '../constants/routes.json';
import bg3 from '../img/signup.jpg';
import bg1 from '../img/left_bg_1.jpg';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  title: {
    paddingBottom: '24px',
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
      padding: '15px 40px',
      '@media (max-width:780px)': {
        width: '100%',
        margin: '10px 0px',
      },
    },
  },
});

export default () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const [submitted, setSubmitted] = useState(false);
  const [signupFormData, setSignupFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [emailError, setEmailError] = useState(false);
  const [passwordMatchError, setPassowrdMatchError] = useState(true);

  const [role, setRole] = useState('');
  const [info, setInfo] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    setEmailError(signupFormData.email === '' || !emailValidation(signupFormData.email));
    setPassowrdMatchError(
      signupFormData.password !== signupFormData.confirmPassword ||
        signupFormData.password.length < 6
    );
  }, [signupFormData]);

  const createUser = (uid, data) => dispatch(users.createUser(uid, data));
  const signUp = () => {
    setSubmitted(true);
    if (
      signupFormData.name.length === 0 ||
      emailError ||
      passwordMatchError ||
      !signupFormData.agreeTerms
    ) {
      return;
    }

    doCreateUserWithEmailAndPassword(signupFormData.email, signupFormData.password)
      .then((authUser) => {
        return createUser(authUser.user.uid, {
          name: signupFormData.name,
          email: signupFormData.email,
        });
      })
      .then(() => {
        return doSendEmailVerification();
      })
      .then(() => {
        setInfo({ state: 'success', message: 'Signup was success. Please check email' });
        setIsSignUp(true);
      })
      .catch((error) => {
        setInfo({ state: 'error', message: error.message });
      });
    return false;
  };

  const signIn = (e) => {
    e.preventDefault();
    history.push('/sign_in');
    return false;
  };
  const onKeyEvent = (e) => {
    if (e.keyCode === 13 && !emailError) {
      signUp();
    }
  };
  const cancel = () => {
    history.goBack();
  };

  return (
    <AuthLayout background={!isSignUp ? `url(${bg3})` : `url(${bg1})`}>
      <Grid item container xs={12} className={classes.form} spacing={4} data-testid="signupForm">
        {!isSignUp && (
          <>
            <Grid item>
              <Typography variant="h3" color="secondary" className={classes.title}>
                Sign up
              </Typography>
            </Grid>
            {info && (
              <Grid item>
                {' '}
                <Alert severity={info.state} data-testid="alert">
                  {info.message}
                </Alert>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                id={'UserName'}
                label="Full name"
                error={submitted && signupFormData.name.length === 0}
                value={signupFormData.name}
                fullWidth
                color="secondary"
                variant="outlined"
                placeholder={'Your full name'}
                onChange={(e) =>
                  setSignupFormData({
                    ...signupFormData,
                    name: e.target.value,
                  })
                }
                onKeyDown={(e) => onKeyEvent(e)}
                inputProps={{ 'data-testid': 'username' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id={'Email'}
                label="Email"
                error={submitted && emailError}
                value={signupFormData.email}
                color="secondary"
                fullWidth
                variant="outlined"
                placeholder={'Your email address'}
                onChange={(e) =>
                  setSignupFormData({
                    ...signupFormData,
                    email: e.target.value,
                  })
                }
                onKeyDown={(e) => onKeyEvent(e)}
                inputProps={{ 'data-testid': 'email' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                id={'Password'}
                label="Password"
                value={signupFormData.password}
                color="secondary"
                fullWidth
                placeholder={'Set a password'}
                type="password"
                onChange={(e) => {
                  setSignupFormData({
                    ...signupFormData,
                    password: e.target.value,
                  });
                }}
                onKeyDown={(e) => onKeyEvent(e)}
                inputProps={{ 'data-testid': 'password' }}
                error={submitted && signupFormData.password.length < 6}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id={'ConfirmPassword'}
                label="Repeat Password"
                value={signupFormData.confirmPassword}
                error={submitted && passwordMatchError}
                type="password"
                color="secondary"
                fullWidth
                variant="outlined"
                placeholder={'Repeat password again'}
                onChange={(e) =>
                  setSignupFormData({
                    ...signupFormData,
                    confirmPassword: e.target.value,
                  })
                }
                onKeyDown={(e) => onKeyEvent(e)}
                inputProps={{ 'data-testid': 'password2' }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl required error={submitted && !signupFormData.agreeTerms}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={signupFormData.agreeTerms}
                      onChange={(e) => {
                        setSignupFormData({
                          ...signupFormData,
                          agreeTerms: e.target.checked,
                        });
                      }}
                      name="agreeTerms"
                      color={'secondary'}
                      data-testid="checkbox-agreeTerms"
                    />
                  }
                  label={
                    <Typography variant="caption">
                      Accept our{' '}
                      <MUILink
                        href="#"
                        color="secondary"
                        onClick={() => {
                          history.push(routes.TERMS);
                        }}
                      >
                        terms of use and conditions
                      </MUILink>
                    </Typography>
                  }
                />
                {submitted && !signupFormData.agreeTerms && (
                  <FormHelperText id="my-helper-text">
                    Please accept our terms of use and conditions
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item container xs={12} justify="space-between" className={classes.actions}>
              <Button variant="outlined" color="secondary" onClick={cancel} size="large">
                CANCEL
              </Button>
              <Button
                variant="contained"
                data-testid="btnSignup"
                color={'primary'}
                onClick={signUp}
                size="large"
              >
                SIGN UP
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                Already an account?{' '}
                <MUILink
                  data-testid={'signin-link'}
                  onClick={(e) => signIn(e)}
                  color="secondary"
                  variant="body1"
                >
                  Sign In
                </MUILink>
              </Typography>
            </Grid>
          </>
        )}
        {isSignUp && (
          <>
            <Grid item>
              <Typography
                variant="h3"
                color="secondary"
                className={classes.title}
                data-testid="verifyTitle"
              >
                Verify account
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                NextHuman elementum tellus commodo. Volutpat maur egestas auctor dolor lacus magnis
                turpis pulvinar ibero quis adipiscing.
              </Typography>
            </Grid>
          </>
        )}
      </Grid>
    </AuthLayout>
  );
};
