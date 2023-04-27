import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TagManager from 'react-gtm-module';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import { Helmet } from 'react-helmet';
import { makeStyles } from '@material-ui/core/styles';
import {
  AccessTime,
  CalendarToday,
  Facebook,
  Twitter,
  Star,
  Edit,
  RoomOutlined,
} from '@material-ui/icons';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  CardMedia,
  CircularProgress,
  Chip,
  Link,
} from '@material-ui/core';

import { FacebookShareButton, TwitterShareButton } from 'react-share';

import Map from '../../components/form/Map';
import ProducerCard from '../../components/ProducerCard';
import EventCard from '../../components/EventCard';
import FabButton from '../../components/form/FabButton';
import Modal from '../../components/Modal';

import characterActions from '../../store/actions/characters';
import eventActions from '../../store/actions/events';
import ticketActions from '../../store/actions/tickets';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    '& .MuiContainer-maxWidthLg': {
      maxWidth: '1168px !important',
    },
  },
  banner: {
    width: '100%',
    position: 'relative',
    minHeight: 'calc(100vh - 90px)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    [theme.breakpoints.down('xs')]: {
      backgroundSize: 'auto calc(100% - 120px)',
      backgroundPosition: 'top',
      minHeight: 0,
    },
  },
  overlay: {
    paddingTop: '30vh',
    [theme.breakpoints.down('xs')]: {
      paddingTop: 115,
    },
  },
  bannerGradient: {
    background:
      'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 51.13%, rgba(0, 0, 0, 0.8) 100%)',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    [theme.breakpoints.down('xs')]: {
      height: 425,
    },
  },
  overlayRight: {
    color: '#fff',
    fontWeight: '300 !important',
    padding: theme.spacing(3),
    background: '#6A2C70',
    borderRadius: 4,
    width: '100%',
  },
  eventDetails: {
    marginTop: 60,
    marginBottom: 40,
    [theme.breakpoints.down('sm')]: {
      marginTop: 20,
      marginBottom: 24,
    },
  },
  title: {
    fontSize: 60,
    color: '#fff',
    lineHeight: '72px',
    [theme.breakpoints.down('sm')]: {
      fontSize: 34,
      lineHeight: '41px',
    },
  },
  subtitle: {
    fontSize: 24,
    color: '#fff',
    lineHeight: '30px',
    paddingTop: 20,
    [theme.breakpoints.down('sm')]: {
      fontSize: 20,
      lineHeight: '24px',
    },
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'normal',
  },
  action: {
    width: 250,
    height: 60,
    fontSize: 14,
    lineHeight: '16px',
    fontWeight: 500,
    letterSpacing: 1.25,
    textTransform: 'uppercase',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      marginTop: 26,
    },
  },
  iconTypo: {
    fontWeight: 300,
    display: 'inline-flex',
    alignItems: 'top',
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  body3: {
    paddingTop: 15,
    fontSize: 30,
    lineHeight: '30px',
  },
  floatingBtnContainer: {
    maxWidth: 1120,
    paddingRight: 20,
    [theme.breakpoints.up('sm')]: {
      paddingRight: 20,
    },
    [theme.breakpoints.up('md')]: {
      paddingRight: 40,
    },
    [theme.breakpoints.up('lg')]: {
      paddingRight: 200,
    },
    position: 'fixed',
    bottom: 80,
    right: 0,
    zIndex: 999,
    '& .MuiButtonBase-root:nth-child(2)': {
      marginLeft: '20px',
    },
    [theme.breakpoints.down('sm')]: {
      '& .MuiButton-label': {
        fontSize: 0,
        '& span': {
          fontSize: 15,
        },
      },
    },
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  shareButton: {
    marginRight: 10,
    outline: 'none',
    transition: 'color .3s',
    '&:hover svg': {
      color: '#283C63',
    },
  },
  desc: {
    marginTop: 24,
    [theme.breakpoints.down('sm')]: {
      marginTop: 18,
    },
    '& > *:first-child': {
      marginTop: '0 !important',
      paddingTop: '0 !important',
    },
    '& img': {
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        height: 'auto',
      },
    },
  },
  mtNormal: {
    marginTop: 40,
    [theme.breakpoints.down('sm')]: {
      marginTop: 20,
    },
  },
  mbNormal: {
    marginBottom: 40,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 20,
    },
  },
  ptNormal: {
    paddingTop: 40,
    [theme.breakpoints.down('sm')]: {
      paddingTop: 20,
    },
  },
  pbNormal: {
    paddingBottom: 40,
    [theme.breakpoints.down('sm')]: {
      paddingBottom: 24,
    },
  },
  charactersWrapper: {
    width: '100%',
    height: '100%',
    overflowY: 'auto',
  },
  characterBtn: {
    width: '100%',
    '& .MuiButton-label': {
      display: 'inline-block',
    },
  },
}));

export default () => {
  const { eventId } = useParams();
  let location = useLocation();
  const [eventsRelevant, setEventsRelevant] = useState(null);
  const [curCharacter, setCurCharacter] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookable, setIsBookable] = useState(false);
  const [producersDlg, setProducersDlg] = useState(false);
  const [participantsDlg, setParticipantsDlg] = useState(false);

  const history = useHistory();
  const dispatch = useDispatch();

  const classes = useStyles();

  const userStore = useSelector((state) => state.userStore);

  const getEventsRelevant = () => dispatch(eventActions.getEventsRelevant(event));
  const getCharacters = (uid) => dispatch(characterActions.getCharacters(uid));
  const getEvent = (eventId) => dispatch(eventActions.getEvent(eventId));
  const createTicket = (ticket) => dispatch(ticketActions.createTicket(ticket));

  const onClickSignIn = () => {
    localStorage.setItem('redirectTo', location.pathname);
    history.push('/sign_in');
  };

  const onClickBook = () => {
    history.push(`/events/book/${eventId}`);
  };

  useEffect(() => {
    if (event) {
      setEventsRelevant(null);
      getEventsRelevant(event).then((res) => {
        setEventsRelevant(res);
      });
    }
  }, [event]);

  useEffect(() => {
    if (
      userStore.authUser != null &&
      (!curCharacter || curCharacter.characterId != userStore.authUser.lastSelectedCharacter)
    ) {
      getCharacters(userStore.authUser.uid).then((characters) => {
        characters.forEach((item) => {
          if (item.characterId == userStore.authUser.lastSelectedCharacter) {
            setCurCharacter(item);
          }
        });
      });
    } else {
      setCurCharacter(null);
    }
  }, [userStore]);

  useEffect(() => {
    if (event && event.producers && curCharacter) {
      const c = event.producers.filter((prd) => prd.id == curCharacter.characterId);
      if (c.length > 0) {
        setIsOwner(true);
      } else setIsOwner(false);
    } else {
      setIsOwner(false);
    }

    if (event && event.participants && curCharacter) {
      const isBooked =
        event.participants.filter((p) => p.id == curCharacter.characterId).length > 0;
      const isEventExpired = Date.now() > Date.parse(event.to);
      if (!isBooked && !isEventExpired) {
        setIsBookable(true);
      } else {
        setIsBookable(false);
      }
    } else {
      setIsBookable(false);
    }
  }, [event, curCharacter]);

  useEffect(() => {
    setIsLoading(true);
    getEvent(eventId).then((event) => {
      setIsLoading(false);
      setEvent(event);
    });
  }, [eventId]);

  const goToEvent = (event) => {
    history.push(`/events/${event.id}`);
  };

  const Events = (props) => {
    if (!props.events)
      return (
        <Grid item container justify={'center'}>
          <CircularProgress />
        </Grid>
      );
    else
      return Object.values(props.events).map((event, idx) => (
        <Grid item lg={3} md={4} sm={6} xs={6} key={'eo-' + idx}>
          <EventCard event={event} onClick={goToEvent} />
        </Grid>
      ));
  };

  const Producers = ({ event }) => {
    if (event.producers) {
      return (
        <Grid item container style={{ marginTop: 18 }}>
          {event.producers.map(
            (prd, index) =>
              index < 4 && (
                <Grid item xs={6} key={`pc-${index}`}>
                  <Button
                    className={classes.characterBtn}
                    variant="text"
                    onClick={() => history.push(`/character/${prd.id}`)}
                  >
                    <ProducerCard
                      photo={prd.avatar}
                      name={prd.name}
                      designation={prd.tagline}
                      style={{ padding: '0 !important' }}
                    />
                  </Button>
                </Grid>
              )
          )}
        </Grid>
      );
    } else
      return (
        <Grid item style={{ marginTop: 18 }} container>
          No producers
        </Grid>
      );
  };

  const Participants = ({ event }) => {
    if (event.participants) {
      return (
        <Grid item style={{ marginTop: 18 }} container>
          {event.participants.map(
            (prd, index) =>
              index < 4 && (
                <Grid item xs={6} key={`pt-${index}`}>
                  <Button
                    className={classes.characterBtn}
                    variant="text"
                    onClick={() => history.push(`/character/${prd.id}`)}
                  >
                    <ProducerCard
                      photo={prd.avatar}
                      name={prd.name}
                      designation={prd.tagline}
                      style={{ padding: '0 !important' }}
                    />
                  </Button>
                </Grid>
              )
          )}
        </Grid>
      );
    } else
      return (
        <Grid item style={{ marginTop: 18 }} container>
          No participants
        </Grid>
      );
  };

  const EditButton = ({ event, character }) => {
    const isProducer =
      event.producers &&
      character &&
      event.producers.filter((prd) => prd.id == character.characterId).length > 0;
    if (isProducer)
      return (
        <div className={classes.floatingBtnContainer}>
          <FabButton
            data-testid="editEventBtn"
            color="secondary"
            icon={<Edit className={classes.extendedIcon} />}
            onClick={() => history.push(`/events/edit/${eventId}`)}
          >
            EDIT EVENT
          </FabButton>
        </div>
      );
    else return <></>;
  };

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
        <>
          <Box className={classes.root}>
            <Helmet>
              <title>NextHuman | {event.title}</title>
              <meta property="og:title" content={event.title} />
              {/* <meta property="og:description" content={event.description} /> */}
              <meta property="og:image" content={event.coverImage.src || event.coverImage} />
              <meta property="og:url" content={window.location.href} />
              <meta name="twitter:title" content={event.title} />
              {/* <meta name="twitter:description" content={event.description} /> */}
              <meta name="twitter:image" content={event.coverImage.src || event.coverImage} />
              <meta name="twitter:card" content="summary_large_image" />
            </Helmet>
            <Box
              className={classes.banner}
              style={{
                backgroundImage: `url(${event.coverImage.src || event.coverImage})`,
              }}
            >
              <div className={classes.bannerGradient}></div>
              <Container className={classes.overlay}>
                <Grid container spacing={2}>
                  <Grid
                    item
                    lg={8}
                    md
                    container
                    direction="column"
                    justify="space-between"
                    style={{ zIndex: 100 }}
                  >
                    <Grid item>
                      <Typography
                        data-testid="eventDetailTitle"
                        component="h1"
                        className={classes.title}
                      >
                        {event.title}
                      </Typography>
                      <Typography
                        data-testid="eventDetailSubtitle"
                        component="h2"
                        className={classes.subtitle}
                      >
                        {event.subtitle}
                      </Typography>
                    </Grid>
                    <Grid item>
                      {isBookable === true ? (
                        <Button
                          data-testid="eventDetailBookBtn"
                          className={classes.action}
                          variant="contained"
                          size="large"
                          color="secondary"
                          onClick={onClickBook}
                        >
                          BOOK EVENT
                        </Button>
                      ) : (
                        !userStore.authUser && (
                          <Button
                            className={classes.action}
                            variant="contained"
                            size="large"
                            color="secondary"
                            onClick={onClickSignIn}
                          >
                            SIGN IN TO BOOK EVENT
                          </Button>
                        )
                      )}
                    </Grid>
                  </Grid>
                  <Grid item lg={4} md container style={{ zIndex: 100 }}>
                    <div className={classes.overlayRight}>
                      <Grid container spacing={3}>
                        <Grid
                          item
                          lg={12}
                          xs={6}
                          container
                          direction="column"
                          justify="space-between"
                          data-testid="eventDetailFrom"
                        >
                          <Typography style={{ marginBottom: 10, fontSize: 20 }}>Start</Typography>
                          <Typography className={classes.iconTypo} style={{ marginBottom: 10 }}>
                            <AccessTime className={classes.icon} />
                            {moment(event.from).format('dddd, MMM DD, YYYY')}
                          </Typography>
                          <Typography className={classes.iconTypo}>
                            <CalendarToday className={classes.icon} />
                            {moment(event.from).format('LT')}
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          lg={12}
                          xs={6}
                          container
                          direction="column"
                          justify="space-between"
                          data-testid="eventDetailTo"
                        >
                          <Typography style={{ marginBottom: 10, fontSize: 20 }}>End</Typography>
                          <Typography className={classes.iconTypo} style={{ marginBottom: 10 }}>
                            <AccessTime className={classes.icon} />
                            {moment(event.to).format('dddd, MMM DD, YYYY')}
                          </Typography>
                          <Typography className={classes.iconTypo}>
                            <CalendarToday className={classes.icon} />
                            {moment(event.to).format('LT')}
                          </Typography>
                        </Grid>
                        <Grid data-testid="eventDetailPrice" item xs>
                          <Typography style={{ fontSize: 20 }}>Ticket Price</Typography>
                          <Typography className={classes.body3}>
                            SEK {parseInt(event.price.value)}
                          </Typography>
                        </Grid>
                        <Grid data-testid="eventDetailStatus" item xs>
                          <Typography style={{ fontSize: 20 }}>Ticket Status</Typography>
                          <Typography className={classes.body3}>
                            {event.capacity - (event.sold || 0)}/{event.capacity}
                          </Typography>
                        </Grid>
                      </Grid>
                    </div>
                  </Grid>
                </Grid>
              </Container>
            </Box>
            <Container className={classes.eventDetails}>
              <Grid container spacing={3}>
                <Grid item md={8} xs={12}>
                  <Grid item xs={12} container>
                    <Grid item xs container alignItems="center">
                      <Typography variant="h6" color="primary" className={classes.sectionTitle}>
                        Event Details
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} container>
                    {event.description && (
                      <div
                        data-testid="eventDetailDescription"
                        className={classes.desc}
                        style={{
                          width: '100%',
                          fontSize: 17,
                          lineHeight: '24px',
                          overflow: 'hidden',
                        }}
                        dangerouslySetInnerHTML={{
                          __html: event.description,
                        }}
                      />
                    )}
                  </Grid>
                </Grid>
                <Grid item md={4} xs={12} container direction="column" justify="flex-start">
                  {event.audio && event.audio.src && (
                    <Grid item className={classes.mbNormal}>
                      <CardMedia
                        data-testid="eventDetailAudio"
                        component={'audio'}
                        src={event.audio.src || event.audio}
                        controls
                      ></CardMedia>
                    </Grid>
                  )}
                  <Grid data-testid="eventDetailProducers" item container justify="space-between">
                    <Typography variant="h6" color="primary" className={classes.sectionTitle}>
                      Producers
                    </Typography>
                    {event.producers.length > 4 && (
                      <Button variant="text" size="small" onClick={() => setProducersDlg(true)}>
                        See All
                      </Button>
                    )}
                  </Grid>
                  <Producers event={event} />
                  <Grid
                    data-testid="eventDetailParticipants"
                    item
                    className={classes.mtNormal}
                    container
                    justify="space-between"
                  >
                    <Typography variant="h6" color="primary" className={classes.sectionTitle}>
                      Participants
                    </Typography>
                    {event.participants.length > 4 && (
                      <Button variant="text" size="small" onClick={() => setParticipantsDlg(true)}>
                        See All
                      </Button>
                    )}
                  </Grid>
                  <Participants event={event} />

                  <Grid item className={classes.mtNormal}>
                    <Typography variant="h6" color="primary" className={classes.sectionTitle}>
                      Experiences
                    </Typography>
                  </Grid>
                  <Grid data-testid="eventDetailExperiences" item style={{ marginTop: 18 }}>
                    {event.experiences.map((exp, index) => (
                      <Chip
                        key={'exp' + index}
                        icon={<Star style={{ fill: '#F2994A' }}></Star>}
                        label={exp}
                        style={{
                          textTransform: 'capitalize',
                          marginRight: 10,
                          marginBottom: 10,
                        }}
                      ></Chip>
                    ))}
                  </Grid>
                  <Grid item className={classes.mtNormal}>
                    <Typography variant="h6" color="primary" className={classes.sectionTitle}>
                      Location
                    </Typography>
                  </Grid>
                  <Grid data-testid="eventDetailLocation" item style={{ marginTop: 18 }}>
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
                        <RoomOutlined
                          variant="outlined"
                          className={classes.icon}
                          color="secondary"
                        />
                        {event.location.data.name}
                      </Typography>
                    )}
                    {event.location.type == 'venue' ? (
                      <Map location={event.location} />
                    ) : (
                      <Link
                        color="secondary"
                        href={event.location.data.url || '#'}
                        target={event.location.data.url ? '_blank' : ''}
                      >
                        {event.location.data.url || 'No link specified.'}
                      </Link>
                    )}
                  </Grid>
                  <Grid item className={classes.mtNormal}>
                    <Typography variant="h6" color="primary" className={classes.sectionTitle}>
                      Share
                    </Typography>
                  </Grid>
                  <Grid item style={{ marginTop: 18 }}>
                    <FacebookShareButton
                      id="facebook-share-event"
                      url={window.location.href}
                      quote={`Nexthuman: ${event.title}`}
                      className={classes.shareButton}
                    >
                      <Facebook fontSize="large" color="secondary"></Facebook>
                    </FacebookShareButton>
                    <TwitterShareButton
                      id="twitter-share-event"
                      url={window.location.href}
                      title={`Nexthuman: ${event.title}`}
                      className={classes.shareButton}
                    >
                      <Twitter fontSize="large" color="secondary"></Twitter>
                    </TwitterShareButton>
                  </Grid>
                </Grid>
              </Grid>
            </Container>
            <EditButton event={event} character={curCharacter} />
          </Box>
          <Box
            className={[classes.root, classes.ptNormal].join(' ')}
            style={{ paddingBottom: 60, background: '#FAFAFA' }}
          >
            <Container>
              <Typography
                variant="h6"
                color="primary"
                className={[classes.sectionTitle, classes.mbNormal].join(' ')}
              >
                Relevant Events
              </Typography>
              <Grid container alignItems="flex-start" justify="center">
                <Grid item container spacing={3} data-testid="eventDetailRelevants">
                  <Events events={eventsRelevant}></Events>
                </Grid>
              </Grid>
            </Container>
          </Box>
          <Modal title="Producers" open={producersDlg} onClose={() => setProducersDlg(false)}>
            <Grid container className={classes.charactersWrapper}>
              <Grid item xs={12}>
                {event.producers.map((character, index) => (
                  <Button
                    variant="text"
                    key={`mc-${index}`}
                    onClick={() => history.push(`/character/${character.id}`)}
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
          <Modal
            title="Participants"
            open={participantsDlg}
            onClose={() => setParticipantsDlg(false)}
          >
            <Grid container className={classes.charactersWrapper}>
              <Grid item xs={12}>
                {event.participants.map((character, index) => (
                  <Button
                    variant="text"
                    key={`mt-${index}`}
                    onClick={() => history.push(`/character/${character.id}`)}
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
        </>
      )}
    </>
  );
};
