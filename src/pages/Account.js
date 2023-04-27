import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography, Divider, IconButton, Link, Box, CircularProgress } from '@material-ui/core';
import { Button } from '../components/form/Buttons';
import Alert from '@material-ui/lab/Alert';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import GetAppIcon from '@material-ui/icons/GetApp';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import TextField from '../components/form/TextField';
import DateField from '../components/form/DateField';
import Modal from '../components/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import users from '../store/actions/users';
import MuiPhoneInput from 'material-ui-phone-number';
import dateUtils from '../utils/date';
import { emailValidation } from '../utils';
import AutocompleteField from '../components/form/AutocompleteField';
import ProducerCard from '../components/ProducerCard';
import DownloadIcon from '@material-ui/icons/GetApp';
import eventActions from '../store/actions/events';
import { PDFDownloadLink } from '@react-pdf/renderer';
import TicketPDF from '../components/TicketPDF';

import {
  doUpdateEmail,
  doSendEmailVerification,
  doUpdatePassword,
  reAuthenticate,
  doSignOut,
  doRemoveUser,
} from '../services/auth/auth.firebase';
import theme from '../theme';
const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    minHeight: '100vh',
  },
  form: {
    maxWidth: 1440,
    padding: '20px 20px',
    maxWidth: '1440px',
    [theme.breakpoints.up('sm')]: {
      padding: '60px  20px',
    },
    [theme.breakpoints.up('md')]: {
      padding: '60px  40px',
    },
    [theme.breakpoints.up('lg')]: {
      padding: '60px  160px',
    },
    backgroundColor: '#fff',
  },
  tabContainer: {
    padding: '40px 0px',
    width: '100%',
  },
  tabs: {
    margin: '40px 0px',
    [theme.breakpoints.down('sm')]: {
      margin: '20px 0px',
      width: '100%',
    },
    '& .Mui-selected': {
      backgroundColor: '#FAFAFA',
    },
  },
  tab: {
    fontFamily: 'Fira Sans',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '18px',
    lineHeight: '21.6px',
    textTransform: 'none',
    [theme.breakpoints.down('sm')]: {
      width: '50%',
    },
  },
  actions: {
    '& button': {
      padding: '15px 40px',
      '@media (max-width:780px)': {
        // eslint-disable-line no-useless-computed-key
        width: '100%',
        margin: '10px 0px',
      },
    },
  },
  deleteBtn: {
    color: theme.palette.additional,
  },
  signoutBtn: {
    float: 'right',
  },
  action: {
    padding: '15px 40px',
  },
  buttons: {
    marginTop: '40px',
  },
  backBtn: {
    padding: '16px 60px',
  },

  contentTitle: {
    //styleName: H5;
    fontFamily: 'Fira Sans',
    fontSize: '24px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '29px',
    letterSpacing: '0px',
    textAlign: 'center',
    '@media (min-width:1024px)': {
      // eslint-disable-line no-useless-computed-key
      fontFamily: 'Fira Sans',
      fontSize: '48px',
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: '57.6px',
      letterSpacing: '0px',
      textAlign: 'center',
    },
  },
  resendlink: {
    marginTop: '80px',
  },
  mailIcon: {
    width: '154px',
    height: '126px',
  },
  emailSentInfo: {
    fontFamily: 'Fira Sans',
    fontSize: '24px',
    color: '#333333',
    lineHeight: 1.3,
    '@media (min-width:1024px)': {
      // eslint-disable-line no-useless-computed-key
      fontSize: '18px',
    },
  },
  email: {
    color: theme.palette.secondary.main,
  },
  ticketContainer: {
    padding: '34px 0',
    marginBottom: 40,
    borderTop: '1px solid rgba(51, 51, 51, 0.12)',
    borderBottom: '1px solid rgba(51, 51, 51, 0.12)',
  },
  ticketTitle: {
    fontSize: 24,
    lineHeight: '29px',
    fontWeight: 'normal',
    marginBottom: 21,
  },
  ticketDetails: {
    [theme.breakpoints.down('sm')]: {
      marginBottom: 25,
    },
  },
  ticketDetail: {
    width: '100%',
    fontSize: 17,
    lineHeight: '24px',
    color: '#333333',
  },
});

const validationSchema = yup.object().shape({
  name: yup.string().required('Title is required'),
  birthday: yup.date().max(moment(), 'Date of birth cannot be in the past'),
});
const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';
const INVALID_EMAIL = 'auth/invalid-email';
const REQUIRED_RECENT_LOGIN = 'auth/requires-recent-login';
function countryToFlag(isoCode) {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode
        .toUpperCase()
        .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
}
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}
export default () => {
  const classes = useStyles();
  const history = useHistory();
  const { userId } = useParams();
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [basicEdit, setBasicEdit] = useState(false);
  const [emailEdit, setEmailEdit] = useState(false);
  const [passwordEdit, setPasswordEdit] = useState(false);
  const [tempUser, setTempUser] = useState({});
  const [birthday, setBirthday] = useState(moment());
  const [email, setEmail] = useState('');
  const [emailOld, setEmailOld] = useState('');
  const [password, setPassword] = useState('');
  const [oldpassword, setOldPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [successes, setSuccesses] = useState({});
  const [country, setCountry] = useState('');
  const [isOpenedDeleteModal, setIsOpenedDeleteModal] = useState(false);
  const [isOpenedEmailModal, setIsOpenedEmailModal] = useState(false);
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };
  const handleCloseDeleteModal = () => {
    setIsOpenedDeleteModal(false);
  };
  const dispatch = useDispatch();
  useFirestoreConnect([
    {
      collection: 'users',
      doc: userId,
    },
  ]);

  const getTickets = (uid) => dispatch(eventActions.getTickets(uid));

  const setAuthUserToStore = (authUser) => dispatch(users.setAuthUser(authUser));
  const deleteUser = (uid) => dispatch(users.deleteUser(uid));
  const user = useSelector(
    (state) => state.firestore.data.users && state.firestore.data.users[userId]
  );
  const updateUser = (uid, data) => dispatch(users.updateUser(uid, data));
  const editBasicMode = () => {
    setTempUser({
      ...tempUser,
      name: user.name,
      address1: user.address1 ? user.address1 : '',
      zipcode: user.zipcode ? user.zipcode : '',
      country: user.country ? user.country : '',
      address2: user.address2 ? user.address2 : '',
      city: user.city ? user.city : '',
      phone: user.phone ? user.phone : '',
    });
    setBasicEdit(true);
  };
  const editEmailMode = () => {
    setEmail(user.email);
    setEmailOld(user.email);
    setEmailEdit(true);
  };
  const logOut = () => {
    doSignOut().then(() => {
      localStorage.clear();
      setAuthUserToStore(null);
      window.href = '/';
    });
  };
  const doValidation = () => {
    try {
      validationSchema.validateSync(
        { ...tempUser, birthday: moment(birthday) },
        {
          abortEarly: false,
          recursive: true,
          stripUnknown: true,
        }
      );
      setErrors({});
      return true;
    } catch (e) {
      console.log(e.inner.reduce((result, err) => ({ ...result, [err.path]: err }), {}));
      setErrors(e.inner.reduce((result, err) => ({ ...result, [err.path]: err }), {}));
      return false;
    }
  };
  const saveBasicInfo = () => {
    const valid = doValidation();
    if (valid) {
      // console.log(tempUser);
      updateUser(userId, { ...tempUser, birthday: birthday.utc().format() }).then(() => {
        setBasicEdit(false);
      });
    }
  };
  const saveEmail = async () => {
    if (!emailValidation(email)) {
      setErrors({ email: { message: 'Invalid email' } });
      return;
    }
    if (email == emailOld) {
      setEmailEdit(false);
      return;
    }
    if (password != '') {
      reAuthenticate(user.email, password)
        .then(() => {
          // console.log('reauthenticated');
          updateEmail(email);
        })
        .catch((error) => {
          if (error.code === 'auth/user-mismatch') {
            setErrors({
              result: { type: 'email', code: REQUIRED_RECENT_LOGIN, message: "User doesn't match" },
            });
          } else if (error.code == 'auth/user-not-found') {
            setErrors({
              result: { type: 'email', code: REQUIRED_RECENT_LOGIN, message: 'User not found' },
            });
          } else if (error.code == 'auth/invalid-credential') {
            setErrors({
              result: { type: 'email', code: REQUIRED_RECENT_LOGIN, message: 'Invalid credential' },
            });
          } else if (error.code == 'auth/invalid-email') {
            setErrors({
              result: {
                type: 'email',
                code: REQUIRED_RECENT_LOGIN,
                message: 'Invalid email address',
              },
            });
          } else if (error.code == 'auth/wrong-password') {
            setErrors({
              result: { type: 'email', code: REQUIRED_RECENT_LOGIN, message: 'Wrong password' },
            });
          } else if (error.code == 'auth/invalid-verification-code') {
            setErrors({
              result: {
                type: 'email',
                code: REQUIRED_RECENT_LOGIN,
                message: 'Invalid verification code',
              },
            });
          } else if (error.code == 'auth/invalid-verification-id') {
            setErrors({
              result: {
                type: 'email',
                code: REQUIRED_RECENT_LOGIN,
                message: 'Invalid verification id',
              },
            });
          }
        });
    } else {
      updateEmail(email);
    }
  };
  const updateEmail = (email) => {
    doUpdateEmail(email)
      .then(() => {
        doSendEmailVerification()
          .then(() => {
            setEmailEdit(false);
            setErrors(null);
            setIsOpenedEmailModal(true);
            // setSuccesses({email: {message: 'Email address was updated. Please verify your email address and save again!'}});
          })
          .catch((err) => {
            setErrors({
              result: { type: 'email', message: 'Error while sending verification email.' },
            });
          });
        // setTimeout(() => {
        //     logOut();
        // }, 1500);
      })
      .catch((error) => {
        console.log(error.code);
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          setErrors({ result: { type: 'email', message: 'This email is already in use' } });
        } else if (error.code == INVALID_EMAIL) {
          setErrors({ result: { type: 'email', message: 'Invalid email' } });
        } else if (error.code == REQUIRED_RECENT_LOGIN) {
          setErrors({
            result: {
              type: 'email',
              code: error.code,
              message: 'This requires recent signin. Please type password and save again.',
            },
          });
        }
      });
  };
  const savePassword = () => {
    if (password != confirmPassword) {
      setErrors({ password: { message: "Password doesn't match" } });
      return;
    }
    if (oldpassword != '') {
      reAuthenticate(user.email, oldpassword)
        .then(() => {
          console.log('reauthenticated');
          updatePassword(password);
        })
        .catch((error) => {
          if (error.code === 'auth/user-mismatch') {
            setErrors({
              result: {
                type: 'password',
                code: REQUIRED_RECENT_LOGIN,
                message: "User doesn't match",
              },
            });
          } else if (error.code == 'auth/user-not-found') {
            setErrors({
              result: { type: 'password', code: REQUIRED_RECENT_LOGIN, message: 'User not found' },
            });
          } else if (error.code == 'auth/invalid-credential') {
            setErrors({
              result: {
                type: 'password',
                code: REQUIRED_RECENT_LOGIN,
                message: 'Invalid credential',
              },
            });
          } else if (error.code == 'auth/invalid-email') {
            setErrors({
              result: {
                type: 'password',
                code: REQUIRED_RECENT_LOGIN,
                message: 'Invalid email address',
              },
            });
          } else if (error.code == 'auth/wrong-password') {
            setErrors({
              result: { type: 'password', code: REQUIRED_RECENT_LOGIN, message: 'Wrong password' },
            });
          } else if (error.code == 'auth/invalid-verification-code') {
            setErrors({
              result: {
                type: 'password',
                code: REQUIRED_RECENT_LOGIN,
                message: 'Invalid verification code',
              },
            });
          } else if (error.code == 'auth/invalid-verification-id') {
            setErrors({
              result: {
                type: 'password',
                code: REQUIRED_RECENT_LOGIN,
                message: 'Invalid verification id',
              },
            });
          }
        });
    } else {
      updatePassword(password);
    }
  };

  const updatePassword = (password) => {
    doUpdatePassword(password)
      .then(() => {
        setPasswordEdit(false);
        setErrors(null);
        setPassword('');
        setSuccesses({ password: { message: 'Password was changed!' } });
        setTimeout(() => {
          setSuccesses(null);
        }, 2000);
        setOldPassword('');
      })
      .catch((error) => {
        if (error.code == 'auth/weak-password')
          setErrors({ result: { type: 'password', message: 'Password is too weak!' } });
        if (error.code == 'auth/requires-recent-login')
          setErrors({
            result: {
              type: 'password',
              code: error.code,
              message: 'This requires recent signin. Please type current password and save again.',
            },
          });
      });
  };
  const deleteAccount = () => {
    doRemoveUser()
      .then(() => {
        deleteUser(userId)
          .then(() => {
            logOut();
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        if (error.code == 'auth/requires-recent-login') {
          console.log('error');
          setErrors({
            result: { type: 'deleteAccount', message: 'This action requires recent sign in' },
          });
        }
      });
  };
  const verifyAccount = () => {
    doSendEmailVerification()
      .then(() => {
        setSuccesses({
          email: {
            message: 'Email address was updated. Please verify your email address and save again!',
          },
        });
      })
      .catch((err) => {
        setErrors({
          result: { type: 'email', message: 'Error while sending verification email.' },
        });
      });
  };
  const openDeleteModal = () => {
    setIsOpenedDeleteModal(true);
  };
  const handleCloseEmailModal = () => {
    setEmailEdit(false);
    setErrors(null);
    setIsOpenedEmailModal(false);
  };

  useEffect(() => {
    if (tickets.length <= 0) {
      setLoadingTickets(true);
      getTickets(userId).then((tickets) => {
        // console.log(tickets);
        setLoadingTickets(false);
        setTickets(tickets);
      });
    }
  }, [userId]);

  return (
    <>
      <Grid container className={classes.root} justify="center">
        <Grid container className={classes.form} spacing={0} direction="column" alignItems="center">
          <Tabs
            value={value}
            indicatorColor="secondary"
            textColor="secondary"
            onChange={handleTabChange}
            centered
            className={classes.tabs}
            aria-label="My account and tickets"
          >
            <Tab label="My Account" {...a11yProps(0)} className={classes.tab} />
            <Tab label="My Tickets" {...a11yProps(1)} className={classes.tab} />
          </Tabs>
          <TabPanel value={value} index={0} dir={theme.direction} className={classes.tabContainer}>
            <Grid container direction="column" justify="flex-start" spacing={4}>
              {user && (
                <>
                  {!basicEdit && (
                    <Grid item container direction="column" spacing={3}>
                      <Grid item container direction="row" xs={12} alignItems="center" spacing={1}>
                        <Grid item>
                          <Typography variant="h6" color="primary">
                            Basic Information
                          </Typography>
                        </Grid>
                        <Grid item>
                          <IconButton
                            aria-label="edit"
                            size="small"
                            onClick={() => editBasicMode()}
                            data-testid="button-edit-basic"
                          >
                            <EditOutlinedIcon color="secondary" />
                          </IconButton>
                        </Grid>
                      </Grid>

                      <Grid item container direction="row" spacing={2}>
                        <Grid item container direction="column" xs={12} sm={4} spacing={2}>
                          <Grid item>
                            <Typography variant="h6" color="secondary">
                              Name
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="body1" data-testid="label-username">
                              {user.name}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item container direction="column" xs={12} sm={8} spacing={2}>
                          <Grid item>
                            <Typography variant="h6" color="secondary">
                              Date of Birth
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="body1" data-testid="label-birthday">
                              {dateUtils.format({ date: user.birthday })}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item container direction="column" spacing={2}>
                        <Grid item>
                          <Typography variant="h6" color="secondary">
                            Address
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="body1" data-testid="label-address1">
                            {user.address1}
                          </Typography>
                          <Typography
                            variant="body1"
                            style={{ marginTop: '10px' }}
                            data-testid="label-address2-zipcode"
                          >
                            {user.address2} {user.city} {user.zipcode}{' '}
                            {user.country && user.country.label}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item container direction="column" spacing={2}>
                        <Grid item>
                          <Typography variant="h6" color="secondary">
                            Contact
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="body1" data-testid="label-phone">
                            {user.phone}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                  {basicEdit && (
                    <Grid item container direction="column" spacing={3}>
                      <Grid item container direction="row" xs={12} alignItems="center" spacing={1}>
                        <Grid item>
                          <Typography variant="h6" color="primary">
                            Basic Information
                          </Typography>
                        </Grid>
                      </Grid>

                      <Grid item container direction="row" spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            data-testid="textfield-username"
                            variant="outlined"
                            name="name"
                            fullWidth
                            value={tempUser.name}
                            error={errors && !!errors.name}
                            helperText={errors && !!errors.name && errors.name.message}
                            label="Name*"
                            onChange={(e) => {
                              setTempUser({ ...tempUser, name: e.target.value });
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <DateField
                            data-testid="datefield-birthday"
                            fullWidth
                            label="Date Of Birth"
                            variant="outlined"
                            value={birthday}
                            error={errors && !!errors.birthday}
                            helperText={errors && !!errors.birthday && errors.birthday.message}
                            format="D MMM YYYY"
                            disablePast={false}
                            onChange={(value) => setBirthday(value)}
                          />
                        </Grid>
                      </Grid>
                      <Grid item container direction="column" spacing={2}>
                        <Grid item>
                          <Typography variant="h6" color="secondary">
                            Address
                          </Typography>
                        </Grid>
                        <Grid item container direction="row" spacing={2}>
                          <Grid item container direction="column" xs={12} sm={4}>
                            <Grid item>
                              <TextField
                                data-testid="textfield-address1"
                                variant="outlined"
                                name="address1"
                                fullWidth
                                value={tempUser.address1}
                                label="Street Address 1"
                                onChange={(e) => {
                                  setTempUser({ ...tempUser, address1: e.target.value });
                                }}
                              />
                            </Grid>
                            <Grid item style={{ marginTop: '16px' }}>
                              <TextField
                                data-testid="textfield-address2"
                                variant="outlined"
                                name="address2"
                                fullWidth
                                value={tempUser.address2}
                                label="Street Address 2"
                                onChange={(e) => {
                                  setTempUser({ ...tempUser, address2: e.target.value });
                                }}
                              />
                            </Grid>
                          </Grid>
                          <Grid item container direction="column" xs={12} sm={8}>
                            <Grid item container direction="row" spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  data-testid="textfield-zipcode"
                                  variant="outlined"
                                  name="zipcode"
                                  fullWidth
                                  value={tempUser.zipcode}
                                  label="Zip Code"
                                  onChange={(e) => {
                                    setTempUser({ ...tempUser, zipcode: e.target.value });
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <AutocompleteField
                                  data-testid="autocompletefield-country"
                                  fullWidth
                                  label="Country*"
                                  color="secondary"
                                  options={countries}
                                  getOptionLabel={(option) => option.label}
                                  value={tempUser.country}
                                  renderOption={(option) => option.label}
                                  onChange={(value) => {
                                    setTempUser({ ...tempUser, country: value });
                                    setCountry(value);
                                  }}
                                />
                                {/* <TextField
                                                            data-testid="textfield-country"
                                                            variant="outlined"
                                                            name="Country"
                                                            fullWidth
                                                            value={tempUser.country}
                                                            label="Country"
                                                            onChange={e => {setTempUser({...tempUser, country: e.target.value})}}
                                                        />             */}
                              </Grid>
                            </Grid>
                            <Grid item container direction="row" spacing={2}>
                              <Grid item xs={12} sm={6} style={{ marginTop: '16px' }}>
                                <TextField
                                  data-testid="textfield-city"
                                  variant="outlined"
                                  name="city"
                                  fullWidth
                                  value={tempUser.city}
                                  label="City"
                                  onChange={(e) => {
                                    setTempUser({ ...tempUser, city: e.target.value });
                                  }}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item container direction="column" spacing={2}>
                        <Grid item>
                          <Typography variant="h6" color="secondary">
                            Contact
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <MuiPhoneInput
                            defaultCountry="us"
                            onChange={(value) => {
                              setTempUser({ ...tempUser, phone: value });
                            }}
                            data-testid="textfield-phone"
                            variant="outlined"
                            name="phone"
                            label="Phone"
                            fullWidth
                            value={tempUser.phone}
                            label="Phone"
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        container
                        justify="space-between"
                        className={classes.buttons}
                      >
                        <Grid item>
                          <Button
                            variant="outlined"
                            color="secondary"
                            size="large"
                            className={classes.action}
                            data-testid="button-discard-basic"
                            size="large"
                            onClick={() => setBasicEdit(false)}
                          >
                            DISCARD
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            className={classes.action}
                            data-testid="button-save-basic"
                            size="large"
                            onClick={() => saveBasicInfo()}
                          >
                            SAVE
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                  <Grid item>
                    <Divider />
                  </Grid>

                  <Grid item container direction="column" spacing={2}>
                    {!emailEdit && (
                      <Grid item container direction="column" spacing={2}>
                        <Grid
                          item
                          container
                          direction="row"
                          xs={12}
                          alignItems="center"
                          spacing={1}
                        >
                          <Grid item>
                            <Typography variant="h6" color="secondary">
                              Email Address
                            </Typography>
                          </Grid>
                          <Grid item>
                            <IconButton
                              aria-label="edit"
                              size="small"
                              onClick={() => editEmailMode()}
                            >
                              <EditOutlinedIcon color="secondary" />
                            </IconButton>
                          </Grid>
                        </Grid>
                        {successes && !!successes.email && (
                          <Alert severity="success">{successes.email.message}</Alert>
                        )}
                        <Grid item>
                          <Typography variant="body1" data-testid="label-email">
                            {user.email}
                          </Typography>
                        </Grid>
                      </Grid>
                    )}
                    {emailEdit && (
                      <>
                        <Grid item>
                          <Typography variant="h6" color="secondary">
                            Email Address
                          </Typography>
                        </Grid>
                        {!!errors && !!errors.result && errors.result.type == 'email' && (
                          <Grid item>
                            <Alert severity="error">{errors.result.message}</Alert>
                          </Grid>
                        )}
                        <Grid item sm={4}>
                          <TextField
                            data-testid="user-email"
                            variant="outlined"
                            name="email"
                            fullWidth
                            error={errors && !!errors.email}
                            helperText={errors && !!errors.email && errors.email.message}
                            value={email}
                            label="Email Address"
                            onChange={(e) => {
                              setEmail(e.target.value);
                            }}
                          />
                        </Grid>
                        {errors &&
                          !!errors.result &&
                          errors.result.type == 'email' &&
                          errors.result.code &&
                          errors.result.code == REQUIRED_RECENT_LOGIN && (
                            <Grid item sm={4}>
                              <TextField
                                data-testid="user-email-password"
                                variant="outlined"
                                type="password"
                                name="password"
                                fullWidth
                                error={errors && !!errors.password}
                                helperText={errors && !!errors.password && errors.password.message}
                                value={password}
                                label="Password"
                                onChange={(e) => {
                                  setPassword(e.target.value);
                                }}
                              />
                            </Grid>
                          )}

                        <Grid
                          item
                          xs={12}
                          container
                          justify="space-between"
                          className={classes.buttons}
                        >
                          <Grid item>
                            <Button
                              variant="outlined"
                              color="secondary"
                              size="large"
                              className={classes.action}
                              onClick={() => {
                                setEmailEdit(false);
                                setErrors(null);
                              }}
                              size="large"
                              data-testid="discard-email"
                            >
                              DISCARD
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              variant="contained"
                              color="secondary"
                              size="large"
                              className={classes.action}
                              data-testid="save-email"
                              onClick={() => saveEmail()}
                              size="large"
                            >
                              SAVE
                            </Button>
                          </Grid>
                        </Grid>
                      </>
                    )}
                  </Grid>
                  <Grid item>
                    <Divider />
                  </Grid>
                  <Grid item container direction="column" spacing={2}>
                    {!passwordEdit && (
                      <Grid item container direction="column" spacing={2}>
                        <Grid
                          item
                          container
                          direction="row"
                          xs={12}
                          alignItems="center"
                          spacing={1}
                        >
                          <Grid item>
                            <Typography variant="h6" color="secondary">
                              Password
                            </Typography>
                          </Grid>
                          <Grid item>
                            <IconButton
                              aria-label="edit"
                              size="small"
                              onClick={() => {
                                setPassword('');
                                setOldPassword('');
                                setConfirmPassword('');
                                setPasswordEdit(true);
                              }}
                            >
                              <EditOutlinedIcon color="secondary" />
                            </IconButton>
                          </Grid>
                        </Grid>
                        {successes && !!successes.password && (
                          <Alert severity="success">{successes.password.message}</Alert>
                        )}
                        <Grid item>
                          <Typography variant="body1">********</Typography>
                        </Grid>
                      </Grid>
                    )}
                    {passwordEdit && (
                      <>
                        <Grid item>
                          <Typography variant="h6" color="secondary">
                            Password
                          </Typography>
                        </Grid>
                        {errors && !!errors.result && errors.result.type == 'password' && (
                          <Grid item>
                            <Alert severity="error">{errors.result.message}</Alert>
                          </Grid>
                        )}
                        <Grid item sm={4}>
                          <TextField
                            data-testid="user-email-password"
                            variant="outlined"
                            type="password"
                            name="old-password"
                            fullWidth
                            error={errors && !!errors.oldpassword}
                            helperText={
                              errors && !!errors.oldpassword && errors.oldpassword.message
                            }
                            value={oldpassword}
                            label="Current Password"
                            onChange={(e) => {
                              setOldPassword(e.target.value);
                            }}
                          />
                        </Grid>
                        <Grid item container direction="column" spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              data-testid="user-password"
                              variant="outlined"
                              type="password"
                              name="password"
                              fullWidth
                              error={errors && !!errors.password}
                              helperText={errors && !!errors.password && errors.password.message}
                              value={password}
                              label="New Password"
                              onChange={(e) => {
                                setPassword(e.target.value);
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              data-testid="user-reset-password"
                              variant="outlined"
                              type="password"
                              name="resetpassword"
                              fullWidth
                              error={errors && !!errors.password}
                              helperText={errors && !!errors.password && errors.password.message}
                              value={confirmPassword}
                              label="Repeat Password"
                              onChange={(e) => {
                                setConfirmPassword(e.target.value);
                              }}
                            />
                          </Grid>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          container
                          justify="space-between"
                          className={classes.buttons}
                        >
                          <Grid item>
                            <Button
                              variant="outlined"
                              color="secondary"
                              size="large"
                              className={classes.action}
                              data-testid="discard-password"
                              onClick={() => {
                                setPasswordEdit(false);
                                setErrors(null);
                              }}
                              size="large"
                            >
                              DISCARD
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              variant="contained"
                              color="secondary"
                              size="large"
                              className={classes.action}
                              data-testid="save-password"
                              onClick={() => savePassword()}
                              size="large"
                            >
                              SAVE
                            </Button>
                          </Grid>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </>
              )}

              <Grid item>
                <Divider />
              </Grid>
              <Grid item className={classes.actions}>
                <Button
                  color="secondary"
                  variant="contained"
                  className={classes.signoutBtn}
                  onClick={logOut}
                  data-testid="button-signout"
                  size="large"
                >
                  SIGN OUT
                </Button>
                <Button className={classes.deleteBtn} onClick={openDeleteModal} size="large">
                  DELETE ACCOUNT
                </Button>
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction} className={classes.tabContainer}>
            <Grid container justify="center" direction="column">
              {tickets.length <= 0 && (
                <Box
                  style={{
                    width: '100%',
                    height: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {loadingTickets ? (
                    <CircularProgress />
                  ) : (
                    <Typography variant="h6">No ticket purchased.</Typography>
                  )}
                </Box>
              )}
              {tickets.map((ticket) => (
                <Grid key={ticket.id} item container className={classes.ticketContainer}>
                  <Grid item xs={12}>
                    <Typography color="primary" className={classes.ticketTitle}>
                      {ticket.event.title}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} container>
                    <Grid
                      item
                      md={4}
                      xs={12}
                      className={classes.ticketDetails}
                      container
                      justify="flex-end"
                      direction="column"
                    >
                      <Typography className={classes.ticketDetail}>
                        {`Booking id # ${ticket.id.slice(-7)}`}
                      </Typography>
                      <Typography className={classes.ticketDetail}>
                        {moment(ticket.event.from).format('DD MMM, YYYY')} -{' '}
                        {moment(ticket.event.to).format('DD MMM, YYYY')}
                      </Typography>
                    </Grid>
                    <Grid item md={4} xs={8} container alignItems="flex-end">
                      <Button
                        variant="text"
                        style={{ padding: 0, textTransform: 'none' }}
                        onClick={() => history.push(`/character/${ticket.characterId}`)}
                      >
                        <ProducerCard
                          photo={ticket.character.avatar}
                          name={ticket.character.name}
                          designation={ticket.character.tagline}
                          style={{ padding: '0 !important' }}
                        />
                      </Button>
                    </Grid>
                    <Grid item md={4} xs={4} container justify="flex-end" alignItems="flex-end">
                      <PDFDownloadLink
                        document={<TicketPDF ticket={ticket} />}
                        fileName="ticket.pdf"
                        style={{
                          textDecoration: 'none',
                        }}
                      >
                        {({ blob, url, loading, error }) =>
                          loading ? (
                            'Loading document...'
                          ) : (
                            <Button variant="contained" size="small" color="primary">
                              <DownloadIcon style={{ marginRight: 8, fontSize: 17 }} />
                              TICKET PDF
                            </Button>
                          )
                        }
                      </PDFDownloadLink>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </TabPanel>
        </Grid>
      </Grid>

      <Modal open={isOpenedDeleteModal} onClose={handleCloseDeleteModal}>
        <Grid container direction="column" spacing={6}>
          {!!errors && !!errors.result && errors.result.type == 'deleteAccount' && (
            <Grid item>
              <Alert severity="error">{errors.result.message}</Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography
              align="center"
              variant="h3"
              color="primary"
              className={classes.contentTitle}
            >
              Do you want to permanently delete your user account?
            </Typography>
          </Grid>
          <Grid item xs={12} align="center">
            <Button
              variant="contained"
              color="secondary"
              className={classes.backBtn}
              onClick={handleCloseDeleteModal}
            >
              BACK TO MY ACCOUNT
            </Button>
          </Grid>
          <Grid item xs={12} align="center">
            <Link component="button" onClick={deleteAccount} color="error">
              PERMANENT DELETE
            </Link>
          </Grid>
        </Grid>
      </Modal>
      <Modal open={isOpenedEmailModal} onClose={handleCloseEmailModal}>
        <Grid container direction="column" spacing={6}>
          {!!successes && !!successes.email && (
            <Alert severity="success">{successes.email.message}</Alert>
          )}
          <Grid item xs={12} align="center">
            <MailOutlineIcon color="secondary" className={classes.mailIcon} />
          </Grid>
          <Grid item xs={12} align="center">
            <Typography
              color="primary"
              variant="h3"
              align="center"
              className={classes.contentTitle}
            >
              Email Confirmation
            </Typography>
          </Grid>
          <Grid item xs={12} align="center">
            <Typography className={classes.emailSentInfo} align="center">
              We have sent an email to <span className={classes.email}> {email} </span> verify email
              change.
            </Typography>
            <Typography className={classes.emailSentInfo} align="center">
              After reciving the email, click on the verify button or follow the link provided in
              the email.
            </Typography>
          </Grid>
          <Grid item xs={12} align="center" className={classes.resendlink}>
            <Typography variant="body1" align="center">
              If you haven’t received any email, click &nbsp;
              <Link component="button" onClick={verifyAccount} color="secondary">
                resend
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};

const countries = [
  { code: 'AD', label: 'Andorra', phone: '376' },
  { code: 'AE', label: 'United Arab Emirates', phone: '971' },
  { code: 'AF', label: 'Afghanistan', phone: '93' },
  { code: 'AG', label: 'Antigua and Barbuda', phone: '1-268' },
  { code: 'AI', label: 'Anguilla', phone: '1-264' },
  { code: 'AL', label: 'Albania', phone: '355' },
  { code: 'AM', label: 'Armenia', phone: '374' },
  { code: 'AO', label: 'Angola', phone: '244' },
  { code: 'AQ', label: 'Antarctica', phone: '672' },
  { code: 'AR', label: 'Argentina', phone: '54' },
  { code: 'AS', label: 'American Samoa', phone: '1-684' },
  { code: 'AT', label: 'Austria', phone: '43' },
  { code: 'AU', label: 'Australia', phone: '61', suggested: true },
  { code: 'AW', label: 'Aruba', phone: '297' },
  { code: 'AX', label: 'Alland Islands', phone: '358' },
  { code: 'AZ', label: 'Azerbaijan', phone: '994' },
  { code: 'BA', label: 'Bosnia and Herzegovina', phone: '387' },
  { code: 'BB', label: 'Barbados', phone: '1-246' },
  { code: 'BD', label: 'Bangladesh', phone: '880' },
  { code: 'BE', label: 'Belgium', phone: '32' },
  { code: 'BF', label: 'Burkina Faso', phone: '226' },
  { code: 'BG', label: 'Bulgaria', phone: '359' },
  { code: 'BH', label: 'Bahrain', phone: '973' },
  { code: 'BI', label: 'Burundi', phone: '257' },
  { code: 'BJ', label: 'Benin', phone: '229' },
  { code: 'BL', label: 'Saint Barthelemy', phone: '590' },
  { code: 'BM', label: 'Bermuda', phone: '1-441' },
  { code: 'BN', label: 'Brunei Darussalam', phone: '673' },
  { code: 'BO', label: 'Bolivia', phone: '591' },
  { code: 'BR', label: 'Brazil', phone: '55' },
  { code: 'BS', label: 'Bahamas', phone: '1-242' },
  { code: 'BT', label: 'Bhutan', phone: '975' },
  { code: 'BV', label: 'Bouvet Island', phone: '47' },
  { code: 'BW', label: 'Botswana', phone: '267' },
  { code: 'BY', label: 'Belarus', phone: '375' },
  { code: 'BZ', label: 'Belize', phone: '501' },
  { code: 'CA', label: 'Canada', phone: '1', suggested: true },
  { code: 'CC', label: 'Cocos (Keeling) Islands', phone: '61' },
  { code: 'CD', label: 'Congo, Democratic Republic of the', phone: '243' },
  { code: 'CF', label: 'Central African Republic', phone: '236' },
  { code: 'CG', label: 'Congo, Republic of the', phone: '242' },
  { code: 'CH', label: 'Switzerland', phone: '41' },
  { code: 'CI', label: "Cote d'Ivoire", phone: '225' },
  { code: 'CK', label: 'Cook Islands', phone: '682' },
  { code: 'CL', label: 'Chile', phone: '56' },
  { code: 'CM', label: 'Cameroon', phone: '237' },
  { code: 'CN', label: 'China', phone: '86' },
  { code: 'CO', label: 'Colombia', phone: '57' },
  { code: 'CR', label: 'Costa Rica', phone: '506' },
  { code: 'CU', label: 'Cuba', phone: '53' },
  { code: 'CV', label: 'Cape Verde', phone: '238' },
  { code: 'CW', label: 'Curacao', phone: '599' },
  { code: 'CX', label: 'Christmas Island', phone: '61' },
  { code: 'CY', label: 'Cyprus', phone: '357' },
  { code: 'CZ', label: 'Czech Republic', phone: '420' },
  { code: 'DE', label: 'Germany', phone: '49', suggested: true },
  { code: 'DJ', label: 'Djibouti', phone: '253' },
  { code: 'DK', label: 'Denmark', phone: '45' },
  { code: 'DM', label: 'Dominica', phone: '1-767' },
  { code: 'DO', label: 'Dominican Republic', phone: '1-809' },
  { code: 'DZ', label: 'Algeria', phone: '213' },
  { code: 'EC', label: 'Ecuador', phone: '593' },
  { code: 'EE', label: 'Estonia', phone: '372' },
  { code: 'EG', label: 'Egypt', phone: '20' },
  { code: 'EH', label: 'Western Sahara', phone: '212' },
  { code: 'ER', label: 'Eritrea', phone: '291' },
  { code: 'ES', label: 'Spain', phone: '34' },
  { code: 'ET', label: 'Ethiopia', phone: '251' },
  { code: 'FI', label: 'Finland', phone: '358' },
  { code: 'FJ', label: 'Fiji', phone: '679' },
  { code: 'FK', label: 'Falkland Islands (Malvinas)', phone: '500' },
  { code: 'FM', label: 'Micronesia, Federated States of', phone: '691' },
  { code: 'FO', label: 'Faroe Islands', phone: '298' },
  { code: 'FR', label: 'France', phone: '33', suggested: true },
  { code: 'GA', label: 'Gabon', phone: '241' },
  { code: 'GB', label: 'United Kingdom', phone: '44' },
  { code: 'GD', label: 'Grenada', phone: '1-473' },
  { code: 'GE', label: 'Georgia', phone: '995' },
  { code: 'GF', label: 'French Guiana', phone: '594' },
  { code: 'GG', label: 'Guernsey', phone: '44' },
  { code: 'GH', label: 'Ghana', phone: '233' },
  { code: 'GI', label: 'Gibraltar', phone: '350' },
  { code: 'GL', label: 'Greenland', phone: '299' },
  { code: 'GM', label: 'Gambia', phone: '220' },
  { code: 'GN', label: 'Guinea', phone: '224' },
  { code: 'GP', label: 'Guadeloupe', phone: '590' },
  { code: 'GQ', label: 'Equatorial Guinea', phone: '240' },
  { code: 'GR', label: 'Greece', phone: '30' },
  { code: 'GS', label: 'South Georgia and the South Sandwich Islands', phone: '500' },
  { code: 'GT', label: 'Guatemala', phone: '502' },
  { code: 'GU', label: 'Guam', phone: '1-671' },
  { code: 'GW', label: 'Guinea-Bissau', phone: '245' },
  { code: 'GY', label: 'Guyana', phone: '592' },
  { code: 'HK', label: 'Hong Kong', phone: '852' },
  { code: 'HM', label: 'Heard Island and McDonald Islands', phone: '672' },
  { code: 'HN', label: 'Honduras', phone: '504' },
  { code: 'HR', label: 'Croatia', phone: '385' },
  { code: 'HT', label: 'Haiti', phone: '509' },
  { code: 'HU', label: 'Hungary', phone: '36' },
  { code: 'ID', label: 'Indonesia', phone: '62' },
  { code: 'IE', label: 'Ireland', phone: '353' },
  { code: 'IL', label: 'Israel', phone: '972' },
  { code: 'IM', label: 'Isle of Man', phone: '44' },
  { code: 'IN', label: 'India', phone: '91' },
  { code: 'IO', label: 'British Indian Ocean Territory', phone: '246' },
  { code: 'IQ', label: 'Iraq', phone: '964' },
  { code: 'IR', label: 'Iran, Islamic Republic of', phone: '98' },
  { code: 'IS', label: 'Iceland', phone: '354' },
  { code: 'IT', label: 'Italy', phone: '39' },
  { code: 'JE', label: 'Jersey', phone: '44' },
  { code: 'JM', label: 'Jamaica', phone: '1-876' },
  { code: 'JO', label: 'Jordan', phone: '962' },
  { code: 'JP', label: 'Japan', phone: '81', suggested: true },
  { code: 'KE', label: 'Kenya', phone: '254' },
  { code: 'KG', label: 'Kyrgyzstan', phone: '996' },
  { code: 'KH', label: 'Cambodia', phone: '855' },
  { code: 'KI', label: 'Kiribati', phone: '686' },
  { code: 'KM', label: 'Comoros', phone: '269' },
  { code: 'KN', label: 'Saint Kitts and Nevis', phone: '1-869' },
  { code: 'KP', label: "Korea, Democratic People's Republic of", phone: '850' },
  { code: 'KR', label: 'Korea, Republic of', phone: '82' },
  { code: 'KW', label: 'Kuwait', phone: '965' },
  { code: 'KY', label: 'Cayman Islands', phone: '1-345' },
  { code: 'KZ', label: 'Kazakhstan', phone: '7' },
  { code: 'LA', label: "Lao People's Democratic Republic", phone: '856' },
  { code: 'LB', label: 'Lebanon', phone: '961' },
  { code: 'LC', label: 'Saint Lucia', phone: '1-758' },
  { code: 'LI', label: 'Liechtenstein', phone: '423' },
  { code: 'LK', label: 'Sri Lanka', phone: '94' },
  { code: 'LR', label: 'Liberia', phone: '231' },
  { code: 'LS', label: 'Lesotho', phone: '266' },
  { code: 'LT', label: 'Lithuania', phone: '370' },
  { code: 'LU', label: 'Luxembourg', phone: '352' },
  { code: 'LV', label: 'Latvia', phone: '371' },
  { code: 'LY', label: 'Libya', phone: '218' },
  { code: 'MA', label: 'Morocco', phone: '212' },
  { code: 'MC', label: 'Monaco', phone: '377' },
  { code: 'MD', label: 'Moldova, Republic of', phone: '373' },
  { code: 'ME', label: 'Montenegro', phone: '382' },
  { code: 'MF', label: 'Saint Martin (French part)', phone: '590' },
  { code: 'MG', label: 'Madagascar', phone: '261' },
  { code: 'MH', label: 'Marshall Islands', phone: '692' },
  { code: 'MK', label: 'Macedonia, the Former Yugoslav Republic of', phone: '389' },
  { code: 'ML', label: 'Mali', phone: '223' },
  { code: 'MM', label: 'Myanmar', phone: '95' },
  { code: 'MN', label: 'Mongolia', phone: '976' },
  { code: 'MO', label: 'Macao', phone: '853' },
  { code: 'MP', label: 'Northern Mariana Islands', phone: '1-670' },
  { code: 'MQ', label: 'Martinique', phone: '596' },
  { code: 'MR', label: 'Mauritania', phone: '222' },
  { code: 'MS', label: 'Montserrat', phone: '1-664' },
  { code: 'MT', label: 'Malta', phone: '356' },
  { code: 'MU', label: 'Mauritius', phone: '230' },
  { code: 'MV', label: 'Maldives', phone: '960' },
  { code: 'MW', label: 'Malawi', phone: '265' },
  { code: 'MX', label: 'Mexico', phone: '52' },
  { code: 'MY', label: 'Malaysia', phone: '60' },
  { code: 'MZ', label: 'Mozambique', phone: '258' },
  { code: 'NA', label: 'Namibia', phone: '264' },
  { code: 'NC', label: 'New Caledonia', phone: '687' },
  { code: 'NE', label: 'Niger', phone: '227' },
  { code: 'NF', label: 'Norfolk Island', phone: '672' },
  { code: 'NG', label: 'Nigeria', phone: '234' },
  { code: 'NI', label: 'Nicaragua', phone: '505' },
  { code: 'NL', label: 'Netherlands', phone: '31' },
  { code: 'NO', label: 'Norway', phone: '47' },
  { code: 'NP', label: 'Nepal', phone: '977' },
  { code: 'NR', label: 'Nauru', phone: '674' },
  { code: 'NU', label: 'Niue', phone: '683' },
  { code: 'NZ', label: 'New Zealand', phone: '64' },
  { code: 'OM', label: 'Oman', phone: '968' },
  { code: 'PA', label: 'Panama', phone: '507' },
  { code: 'PE', label: 'Peru', phone: '51' },
  { code: 'PF', label: 'French Polynesia', phone: '689' },
  { code: 'PG', label: 'Papua New Guinea', phone: '675' },
  { code: 'PH', label: 'Philippines', phone: '63' },
  { code: 'PK', label: 'Pakistan', phone: '92' },
  { code: 'PL', label: 'Poland', phone: '48' },
  { code: 'PM', label: 'Saint Pierre and Miquelon', phone: '508' },
  { code: 'PN', label: 'Pitcairn', phone: '870' },
  { code: 'PR', label: 'Puerto Rico', phone: '1' },
  { code: 'PS', label: 'Palestine, State of', phone: '970' },
  { code: 'PT', label: 'Portugal', phone: '351' },
  { code: 'PW', label: 'Palau', phone: '680' },
  { code: 'PY', label: 'Paraguay', phone: '595' },
  { code: 'QA', label: 'Qatar', phone: '974' },
  { code: 'RE', label: 'Reunion', phone: '262' },
  { code: 'RO', label: 'Romania', phone: '40' },
  { code: 'RS', label: 'Serbia', phone: '381' },
  { code: 'RU', label: 'Russian Federation', phone: '7' },
  { code: 'RW', label: 'Rwanda', phone: '250' },
  { code: 'SA', label: 'Saudi Arabia', phone: '966' },
  { code: 'SB', label: 'Solomon Islands', phone: '677' },
  { code: 'SC', label: 'Seychelles', phone: '248' },
  { code: 'SD', label: 'Sudan', phone: '249' },
  { code: 'SE', label: 'Sweden', phone: '46' },
  { code: 'SG', label: 'Singapore', phone: '65' },
  { code: 'SH', label: 'Saint Helena', phone: '290' },
  { code: 'SI', label: 'Slovenia', phone: '386' },
  { code: 'SJ', label: 'Svalbard and Jan Mayen', phone: '47' },
  { code: 'SK', label: 'Slovakia', phone: '421' },
  { code: 'SL', label: 'Sierra Leone', phone: '232' },
  { code: 'SM', label: 'San Marino', phone: '378' },
  { code: 'SN', label: 'Senegal', phone: '221' },
  { code: 'SO', label: 'Somalia', phone: '252' },
  { code: 'SR', label: 'Suriname', phone: '597' },
  { code: 'SS', label: 'South Sudan', phone: '211' },
  { code: 'ST', label: 'Sao Tome and Principe', phone: '239' },
  { code: 'SV', label: 'El Salvador', phone: '503' },
  { code: 'SX', label: 'Sint Maarten (Dutch part)', phone: '1-721' },
  { code: 'SY', label: 'Syrian Arab Republic', phone: '963' },
  { code: 'SZ', label: 'Swaziland', phone: '268' },
  { code: 'TC', label: 'Turks and Caicos Islands', phone: '1-649' },
  { code: 'TD', label: 'Chad', phone: '235' },
  { code: 'TF', label: 'French Southern Territories', phone: '262' },
  { code: 'TG', label: 'Togo', phone: '228' },
  { code: 'TH', label: 'Thailand', phone: '66' },
  { code: 'TJ', label: 'Tajikistan', phone: '992' },
  { code: 'TK', label: 'Tokelau', phone: '690' },
  { code: 'TL', label: 'Timor-Leste', phone: '670' },
  { code: 'TM', label: 'Turkmenistan', phone: '993' },
  { code: 'TN', label: 'Tunisia', phone: '216' },
  { code: 'TO', label: 'Tonga', phone: '676' },
  { code: 'TR', label: 'Turkey', phone: '90' },
  { code: 'TT', label: 'Trinidad and Tobago', phone: '1-868' },
  { code: 'TV', label: 'Tuvalu', phone: '688' },
  { code: 'TW', label: 'Taiwan, Province of China', phone: '886' },
  { code: 'TZ', label: 'United Republic of Tanzania', phone: '255' },
  { code: 'UA', label: 'Ukraine', phone: '380' },
  { code: 'UG', label: 'Uganda', phone: '256' },
  { code: 'US', label: 'United States', phone: '1', suggested: true },
  { code: 'UY', label: 'Uruguay', phone: '598' },
  { code: 'UZ', label: 'Uzbekistan', phone: '998' },
  { code: 'VA', label: 'Holy See (Vatican City State)', phone: '379' },
  { code: 'VC', label: 'Saint Vincent and the Grenadines', phone: '1-784' },
  { code: 'VE', label: 'Venezuela', phone: '58' },
  { code: 'VG', label: 'British Virgin Islands', phone: '1-284' },
  { code: 'VI', label: 'US Virgin Islands', phone: '1-340' },
  { code: 'VN', label: 'Vietnam', phone: '84' },
  { code: 'VU', label: 'Vanuatu', phone: '678' },
  { code: 'WF', label: 'Wallis and Futuna', phone: '681' },
  { code: 'WS', label: 'Samoa', phone: '685' },
  { code: 'XK', label: 'Kosovo', phone: '383' },
  { code: 'YE', label: 'Yemen', phone: '967' },
  { code: 'YT', label: 'Mayotte', phone: '262' },
  { code: 'ZA', label: 'South Africa', phone: '27' },
  { code: 'ZM', label: 'Zambia', phone: '260' },
  { code: 'ZW', label: 'Zimbabwe', phone: '263' },
];
