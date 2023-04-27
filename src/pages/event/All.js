import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import MUILink from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AddIcon from '@material-ui/icons/Add';
import FabButton from '../../components/form/FabButton';
import { Button, Box } from '@material-ui/core';
import { TrafficOutlined, EventNoteOutlined } from '@material-ui/icons';

import EventCard from '../../components/EventCard';

import eventActions from '../../store/actions/events';
import characterActions from '../../store/actions/characters';

import routes from '../../constants/routes.json';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Grid
      container
      justify="flex-start"
      wrap="wrap"
      spacing={2}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </Grid>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
  },
  container: {
    padding: '30px 20px 40px',
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
  },
  title: {
    marginBottom: 20,
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
  tabIndex: {
    width: 160,
    fontFamily: 'Fira Sans',
    textTransform: 'none',
    fontWeight: 'normal',
    fontSize: 18,
    [theme.breakpoints.down('sm')]: {
      width: '50%',
    },
  },
  titlePrev: {
    marginBottom: 40,
    marginTop: 40,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 24,
      marginTop: 24,
    },
  },
  breadcrumbs: {
    fontSize: 14,
  },
  loadMore: {
    textTransform: 'uppercase',
    marginTop: 30,
    padding: 15,
    width: 160,
    [theme.breakpoints.down('sm')]: {
      marginTop: 20,
      width: '100%',
      border: '1px solid #6A2C70',
    },
  },
  createBtn: {
    padding: '15px 24px',
    borderRadius: '24px',
    marginTop: '30px',
  },
  floatingBtnContainer: {
    maxWidth: 1440,
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
  loginReq: {
    textAlign: 'center',
    marginBottom: 30,
    width: '100%',
  },
  attendingWrapper: {
    '& .wrapperBox': {
      position: 'relative',
      width: '100%',
      boxSizing: 'border-box',
      paddingTop: '73.75%',
      backgroundColor: '#F2F2F2',
      borderRadius: '4px',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      fontFamily: 'Fira Sans',
      cursor: 'pointer',
      '& .content': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
      },
      '& .event-icon': {
        color: '#E0E0E0',
        fontSize: '24px',
      },
    },
  },
}));

export default () => {
  const classes = useStyles({ theme: useTheme() });
  const history = useHistory();
  const dispatch = useDispatch();
  const LIMIT = 8;
  const userStore = useSelector((state) => state.userStore);
  const [authUser, setAuthUser] = useState(null);

  const [eventsActive, setEventsActive] = useState(0);
  const [startActive, setStartActive] = useState(0);
  const [totalActive, setTotalActive] = useState(0);
  const [loadingActive, setLoadingActive] = useState(false);

  const [eventsOwned, setEventsOwned] = useState(0);
  const [totalOwned, setTotalOwned] = useState(0);
  const [pageOwned, setPageOwned] = useState(1);
  const [loadingOwned, setLoadingOwned] = useState(false);

  const [eventsPrev, setEventsPrev] = useState(0);
  const [loadingPrev, setLoadingPrev] = useState(false);

  const [tabIndex, setTabIndex] = useState(0);

  const [curCharacter, setCurCharacter] = useState(null);

  const getEventsActive = (limit, startAfter) =>
    dispatch(eventActions.getEventsActive(limit, startAfter));
  const getEventsPrev = (characterId) => dispatch(eventActions.getEventsPrev(characterId));
  const getEventsOwned = (limit, page, characterId) =>
    dispatch(eventActions.getEventsOwned(limit, page, characterId));
  const getCharacters = (uid) => dispatch(characterActions.getCharacters(uid));

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const goToEvent = (event) => {
    history.push(`/events/${event.id}`);
  };

  useEffect(() => {
    if (!eventsActive) loadMoreActive();
  });

  useEffect(() => {
    if (!eventsOwned && curCharacter) loadMoreOwned();
    if (!eventsPrev && curCharacter) {
      setLoadingPrev(true);
      getEventsPrev(curCharacter.characterId).then((res) => {
        setEventsPrev(res);
        setLoadingPrev(false);
      });
    }
  }, [curCharacter]);

  useEffect(() => {
    if (userStore.authUser != null) {
      setAuthUser(userStore.authUser);
      getCharacters(userStore.authUser.uid).then((characters) => {
        characters.forEach((item) => {
          if (item.characterId == userStore.authUser.lastSelectedCharacter) {
            setCurCharacter(item);
          }
        });
      });
    }
  }, [userStore]);

  const loadMoreActive = (event) => {
    if (loadingActive) return;
    setLoadingActive(true);
    getEventsActive(LIMIT, startActive).then((res) => {
      setEventsActive(Array.from(eventsActive).concat(res.events));
      setStartActive(res.end);
      setTotalActive(res.total);
      setLoadingActive(false);
    });
  };

  const loadMoreOwned = (event) => {
    if (loadingOwned) return;
    if (curCharacter) {
      setLoadingOwned(true);
      getEventsOwned(LIMIT, pageOwned, curCharacter.characterId).then((res) => {
        setEventsOwned(Array.from(eventsOwned).concat(res.events));
        setTotalOwned(res.total);
        setPageOwned(pageOwned + 1);
        setLoadingOwned(false);
      });
    }
  };

  const DummyEvents = ({ count }) => {
    return (
      <>
        {Array.from(Array(count).keys()).map((item) => {
          return (
            <Grid
              item
              className={classes.attendingWrapper}
              lg={3}
              md={4}
              sm={6}
              xs={6}
              key={'de-' + item}
            >
              <Box className="wrapperBox">
                <Box className="content">
                  <EventNoteOutlined className="event-icon" />
                </Box>
              </Box>
            </Grid>
          );
        })}
      </>
    );
  };

  const Events = (props) => {
    if (!props.events && props.loading)
      return (
        <Grid item container justify={'center'}>
          <CircularProgress />
        </Grid>
      );
    else if (props.events.length <= 0 && !props.loading) return <DummyEvents count={8} />;
    else
      return Object.values(props.events).map((event, idx) => (
        <Grid item lg={3} md={4} sm={6} xs={6} key={'eo-' + idx}>
          <EventCard event={event} onClick={goToEvent} />
        </Grid>
      ));
  };

  return (
    <Grid className={classes.root} container justify="center">
      <Grid className={classes.container} container direction="column" wrap="nowrap">
        <Grid item>
          <Typography variant="h4" color="primary">
            Explore Events
          </Typography>
          <Typography className={classes.breadcrumbs}>
            <MUILink href="/" color="secondary">
              Home
            </MUILink>
            &nbsp;/ Explore Events
          </Typography>
        </Grid>
        <Grid container alignItems="flex-start" justify="center">
          <Grid item container justify="center">
            <Tabs
              className={classes.tabs}
              value={tabIndex}
              onChange={handleChange}
              aria-label="Events"
              indicatorColor="secondary"
              textColor="secondary"
              centered
              spacing={2}
            >
              <Tab className={classes.tabIndex} label="All" {...a11yProps(0)} />
              <Tab
                className={classes.tabIndex}
                label="My Events"
                {...a11yProps(1)}
                data-testid="tab-eventsOwned"
              />
            </Tabs>
          </Grid>

          <TabPanel item container data-testid="grid-eventsActive" value={tabIndex} index={0}>
            <Grid item container spacing={3}>
              <Events events={eventsActive} loading={loadingActive}></Events>
            </Grid>
            <Grid item container justify={'flex-end'}>
              {eventsActive.length < totalActive && (
                <Button color="secondary" className={classes.loadMore} onClick={loadMoreActive}>
                  {loadingActive ? <CircularProgress size={24} /> : 'Load More'}
                </Button>
              )}
            </Grid>
          </TabPanel>
          <TabPanel item container data-testid="grid-eventsOwned" value={tabIndex} index={1}>
            {authUser && authUser.emailVerified && (
              <React.Fragment>
                <Grid item container spacing={3}>
                  <Events events={eventsOwned} loading={loadingOwned}></Events>
                </Grid>
                <Grid item container justify={'flex-end'}>
                  {eventsOwned.length < totalOwned && (
                    <Button color="secondary" className={classes.loadMore} onClick={loadMoreOwned}>
                      {loadingOwned ? <CircularProgress size={24} /> : 'Load More'}
                    </Button>
                  )}
                </Grid>
              </React.Fragment>
            )}
            {(!authUser || !authUser.emailVerified) && (
              <Grid item container spacing={3}>
                <DummyEvents count={8} />
              </Grid>
            )}
          </TabPanel>
        </Grid>
        {authUser && authUser.emailVerified && (
          <>
            <Grid item>
              <Typography variant="h4" color="primary" className={classes.titlePrev}>
                Previous Events
              </Typography>
            </Grid>
            <Grid container alignItems="flex-start" justify="center">
              <Grid item container spacing={3} data-testid="grid-eventsPrev">
                {loadingPrev ? (
                  <Grid item container justify={'center'}>
                    <CircularProgress />
                  </Grid>
                ) : (
                  <Events events={eventsPrev} loading={loadingPrev}></Events>
                )}
              </Grid>
            </Grid>
          </>
        )}
      </Grid>

      <div className={classes.floatingBtnContainer}>
        <FabButton
          color="secondary"
          data-testid="btn-createEvent"
          icon={<AddIcon className={classes.extendedIcon} />}
          onClick={() => history.push(routes.NEWEVENT)}
        >
          CREATE EVENT
        </FabButton>
      </div>
    </Grid>
  );
};
