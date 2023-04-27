import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { Grid, Typography, Box, Button } from '@material-ui/core';
import MUILink from '@material-ui/core/Link';
import EventNoteOutlinedIcon from '@material-ui/icons/EventNoteOutlined';
import dateUtils from '../utils/date';

const useStyles = makeStyles({
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& .MuiButton-label': {
      fontFamily: 'Lato',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '13px',
      lineHeight: '16px',
      letterSpacing: '0.4px',
      marginLeft: 'auto',
    },
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
        padding: '16px 8px 14px',
      },
      '& .event-icon': {
        color: '#E0E0E0',
        fontSize: '24px',
      },
    },
  },
  title: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 600,
    lineHeight: '17px',
  },
  period: {
    fontSize: 12,
    color: '#fff',
  },
});

const DEFAULT_COVER_IMAGE =
  'https://images.squarespace-cdn.com/content/v1/551dabf6e4b008920a354e82/1452714433264-6T39HAD2T42VF3JG7U6Z/ke17ZwdGBToddI8pDm48kMUW853eF0JL6ooZqMQl0TEUqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYxCRW4BPu10St3TBAUQYVKcBT4_6C-oPlXEmdkc_QKpzD5vE2TZB1uAoZtbWfS3iPUVbK0u-K9mznXgIgdDqg7W/event+booking+background.jpg?format=2500w';

const CharacterAttendingSection = ({ attendings = [], loading = false }) => {
  const classes = useStyles({ theme: useTheme() });
  const [showAll, setShowAll] = useState(false);
  const history = useHistory();

  return (
    <>
      <Grid item container className={classes.header}>
        <Typography variant="h5" color="primary">
          Attending to
        </Typography>
        {attendings.length > 4 && (
          <Button
            variant="text"
            className={classes.seeAllButton}
            component="button"
            onClick={() => {
              setShowAll(!showAll);
            }}
            color="primary"
          >
            {showAll ? 'See Less' : 'See All'}
          </Button>
        )}
      </Grid>
      <Grid item container spacing={2}>
        {loading || attendings.length === 0 ? (
          <>
            {Array.from(Array(4).keys()).map((item) => {
              return (
                <Grid item className={classes.attendingWrapper} xs={6} key={item}>
                  <Box className="wrapperBox">
                    <Box className="content">
                      <EventNoteOutlinedIcon className="event-icon" />
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </>
        ) : (
          <>
            {attendings.map((event, idx) => {
              if (idx > 3 && !showAll) return null;
              return (
                <Grid item className={classes.attendingWrapper} xs={6} key={`at-${idx}`}>
                  <Box
                    className="wrapperBox"
                    style={{
                      backgroundImage: `url(${event.coverImage.src || DEFAULT_COVER_IMAGE})`,
                    }}
                    onClick={() => history.push(`/events/${event.id}`)}
                  >
                    <Box
                      className="content"
                      style={{
                        background:
                          'linear-gradient(180deg, rgba(40, 60, 99, 0.6) 0%, rgba(106, 44, 112, 0.6) 100%)',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Typography className={classes.title}>{event.title}</Typography>
                      <Typography className={classes.period}>
                        {dateUtils.formatRange({ from: event.from, to: event.to })}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </>
        )}
      </Grid>
    </>
  );
};

export default CharacterAttendingSection;
