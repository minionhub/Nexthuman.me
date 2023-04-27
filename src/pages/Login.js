import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Button } from '../components/form/Buttons';
import { useHistory } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import MUILink from '@material-ui/core/Link';
import TagManager from 'react-gtm-module';
import TextField from '../components/form/TextField';
import {
  doSignInWithEmailAndPassword,
  doSendEmailVerification,
} from '../services/auth/auth.firebase';
import { emailValidation } from '../utils';
import bg from '../img/left_bg.jpg';
import routes from '../constants/routes.json';
import AuthLayout from '../components/AuthLayout';

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
        flexDirection: 'column-reverse',
      },
    },
  },
});

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';

const ERROR_MSG_ACCOUNT_EXISTS = `
An account with this E-Mail address already exists.
Try to login with this account instead. If you think the
account is already used from one of the social logins, try
to sign in with one of them. Afterward, associate your accounts
on your personal account page.
`;

export default () => {
  return (
    <AuthLayout background={`url(${bg})`}>
      <SignInForm />
    </AuthLayout>
  );
};

const SignInForm = () => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState(null);
  const emailError = email !== '' && !emailValidation(email);
  const isInvalid = password === '' || email === '' || !emailValidation(email);
  const history = useHistory();

  const signIn = () => {
    doSignInWithEmailAndPassword(email, password)
      .then((user) => {
        if (user.emailVerified == false) {
          setError({ code: 'unverified', message: 'This email is not verified.' });
          doSendEmailVerification()
            .then(() => {
              setError(null);
              setInfo({ message: 'Verification email was sent. Please confirm email!' });
            })
            .catch((error) => {
              setError(error);
            });
          return;
        }
        TagManager.dataLayer({
          dataLayer: {
            event: 'login',
            userId: user.uid,
          },
        });
        const redirectTo = localStorage.getItem('redirectTo');
        const path = redirectTo ? redirectTo : routes.ROOT;
        localStorage.removeItem('redirectTo');
        window.location.href = path;
      })
      .catch((error) => {
        console.log(error);
        setError(error);
      });
    return false;
  };
  const onKeyEvent = (e) => {
    if (e.keyCode === 13 && !isInvalid) {
      signIn();
    }
  };
  const forgotPassword = (e) => {
    e.preventDefault();
    localStorage.setItem('forgotEmail', email);
    history.push(routes.FORGOTPASSWORD);
    return false;
  };
  const signUp = (e) => {
    e.preventDefault();
    history.push(routes.SIGNUP);
  };
  const cancel = () => {
    history.goBack();
  };
  return (
    <Grid
      item
      container
      xs={12}
      className={classes.form}
      spacing={4}
      data-testid="loginForm"
      direction="column"
    >
      <Grid item>
        <Typography variant="h3" color="secondary" className={classes.title}>
          Sign in
        </Typography>
      </Grid>
      {info && (
        <Grid item>
          <Alert severity={'success'} data-testid="success">
            {info.message}
          </Alert>
        </Grid>
      )}
      {error && error.code !== 'unverified' && (
        <Grid item>
          <Alert severity={'error'} data-testid="alert">
            {error.message}
          </Alert>
        </Grid>
      )}
      <Grid item xs={12}>
        <TextField
          variant="outlined"
          id={'Email'}
          label="Email"
          color="secondary"
          value={email}
          required
          fullWidth
          placeholder={'Your email address'}
          error={!!emailError}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => onKeyEvent(e)}
          inputProps={{ 'data-testid': 'email' }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          variant="outlined"
          id={'Password'}
          label="Password"
          value={password}
          required
          color="secondary"
          fullWidth
          placeholder={'Set a password'}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => onKeyEvent(e)}
          inputProps={{ 'data-testid': 'password' }}
        />
      </Grid>
      <Grid item container xs={12} justify="space-between" className={classes.actions}>
        <Button variant="outlined" color="secondary" onClick={cancel} size="large">
          CANCEL
        </Button>
        <Button
          variant="contained"
          color="secondary"
          data-testid="btnLogin"
          disabled={isInvalid}
          onClick={signIn}
          size="large"
        >
          SIGN IN
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Typography>
          <MUILink
            data-testid={'forgot-link'}
            href="#"
            variant="body1"
            color="secondary"
            onClick={(e) => forgotPassword(e)}
          >
            Forgot password?
          </MUILink>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">
          Don't have an account?{' '}
          <MUILink
            href="#"
            data-testid={'signup-link'}
            onClick={(e) => signUp(e)}
            color="secondary"
            variant="body1"
          >
            Sign up
          </MUILink>
        </Typography>
      </Grid>
    </Grid>
  );
};
