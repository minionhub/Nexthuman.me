import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import { Grid, Typography } from '@material-ui/core';
import MUILink from '@material-ui/core/Link';
import ExperienceScoreBar from './ExperienceScoreBar';
import theme from '../theme';

const useStyles = makeStyles({
  header: {
    display: 'flex',
    alignItems: 'center',
    '& .MuiLink-button': {
      fontFamily: 'Lato',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '13px',
      lineHeight: '16px',
      letterSpacing: '0.4px',
      marginLeft: 'auto'
    }
  },
  skeletonExperience: {
    borderRadius: '4px',
    backgroundColor: '#F2F2F2'
  }
});

const CharacterExScoreSection = ({ isNew = false, experiences = [] }) => {
  const classes = useStyles({ theme: useTheme() });
  const [showAll, setShowAll] = useState(false);
  return (
    <>
      <Grid item className={classes.header}>
        <Typography variant="h5" color="primary">
          Experience
        </Typography>
        {experiences.length > 4 && (
          <MUILink
            className={classes.seeAllButton}
            component="button"
            onClick={() => {
              setShowAll(!showAll);
            }}
            color="primary"
          >
            {showAll ? 'See Less' : 'See All'}
          </MUILink>
        )}
      </Grid>

      <Grid item>
        <Grid container spacing={2} direction="column">
          {isNew || experiences.length === 0 ? (
            <>
              {Array.from(Array(4).keys()).map((item, idx) => {
                return (
                  <Grid item key={idx} xs={12}>
                    <Skeleton
                      className={classes.skeletonExperience}
                      variant="rect"
                      width={159}
                      height={32}
                      style={{ marginBottom: theme.spacing(1) }}
                      animation={false}
                    />
                    <Skeleton
                      className={classes.skeletonExperience}
                      variant="rect"
                      width="100%"
                      height={32}
                      animation={false}
                    />
                  </Grid>
                );
              })}
            </>
          ) : (
            <>
              {experiences.map((item, idx) => {
                if (idx > 3 && !showAll) return null;
                else
                  return (
                    <Grid item key={item.id} xs={12}>
                      <ExperienceScoreBar experience={item} />
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

export default CharacterExScoreSection;
