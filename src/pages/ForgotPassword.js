import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '../components/form/TextField';
import { Button } from '../components/form/Buttons';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { doPasswordReset } from '../services/auth/auth.firebase';
import { emailValidation } from '../utils';
import AuthLayout from '../components/AuthLayout';
import bg from '../img/left_bg_forgot.jpg';
import bg1 from '../img/left_bg_1.jpg';
import routes from '../constants/routes.json';
const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  title: {
    paddingBottom: '10px',
    '@media (max-width:960px)': {
      paddingBottom: 0,
      fontWeight: 'normal',
      fontSize: '34px',
      lineHeight: '41px',
      letterSpacing: '0.25px',
    },
  },
  form: {
    maxWidth: '450px',
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

  const [emailForm, setEmailForm] = useState({
    value: '',
    validate: true,
    errorMsg: '',
  });
  const [isSubmitted, setSubmitted] = useState(false);

  const [isEmailSent, setIsEmailSent] = useState(false);
  const [info, setInfo] = useState(null);
  const history = useHistory();

  if (emailForm.value == '' && localStorage.getItem('forgotEmail')) {
    setEmailForm({
      value: localStorage.getItem('forgotEmail'),
      validate: true,
      errorMsg: '',
    });
  }

  const sendLink = () => {
    setSubmitted(true);

    const validate = emailValidation(emailForm.value);
    setEmailForm({
      ...emailForm,
      errorMsg:
        emailForm.value.length === 0
          ? 'This field is required.'
          : !validate
          ? 'Please input valid email.'
          : '',
      validate: validate,
    });

    if (!validate) return;

    doPasswordReset(emailForm.value)
      .then(() => {
        setIsEmailSent(true);
        setInfo({
          state: 'success',
          message:
            'We sent the reset email successfully! \n Please check the email to reset password!',
        });
      })
      .catch((error) => {
        setInfo({ state: 'error', message: error.message });
      });
  };

  const onKeyEvent = (e) => {
    if (e.keyCode === 13) {
      sendLink();
    }
  };

  const cancel = () => {
    history.goBack();
  };

  return (
    <AuthLayout background={`url(${isEmailSent ? bg1 : bg})`}>
      <Grid item container xs={12} className={classes.form} spacing={4} data-testid="forgotForm">
        <Grid item>
          <Typography variant="h3" color="secondary" className={classes.title}>
            {isEmailSent ? 'Check your email' : 'Forgot password'}
          </Typography>
        </Grid>
        {info && !isEmailSent && (
          <Grid item>
            <Alert severity={info.state} data-testid="alert">
              {info.message}
            </Alert>
          </Grid>
        )}

        {!isEmailSent && (
          <>
            <Grid item xs={12}>
              <TextField
                id={'Email'}
                label="Email"
                value={emailForm.value}
                error={isSubmitted && !emailForm.validate}
                fullWidth
                placeholder="Your email address"
                onChange={(e) =>
                  setEmailForm({
                    ...emailForm,
                    value: e.target.value,
                  })
                }
                onKeyDown={(e) => onKeyEvent(e)}
                inputProps={{ 'data-testid': 'email' }}
                helperText={emailForm.errorMsg}
              />
            </Grid>
            <Grid item xs={12} container justify="space-between" className={classes.actions}>
              <Button variant="outlined" color="secondary" onClick={cancel} size="large">
                CANCEL
              </Button>
              <Button
                variant="contained"
                color="secondary"
                data-testid="btnForgot"
                onClick={sendLink}
                size="large"
              >
                REQUEST
              </Button>
            </Grid>
          </>
        )}
        {isEmailSent && (
          <Grid item xs={12} className={classes.actions}>
            <Typography variant="body1">
              NextHuman elementum tellus commodo. Volutpat maur egestas auctor dolor lacus magnis
              turpis pulvinar ibero quis adipiscing.
            </Typography>
          </Grid>
        )}
      </Grid>
    </AuthLayout>
  );
};
