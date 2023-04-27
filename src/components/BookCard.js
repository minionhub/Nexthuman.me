import React from 'react';

import { useHistory } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Grid, Typography, Button, CardMedia, Chip } from '@material-ui/core';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import DateRangeIcon from '@material-ui/icons/DateRange';
import SimpleBar from 'simplebar-react';

const useStyles = makeStyles((theme) => ({
  root: {
    height: 355,
    minWidth: '540px',
    margin: '24px 0px',
    backgroundColor: 'transparent',
    borderRadius: '4px',
    overflow: 'hidden',
    '&:hover': {
      boxShadow: theme.shadows[5],
    },
    ['@media (max-width: 1439px)']: {
      minWidth: '100%',
    },
    ['@media (max-width: 959px)']: {
      maxWidth: '540px',
      minWidth: 'auto',
      margin: '0 auto',
    },
    [theme.breakpoints.down('xs')]: {
      width: 384,
      height: 270,
      margin: '12px 0px',
    },
    ['@media (max-width: 413px)']: {
      width: '100%',
    },
  },
  mediaContent: {
    position: 'relative',
    width: 255,
    height: 355,
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 12px',
    ['@media (max-width: 1439px)']: {
      width: '50%',
    },
    [theme.breakpoints.down('xs')]: {
      width: 204,
      height: 270,
      paddingBottom: '18px',
    },
    ['@media (max-width: 413px)']: {
      width: '50%',
    },
  },
  media: {
    borderRadius: '4px 4px 0 0',
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1,
  },
  mediaOverlay: {
    opacity: 0.5,
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    background: 'linear-gradient(115.76deg, #283C63 -8.21%, #6A2C70 106.61%);',
  },
  details: {
    zIndex: 1,
    color: 'white',
    padding: '25px 10px',
  },
  title: {
    margin: 'auto 0 0 0',
    fontFamily: 'Fira Sans',
    color: 'white',
    [theme.breakpoints.down('xs')]: {
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '20px',
      lineHeight: '24px',
      letterSpacing: '0.15px',
      margin: 'auto 0 0 0',
    },
  },
  subTitle: {
    fontFamily: 'Lato',
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    lineHeight: '14px',
    letterSpacing: '0.25px',
    color: 'white',
    margin: '8px 0 0 0',
  },
  detailCountWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 6,

    '& .MuiChip-root': {
      padding: '0 10px',
      height: '26px',
      marginTop: 6,
      [theme.breakpoints.down('xs')]: {
        padding: '0 8px',
      },
      '& .MuiSvgIcon-root': {
        margin: '0 5px 0 0',
      },
      '& .MuiChip-label': {
        padding: '0',
        fontFamily: 'Lato',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '12px',
        lineHeight: '14px',
        letterSpacing: '0.25px',
        color: '#FFFFFF',
      },
    },
  },
  label: {
    fontFamily: 'Lato',
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    lineHeight: '14px',
    letterSpacing: '0.25px',
    [theme.breakpoints.down('xs')]: {
      fontSize: '10px',
      lineHeight: '12px',
      padding: 0,
    },
  },
  action: {
    marginRight: '8px',
    [theme.breakpoints.down('xs')]: {
      marginRight: '4px',
    },
  },
  actionContainer: {
    padding: '0 30px 25px 30px',
    border: '1px solid #FAFAFA',
    borderLeft: 'none',
    boxSizing: 'border-box',
    borderRadius: '0px 4px 4px 0px',
    width: 'calc(100% - 255px)',
    height: 355,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    ['@media (max-width: 1439px)']: {
      width: '50%',
    },
    [theme.breakpoints.down('xs')]: {
      padding: '0 15px 15px 20px',
      height: 270,
      width: 180,
    },
    ['@media (max-width: 413px)']: {
      width: '50%',
    },
  },
  subject: {
    margin: '15px 0 10px',
    [theme.breakpoints.down('xs')]: {
      margin: '15px 0 4px',
      fontFamily: 'Fira Sans',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '17px',
      letterSpacing: '0.15px',
    },
  },
  latestStories: {
    width: '100%',
    height: '64px',
  },
  upcomingEvents: {
    width: '100%',
    maxHeight: '96px',
  },
  openBtn: {
    marginLeft: '-7px',
    paddingLeft: '8px',
    paddingRight: '8px',
    marginTop: 'auto',
    [theme.breakpoints.down('xs')]: {
      marginTop: 'auto',
    },
  },
  actions: {
    width: '100%',
    fontFamily: 'Fira Sans',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '16px',
    lineHeight: '19px',
    letterSpacing: '0.15px',
    color: '#333333',
    marginLeft: '-8px',
    paddingLeft: '8px',
    paddingRight: '8px',
    justifyContent: 'flex-start',
    '& .MuiButton-label': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: 'block',
      textAlign: 'left',
    },
    '& .MuiButton-startIcon': {
      float: 'left',
      marginLeft: 0,
      height: 20,
    },
    [theme.breakpoints.down('xs')]: {
      fontFamily: 'Lato',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '12px',
      lineHeight: '14px',
      paddingTop: '5px',
      paddingBottom: '5px',
      paddingLeft: '5px',
      letterSpacing: '0.25px',
    },
  },
  chipIcon: {
    fontSize: 12,
    width: 12,
    height: 12,
    [theme.breakpoints.down('xs')]: {
      fontSize: 11,
      width: 11,
      height: 11,
    },
  },
}));

const DEFAULT_COVER_IMAGE =
  'https://images.squarespace-cdn.com/content/v1/551dabf6e4b008920a354e82/1452714433264-6T39HAD2T42VF3JG7U6Z/ke17ZwdGBToddI8pDm48kMUW853eF0JL6ooZqMQl0TEUqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYxCRW4BPu10St3TBAUQYVKcBT4_6C-oPlXEmdkc_QKpzD5vE2TZB1uAoZtbWfS3iPUVbK0u-K9mznXgIgdDqg7W/event+booking+background.jpg?format=2500w';

export default ({ book, openBook, detailBackBg = 'white', styles = {}, ...props }) => {
  const classes = useStyles({ ...props, theme: useTheme() });
  const {
    bookname,
    subtitle,
    latestStories = [],
    upcomingEvents = [],
    coverImage: { src: coverImageSrc = DEFAULT_COVER_IMAGE } = {},
  } = book;

  const history = useHistory();

  return (
    <Grid container className={classes.root} style={styles}>
      <Grid item className={classes.mediaContent}>
        <CardMedia className={classes.media} image={coverImageSrc}>
          <div className={classes.mediaOverlay} />
        </CardMedia>
        <Typography variant="h5" className={classes.title} data-testid="book-name">
          {bookname}
        </Typography>
        <Typography className={classes.subTitle}>{subtitle}</Typography>

        {/* <div className={classes.detailCountWrapper}>
          <Chip
            icon={<MenuBookIcon className={classes.chipIcon} />}
            label="18 Stories"
            color="secondary"
            size="small"
            className={[classes.label, classes.action].join(' ')}
          />
          <Chip
            icon={<DateRangeIcon className={classes.chipIcon} />}
            label="18 Events"
            color="secondary"
            size="small"
            className={classes.label}
          />
        </div> */}
      </Grid>
      <Grid
        item
        container
        direction={'column'}
        alignItems={'flex-start'}
        className={classes.actionContainer}
        style={{ backgroundColor: detailBackBg }}
      >
        <Typography className={classes.subject} color="primary" variant="h6">
          Latest Stories
        </Typography>
        <SimpleBar className={classes.latestStories}>
          {latestStories.map((story) => {
            return (
              <Button
                key={story.id}
                startIcon={<MenuBookIcon color="secondary" />}
                className={classes.actions}
                onClick={() => {
                  history.push(`stories/details/${story.id}`);
                }}
              >
                {story.title}
              </Button>
            );
          })}
        </SimpleBar>
        <Typography className={classes.subject} color="primary" variant="h6">
          Upcoming Events
        </Typography>
        {upcomingEvents && upcomingEvents.length > 0 && (
          <SimpleBar className={classes.upcomingEvents}>
            {upcomingEvents.map((event) => {
              return (
                <Button
                  key={event.id}
                  startIcon={<DateRangeIcon color="secondary" />}
                  className={classes.actions}
                  onClick={() => {
                    history.push(`/events/${event.id}`);
                  }}
                >
                  {event.title}
                </Button>
              );
            })}
          </SimpleBar>
        )}
        <Button
          className={classes.openBtn}
          color="secondary"
          variant="contained"
          data-testid="btn-viewBook"
          onClick={() => openBook(book.id)}
        >
          VIEW BOOK
        </Button>
      </Grid>
    </Grid>
  );
};
