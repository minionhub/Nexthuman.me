import React, { useEffect, useState } from 'react';
import TagManager from 'react-gtm-module';
import { v4 as uuidv4 } from 'uuid';
import { useFirebase } from 'react-redux-firebase';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import * as yup from 'yup';

import { makeStyles } from '@material-ui/core/styles';
import { AccessTime, CalendarToday, Error, RoomOutlined } from '@material-ui/icons';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Link,
} from '@material-ui/core';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import MUILink from '@material-ui/core/Link';
import { FormControl } from '@material-ui/core';

import FlagIcon from '../../components/FlagIcon';
import Map from '../../components/form/Map';
import ProducerCard from '../../components/ProducerCard';
import TextField from '../../components/form/TextField';
import Modal from '../../components/Modal';
import AutocompleteField from '../../components/form/AutocompleteField';

import characterActions from '../../store/actions/characters';
import eventActions from '../../store/actions/events';
import ticketActions from '../../store/actions/tickets';
import countries from '../../utils/country';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import StripeInput from '../../components/form/StripeInput';

const validationSchema = yup.object().shape({
  nameBill: yup.string().required('Name is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  postcode: yup.string().required('Post Code is required'),
  country: yup.string().required('Country is required'),
  nameCard: yup.string().required('Name is required'),
  cancelPolicy: yup.bool().oneOf([true], 'The cancellation policy must be accepted.'),
});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: '60px 0',
    '& .MuiContainer-maxWidthXl': {
      maxWidth: '1168px !important',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '40px 0',
    },
  },
  title: {
    fontSize: 48,
    lineHeight: '58px',
    fontWeight: 700,
    [theme.breakpoints.down('sm')]: {
      fontSize: 34,
      lineHeight: '41px',
    },
  },
  subtitle: {
    fontSize: 24,
    lineHeight: '30px',
    marginTop: 18,
    marginBottom: 40,
    [theme.breakpoints.down('sm')]: {
      fontSize: 16,
      lineHeight: '24px',
      marginTop: 12,
    },
  },
  sectionTitle: {
    fontSize: 24,
    lineHeight: '29px',
    fontWeight: 'normal',
    marginBottom: 18,
    [theme.breakpoints.down('sm')]: {
      fontSize: 20,
      lineHeight: '24px',
    },
  },
  coverImg: {
    width: '100%',
    borderRadius: 18,
    padding: '28%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    [theme.breakpoints.down('sm')]: {
      padding: '33.3%',
    },
  },
  eventDetails: {
    maxWidth: 920,
    padding: '40px 0 0',
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      padding: '24px 0 0',
    },
  },
  iconTypo: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  formLeft: {
    paddingRight: '100px !important',
    [theme.breakpoints.down('sm')]: {
      paddingRight: '8px !important',
    },
  },
  formRight: {
    paddingLeft: '100px !important',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: '8px !important',
    },
  },
  action: {
    width: 200,
    height: 48,
    fontSize: 15,
    lineHeight: '16px',
    fontWeight: 500,
    letterSpacing: 1.25,
    textTransform: 'uppercase',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      marginTop: 26,
    },
  },
  charactersWrapper: {
    width: '100%',
    height: '100%',
    overflowY: 'auto',
  },
  actions: {
    marginTop: 30,
    padding: 8,
    [theme.breakpoints.down('sm')]: {
      marginTop: 0,
    },
  },
}));

export default () => {
  const { eventId } = useParams();
  const stripe = useStripe();
  const elements = useElements();

  const [curCharacter, setCurCharacter] = useState(null);
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [nameBill, setNameBill] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [country, setCountry] = useState('');
  const [nameCard, setNameCard] = useState('');
  const [errors, setErrors] = useState({});
  const [stripeError, setStripeError] = useState('');
  const [dirty, setDirty] = useState(false);
  const [cancelPolicy, setCancelPolicy] = useState(false);
  const [characterDlg, setCharacterDlg] = useState(false);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);

  const firebase = useFirebase();

  const history = useHistory();
  const dispatch = useDispatch();

  const classes = useStyles();

  const userStore = useSelector((state) => state.userStore);

  const getCharacters = (uid) => dispatch(characterActions.getCharacters(uid));
  const getEvent = (eventId) => dispatch(eventActions.getEvent(eventId));

  const createTicket = (ticket) => {
    return dispatch(ticketActions.createTicket(ticket));
  };

  const onSelectCharacter = (character) => {
    setCurCharacter(character);
    setCharacterDlg(false);
  };

  const doValidation = () => {
    try {
      validationSchema.validateSync(
        { dirty, nameBill, address, city, postcode, country, nameCard, cancelPolicy },
        {
          abortEarly: false,
          recursive: true,
          stripUnknown: true,
        }
      );
      setErrors({});
      return true;
    } catch (e) {
      setErrors(e.inner.reduce((result, err) => ({ ...result, [err.path]: err }), {}));
      return false;
    }
  };

  const emailMessage = firebase.functions().httpsCallable('emailMessage');
  const createPaymentIntent = firebase.functions().httpsCallable('createPaymentIntent');

  const confirmPayment = async (stripe) => {
    if (event.price.value <= 0) {
      await processAfterPayment();
    }

    setStripeError('');

    const valid = doValidation();
    setDirty(true);
    if (!valid) return;

    if (!stripe || !elements) return;

    setLoading(true);
    await createPaymentIntent({
      amount: event.price.value,
      metadata: {
        event_id: event.id,
        event_title: event.title,
        character_id: curCharacter.characterId,
        character_name: curCharacter.name,
        user_id: user.uid,
        user_name: user.name,
        email: user.email,
      },
    })
      .then(async (res) => {
        const clientSecret = res.data.clientSecret;
        await stripe
          .confirmCardPayment(clientSecret, {
            payment_method: {
              card: elements.getElement(CardNumberElement),
              billing_details: {
                name: nameBill,
                address: {
                  city: city,
                  country: country,
                  postal_code: postcode,
                  line1: address,
                },
              },
            },
          })
          .then(async (result) => {
            if (result.error) {
              // Show error to your customer
              setStripeError(result.error.message);
            } else {
              // The payment succeeded!
              const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardNumberElement),
              });

              await processAfterPayment(result.paymentIntent, paymentMethod);
            }
          });
      })
      .catch(function (err) {
        console.log(err);
      });
    setLoading(false);
  };

  const processAfterPayment = async (paymentIntent = null, paymentMethod = null) => {
    const ticketId = uuidv4();
    const ticket = {
      id: ticketId,
      characterId: curCharacter.characterId,
      eventId: event.id,
      eventTitle: event.title,
      eventFrom: event.from,
      eventTo: event.to,
      transactionId: paymentIntent ? paymentIntent.id : 'N/A',
      amount: event.price.value,
      currency: event.price.currency,
      created: moment().utc().format(),
      cardType: paymentMethod ? paymentMethod.card.brand : null,
      cardLast4: paymentMethod ? paymentMethod.card.last4 : null,
    };
    await createTicket(ticket);
    TagManager.dataLayer({
      dataLayer: {
        event: 'newTicketCreated',
        eventProps: {
          title: event.title,
          from: event.from,
          to: event.to,
          price: event.price.value,
          characterId: curCharacter.characterId,
        },
      },
    });
    TagManager.dataLayer({ dataLayer: { ecommerce: null } });
    TagManager.dataLayer({
      dataLayer: {
        event: 'newTransaction',
        ecommerce: {
          currencyCode: 'SEK', // Local currency is optional.
          purchase: {
            actionField: {
              id: event.id,
              revenue: event.price.value,
            },
            products: [
              {
                name: event.title,
                id: event.id,
                price: event.price.value,
                category: 'Event',
                quantity: 1,
              },
            ],
          },
        },
      },
    });
    emailMessage({
      ...ticket,
      email: user.email,
      eventSubtitle: event.subtitle || '',
      userName: user.name || '',
      coverImg: event.coverImage.src || '',
      character: {
        name: curCharacter.name || '',
        avatar: curCharacter.avatar || '',
        tagline: curCharacter.tagline || '',
      },
      location:
        event.location.type == 'venue'
          ? {
              type: event.location.type,
              lat: event.location.data.geometry.location.lat || '',
              lng: event.location.data.geometry.location.lng || '',
              center: (event.location.data.name || '').replaceAll(' ', '+'),
              name: event.location.data.name || '',
            }
          : {
              type: event.location.type,
              name: event.location.data.url,
            },
    })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
    history.push('/events/book/success/' + ticketId);
  };

  useEffect(() => {
    if (dirty) {
      doValidation();
    }
  }, [dirty, nameBill, address, city, postcode, country, nameCard, cancelPolicy]);

  useEffect(() => {
    if (userStore.authUser != null && !curCharacter) {
      setUser(userStore.authUser);
      getCharacters(userStore.authUser.uid).then((characters) => {
        setCharacters(characters);
        characters.forEach((item) => {
          if (item.characterId == userStore.authUser.lastSelectedCharacter) {
            setCurCharacter(item);
          }
        });
      });
    }
  }, [userStore]);

  useEffect(() => {
    setIsLoading(true);
    getEvent(eventId).then((event) => {
      setIsLoading(false);
      setEvent(event);
    });
  }, [eventId]);

  return (
    <>
      {(!event || isLoading) && (
        <Box
          style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {event && !isLoading && (
        <Box className={classes.root}>
          <Container maxWidth="xl">
            <Grid
              container
              className={classes.coverImg}
              style={{ backgroundImage: `url(${event.coverImage.src || event.coverImage})` }}
            ></Grid>
            <Grid container className={classes.eventDetails} direction="column">
              <Typography color="primary" className={classes.title}>
                {event.title}
              </Typography>
              <Typography color="secondary" className={classes.subtitle}>
                {event.subtitle}
              </Typography>
              <Grid item container>
                <Grid item md={7} sm={12} spacing={2} container>
                  <Grid
                    item
                    xs={6}
                    container
                    direction="column"
                    justify="space-between"
                    style={{ marginBottom: 16 }}
                  >
                    <Typography color="primary" className={classes.sectionTitle}>
                      Start
                    </Typography>
                    <Typography className={classes.iconTypo} style={{ marginBottom: 10 }}>
                      <CalendarToday color="secondary" className={classes.icon} />
                      {moment(event.from).format('dddd, MMM DD, YYYY')}
                    </Typography>
                    <Typography className={classes.iconTypo}>
                      <AccessTime color="secondary" className={classes.icon} />
                      {moment(event.from).format('LT')}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    container
                    direction="column"
                    justify="space-between"
                    style={{ marginBottom: 16 }}
                  >
                    <Typography color="primary" className={classes.sectionTitle}>
                      End
                    </Typography>
                    <Typography className={classes.iconTypo} style={{ marginBottom: 10 }}>
                      <CalendarToday color="secondary" className={classes.icon} />
                      {moment(event.to).format('dddd, MMM DD, YYYY')}
                    </Typography>
                    <Typography className={classes.iconTypo}>
                      <AccessTime color="secondary" className={classes.icon} />
                      {moment(event.to).format('LT')}
                    </Typography>
                  </Grid>
                  <Grid item xs style={{ marginBottom: 24 }}>
                    <Typography color="primary" className={classes.sectionTitle}>
                      Ticket Price
                    </Typography>
                    <Typography>SEK {parseInt(event.price.value)}</Typography>
                  </Grid>
                  <Grid item xs style={{ marginBottom: 24 }}>
                    <Typography color="primary" className={classes.sectionTitle}>
                      Ticket Status
                    </Typography>
                    <Typography>
                      {event.capacity - (event.sold || 0)}/{event.capacity}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item container md={5} sm={12} direction="column" style={{ marginBottom: 24 }}>
                  <Grid
                    item
                    container
                    justify="space-between"
                    alignItems="center"
                    style={{ marginBottom: 10 }}
                  >
                    <Typography
                      color="primary"
                      className={classes.sectionTitle}
                      style={{ marginBottom: 0 }}
                    >
                      Participant Character
                    </Typography>
                    <Button
                      variant="text"
                      size="small"
                      color="secondary"
                      onClick={() => setCharacterDlg(true)}
                    >
                      Change
                    </Button>
                  </Grid>
                  <Grid item>
                    {curCharacter && (
                      <Button
                        variant="text"
                        onClick={() => history.push(`/character/${curCharacter.characterId}`)}
                      >
                        <ProducerCard
                          photo={curCharacter.avatar}
                          name={curCharacter.name}
                          designation={curCharacter.tagline}
                          style={{ padding: '0 !important' }}
                        />
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Typography
                  color="primary"
                  className={classes.sectionTitle}
                  style={{ marginBottom: 23 }}
                >
                  Location
                </Typography>
                {event.location.data.name && (
                  <Typography
                    className={classes.iconTypo}
                    style={{
                      marginBottom: 18,
                      fontSize: 17,
                      color: '#333333',
                      fontWeight: 500,
                      alignItems: 'top',
                    }}
                  >
                    <RoomOutlined variant="outlined" className={classes.icon} color="secondary" />
                    {event.location.data.name}
                  </Typography>
                )}
                {event.location.type == 'venue' ? (
                  <Map location={event.location} />
                ) : (
                  <Link color="secondary" href={event.location.data.url || '#'}>
                    {event.location.data.url || 'No link specified.'}
                  </Link>
                )}
              </Grid>

              <Grid
                data-testid="eventBookForm"
                item
                container
                spacing={2}
                style={{ marginTop: 16 }}
              >
                <Grid item sm={6} xs={12} className={classes.formLeft}>
                  {event.price.value > 0 && (
                    <Box>
                      <Typography
                        color="primary"
                        className={classes.sectionTitle}
                        style={{ marginBottom: 24 }}
                      >
                        Billing Address
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            data-testid="eventBookBillingName"
                            variant="outlined"
                            fullWidth
                            name="nameBill"
                            value={nameBill}
                            error={!!errors.nameBill}
                            placeholder="Billing Name"
                            helperText={!!errors.nameBill && errors.nameBill.message}
                            label="Name"
                            onChange={(e) => setNameBill(e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            data-testid="eventBookBillingAddress"
                            variant="outlined"
                            fullWidth
                            name="address"
                            value={address}
                            placeholder="Billing Address"
                            error={!!errors.address}
                            helperText={!!errors.address && errors.address.message}
                            label="Address"
                            onChange={(e) => setAddress(e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            data-testid="eventBookBillingCity"
                            variant="outlined"
                            fullWidth
                            name="city"
                            value={city}
                            placeholder="Your City"
                            error={!!errors.city}
                            helperText={!!errors.city && errors.city.message}
                            label="City"
                            onChange={(e) => setCity(e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            data-testid="eventBookBillingPostcode"
                            variant="outlined"
                            fullWidth
                            name="postcode"
                            value={postcode}
                            placeholder="Post Code"
                            error={!!errors.postcode}
                            helperText={!!errors.postcode && errors.postcode.message}
                            label="Post Code"
                            onChange={(e) => setPostcode(e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <AutocompleteField
                            data-testid="eventBookBillingCountry"
                            fullWidth
                            label="Country"
                            options={countries}
                            onChange={(option) => setCountry(option.code)}
                            getOptionSelected={(option) => option.name}
                            getOptionLabel={(option) => option.name}
                            error={!!errors.country}
                            renderOption={(option) => (
                              <Grid container alignItems="center">
                                <FlagIcon code={option.code.toLowerCase()} size="lg" />
                                <Typography
                                  component="p"
                                  style={{
                                    marginLeft: 10,
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '80%',
                                  }}
                                >
                                  {option.name}
                                </Typography>
                              </Grid>
                            )}
                            placeholder="Select Country"
                          />
                          {!!errors.country && (
                            <FormHelperText error={!!errors.country}>
                              {errors.country.message}
                            </FormHelperText>
                          )}
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Grid>

                <Grid item sm={6} xs={12} className={classes.formRight}>
                  {event.price.value > 0 && (
                    <Box>
                      <Typography
                        color="primary"
                        className={classes.sectionTitle}
                        style={{ marginBottom: 24 }}
                      >
                        Card Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            data-testid="eventBookBillingCardHolder"
                            variant="outlined"
                            fullWidth
                            name="nameCard"
                            value={nameCard}
                            error={!!errors.nameCard}
                            placeholder="Name on the card"
                            helperText={!!errors.nameCard && errors.nameCard.message}
                            label="Name"
                            onChange={(e) => setNameCard(e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            data-testid="eventBookBillingCardNumber"
                            variant="outlined"
                            fullWidth
                            name="ccnumber"
                            label="Card Number"
                            InputProps={{
                              inputComponent: StripeInput,
                              inputProps: {
                                component: CardNumberElement,
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            data-testid="eventBookBillingCardExpiry"
                            variant="outlined"
                            fullWidth
                            name="ccexp"
                            label="Expiry Date"
                            InputProps={{
                              inputComponent: StripeInput,
                              inputProps: {
                                component: CardExpiryElement,
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            data-testid="eventBookBillingCardCVC"
                            variant="outlined"
                            fullWidth
                            name="cvc"
                            label="CVV"
                            InputProps={{
                              inputComponent: StripeInput,
                              inputProps: {
                                component: CardCvcElement,
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} container alignItems="center">
                          {stripeError && (
                            <>
                              <Error color="secondary" style={{ marginRight: 10 }}></Error>
                              <Typography color="secondary" variant="body2">
                                {stripeError}
                              </Typography>
                            </>
                          )}
                        </Grid>
                      </Grid>
                    </Box>
                  )}

                  <Grid item xs={12}>
                    <Typography
                      style={{
                        fontSize: '12px',
                        lineHeight: '14px',
                        textAlign: event.price.value > 0 ? 'left' : 'right',
                      }}
                    >
                      Total payable
                    </Typography>
                    <Typography
                      style={{
                        fontSize: '34px',
                        lineHeight: '41px',
                        textAlign: event.price.value > 0 ? 'left' : 'right',
                      }}
                    >
                      {event.price.value > 0
                        ? `${event.price.currency} ${event.price.value}`
                        : 'Free'}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12} style={{ padding: '0 8px' }}>
                  <FormControl required error={!!errors.cancelPolicy}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          data-testid="eventBookBillingPolicy"
                          checked={cancelPolicy}
                          onChange={(e) => setCancelPolicy(e.target.checked)}
                          name="cancelPolicy"
                          color={'secondary'}
                        />
                      }
                      label={
                        <Typography variant="caption">
                          I accept the{' '}
                          <MUILink href="/terms" color="secondary" target="_blank">
                            Cancellation Policy (part of Terms & Conditions)
                          </MUILink>
                          .
                        </Typography>
                      }
                    />
                    {!!errors.cancelPolicy && (
                      <FormHelperText id="my-helper-text">
                        Please accept our cancellation policy
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid container justify="space-between" className={classes.actions}>
                  <Grid item sm={6} xs={12}>
                    <Button variant="outlined" color="secondary" className={classes.action}>
                      CANCEL
                    </Button>
                  </Grid>
                  <Grid item container sm={6} xs={12} justify="flex-end">
                    <Button
                      data-testid="eventBookBillingSubmit"
                      variant="contained"
                      color="secondary"
                      className={classes.action}
                      onClick={() => confirmPayment(stripe)}
                      disabled={loading}
                    >
                      {loading ? (
                        <CircularProgress size={24} />
                      ) : event.price.value > 0 ? (
                        'CONFIRM PAYMENT'
                      ) : (
                        'BOOK EVENT'
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Container>
          <Modal
            title="Change Character"
            open={characterDlg}
            onClose={() => setCharacterDlg(false)}
          >
            <Grid container className={classes.charactersWrapper}>
              <Grid item xs={12}>
                {characters.map((character, index) => (
                  <Button
                    variant="text"
                    key={`mc-${index}`}
                    onClick={() => onSelectCharacter(character)}
                  >
                    <ProducerCard
                      photo={character.avatar}
                      name={character.name}
                      designation={character.tagline}
                    />
                  </Button>
                ))}
              </Grid>
            </Grid>
          </Modal>
        </Box>
      )}
    </>
  );
};
