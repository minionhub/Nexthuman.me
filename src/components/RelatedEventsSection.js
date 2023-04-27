import React, { useState } from 'react';

import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { makeStyles, useTheme, Typography, Grid, useMediaQuery, Box } from '@material-ui/core';
import MUILink from '@material-ui/core/Link';
import MenuBookOutlinedIcon from '@material-ui/icons/MenuBookOutlined';
import theme from '../theme';

const useStyles = makeStyles({
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 18,
    '& .MuiLink-button': {
      fontFamily: 'Lato',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '13px',
      lineHeight: '16px',
      letterSpacing: '0.4px',
      marginLeft: 'auto',
    },
  },
  contentWrapper: {
    position: 'relative',
    borderRadius: '4px',
    paddingTop: '74.07%',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    overflow: 'hidden',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',

    [theme.breakpoints.down('md')]: {
      paddingTop: '74.07%',
    },
    '& .overlay': {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(180deg, rgba(40, 60, 99, 0.6) 0%, rgba(106, 44, 112, 0.6) 100%)',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 8px 13.47px',
    },
    '& .MuiTypography-subtitle2': {
      fontWeight: 500,
      color: 'white',
      letterSpacing: '0.15px',
    },
    '& .body3': {
      fontWeight: 'normal',
      fontSize: 12,
      lineHeight: '14px',
      letterSpacing: '0.15px',
      color: 'white',
      margin: 'auto 0 0 0',
    },
    '& .book-icon': {
      fontSize: 29,
      color: '#E0E0E0',
      position: 'absolute',
      top: 'calc(50% - 14.5px)',
      left: 'calc(50% - 14.5px)',
    },
  },
});

export default ({ events }) => {
  const classes = useStyles({ theme: useTheme() });
  const history = useHistory();
  const [showAll, setShowAll] = useState(false);
  const matchesMd = useMediaQuery(theme.breakpoints.down('md'));

  const getDate = (from, to) => {
    const fromMoment = moment(from).local();
    const toMoment = moment(to).local();

    if (from === to) return fromMoment.format('Do MMM. YYYY');
    else if (fromMoment.year() === toMoment.year()) {
      if (fromMoment.month() === toMoment.month()) {
        return `${fromMoment.format('Do')} - ${toMoment.format('Do MMM. YYYY')}`;
      } else {
        return `${fromMoment.format('Do MMM.')} - ${toMoment.format('Do MMM. YYYY')}`;
      }
    } else return `${fromMoment.format('Do MMM. YYYY')} - ${toMoment.format('Do MMM. YYYY')}`;
  };

  return (
    <>
      <Grid item xs={12} className={classes.header}>
        <Typography variant="h5" color="primary">
          Related Events
        </Typography>
        {events.length > 4 && (
          <MUILink
            component="button"
            onClick={() => {
              setShowAll(!showAll);
            }}
            color="primary"
          >
            {showAll ? 'Show Less' : 'See All'}
          </MUILink>
        )}
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={matchesMd ? 2 : 4}>
          {events.length > 0 ? (
            <>
              {events.map((event, idx) => {
                if (!showAll && idx > 3) return null;
                else
                  return (
                    <Grid item md={3} sm={6} xs={6} key={event.id}>
                      <Box
                        className={classes.contentWrapper}
                        style={{
                          backgroundImage: `url(${
                            event.coverImage && event.coverImage.src ? event.coverImage.src : ''
                          })`,
                        }}
                        onClick={() => {
                          history.push(`/events/${event.id}`);
                        }}
                      >
                        <Box className="overlay">
                          <Typography variant="subtitle2">{event.title}</Typography>
                          <Typography className="body3">{getDate(event.from, event.to)}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  );
              })}
            </>
          ) : (
            <>
              {Array.from(Array(4).keys()).map((item) => {
                return (
                  <Grid item sm={3} xs={6} key={item}>
                    <Box className={classes.contentWrapper} style={{ backgroundColor: '#F2F2F2' }}>
                      <MenuBookOutlinedIcon className="book-icon" />
                    </Box>
                  </Grid>
                );
              })}
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
};
