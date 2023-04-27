import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography, Grid, useMediaQuery } from '@material-ui/core';
import MUILink from '@material-ui/core/Link';
import MenuBookOutlinedIcon from '@material-ui/icons/MenuBookOutlined';
import theme from '../theme';

const useStyles = makeStyles({
  storyHeader: {
    display: 'flex',
    alignItems: 'center',
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
  storyWrapper: {
    position: 'relative',
    borderRadius: '4px',
    paddingTop: '74.4%',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    overflow: 'hidden',
    cursor: 'pointer',
    [theme.breakpoints.down('md')]: {
      paddingTop: '73.86%',
    },
    '& .overlay': {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(180deg, rgba(40, 60, 99, 0.6) 0%, rgba(106, 44, 112, 0.6) 100%)',
    },
    '& .MuiTypography-subtitle2': {
      fontWeight: 500,
      color: '#fff',
      position: 'absolute',
      left: '24px',
      right: '24px',
      bottom: '22.15px',
      [theme.breakpoints.down('md')]: {
        left: '12px',
        right: '12px',
        bottom: '10px',
      },
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

const CharacterStorySection = ({ stories }) => {
  const classes = useStyles({ theme: useTheme() });
  const history = useHistory();
  const [showAll, setShowAll] = useState(false);
  const matchesMd = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <Grid item xs={12} className={classes.storyHeader}>
        <Typography variant="h5" color="primary">
          Stories
        </Typography>
        {stories.length > 4 && (
          <MUILink
            component="button"
            onClick={() => {
              setShowAll(!showAll);
            }}
            color="primary"
          >
            See All
          </MUILink>
        )}
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={matchesMd ? 2 : 4}>
          {stories.length > 0 ? (
            <>
              {stories.map((item, idx) => {
                if (!showAll && idx > 3) return null;
                else
                  return (
                    <Grid item sm={3} xs={6} key={item.id}>
                      <div
                        className={classes.storyWrapper}
                        style={{ backgroundImage: `url(${item.coverImage.src || ''})` }}
                        onClick={() => {
                          history.push(`/stories/details/${item.id}`);
                        }}
                      >
                        <div className="overlay"></div>
                        <Typography variant="subtitle2">{item.title}</Typography>
                      </div>
                    </Grid>
                  );
              })}
            </>
          ) : (
            <>
              {Array.from(Array(4).keys()).map((item) => {
                return (
                  <Grid item sm={3} xs={6} key={item}>
                    <div className={classes.storyWrapper} style={{ backgroundColor: '#F2F2F2' }}>
                      <MenuBookOutlinedIcon className="book-icon" />
                    </div>
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

export default CharacterStorySection;
