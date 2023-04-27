import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { useParams, useHistory } from 'react-router-dom';
import MUILink from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import { Accordion, AccordionSummary } from './Accordion';
import PersonList from '../components/PersonList';
import ExperiencesList from '../components/ExperiencesList';
import { getStoriesOfChapter } from '../services/story/story.firebase';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: '20px, 10px',

    [theme.breakpoints.up('md')]: {
      padding: '30px  20px',
    },
  },
  gridTitle: {
    paddingBottom: 0,
    '& .MuiTypography-root': {
      fontFamily: 'Fira Sans',
    },
  },
  gridPersonList: {
    padding: '20px 0',
  },
  gridExperiences: {
    padding: '8px 0 0 0',
  },
  subcontent: {
    padding: '20px 0px',
  },
  gridtitle: {
    paddingTop: '0',
  },
}));

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: '23px 53px',
    [theme.breakpoints.down('md')]: {
      padding: '17px  8px',
    },
  },
}))(MuiAccordionDetails);

export default (props) => {
  const { bookId, chapterId, expandedId, setExpandedId } = props;
  const classes = useStyles();
  const history = useHistory();

  const [stories, setStories] = useState([]);

  useEffect(() => {
    getStoriesOfChapter(bookId, chapterId)
      .then((res) => {
        setStories([...res.sort((a, b) => a.order - b.order)]);
      })
      .catch((err) => {
        setStories([]);
      });
  }, [chapterId]);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpandedId(newExpanded ? panel : false);
  };

  return (
    <Grid className={classes.root} container justify="center">
      {stories.map((story, idx) => {
        const panelId = `panel_story_${story.id}`;
        const summary = `Story ${idx + 1}: ${story.title}`;
        return (
          <Accordion
            key={idx + 1}
            square
            expanded={`panel_story_${expandedId}` === panelId}
            onChange={handleChange(story.id)}
          >
            <AccordionSummary aria-controls={`${panelId}-content`} id={`${panelId}-header`}>
              <Typography>{summary}</Typography>
              <MUILink
                component="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  history.push({
                    pathname: `/stories/details/${story.id}`,
                    state: { bookId: bookId, chapterId: chapterId, storyId: expandedId },
                  });
                }}
              >
                View Story
              </MUILink>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container direction="column" className={classes.content}>
                {story && (
                  <>
                    {story.subtitle && (
                      <Grid item className={classes.gridTitle}>
                        <Typography variant="body2">{story.subtitle}</Typography>
                      </Grid>
                    )}
                    {story.writers && (
                      <Grid item className={classes.gridPersonList}>
                        <PersonList characters={story.writers} spacing={2}></PersonList>
                      </Grid>
                    )}
                    <Grid item className={classes.gridExperiences}>
                      <ExperiencesList experiences={story.experiences} spacing={2} />
                    </Grid>
                  </>
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Grid>
  );
};
