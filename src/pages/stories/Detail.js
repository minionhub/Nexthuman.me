import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { makeStyles, useTheme, Box, Grid, Typography, Button, CardMedia } from '@material-ui/core';
import MUILink from '@material-ui/core/Link';
import { Facebook, Twitter } from '@material-ui/icons';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import * as yup from 'yup';
import SelectField from '../../components/form/SelectField';
import Modal from '../../components/Modal';
import FloatingBtnContainer from '../../components/FloatingBtnContainer';
import FloatingButton from '../../components/form/FloatingButton';
import Map from '../../components/form/Map';
import PersonList from '../../components/PersonList';
import ExperiencesList from '../../components/ExperiencesList';
import RelatedEventsSection from '../../components/RelatedEventsSection';
import storyActions from '../../store/actions/stories';
import { getStory } from '../../services/story/story.firebase';

const useStyles = makeStyles((theme) => ({
  root: {
    height: 'auto',
    minHeight: 'calc(100vh - 130px)',
    [theme.breakpoints.up('sm')]: {
      minHeight: 'calc(100vh - 130px)',
    },
    ['@media (min-width: 780px)']: {
      minHeight: 'calc(100vh - 160px)',
    },
  },
  form: {
    width: '400px',
    padding: 24,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  formBtn: {
    minWidth: '230px',
    padding: '15px 24px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  banner: {
    position: 'relative',
  },
  media: {
    width: '100%',
    height: 425,
    maxHeight: 425,
    backgroundSize: 'cover',
    backgroundPositionY: 'center',
    backgroundPositionX: 'center',
    [theme.breakpoints.up('sm')]: {
      height: 700,
      maxHeight: 700,
    },
  },
  overlay: {
    background:
      'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 51.13%, rgba(0, 0, 0, 0.8) 100%)',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
  },
  bannerContent: {
    position: 'absolute',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    maxWidth: 800,
    overflowX: 'hidden',
    padding: '0 23px',
    [theme.breakpoints.up('sm')]: {
      padding: '0 30px',
    },
  },
  title: {
    paddingBottom: 25,
    color: 'white',
    [theme.breakpoints.down('sm')]: {
      fontSize: '34px',
      lineHeight: '41px',
      letterSpacing: 0.25,
    },
  },
  subTitle: {
    paddingBottom: 90,
    color: 'white',

    [theme.breakpoints.down('sm')]: {
      fontSize: '16px',
      lineHeight: '19px',
      letterSpacing: 0.15,
    },
  },
  content: {
    padding: '20px 23px 30px',
    maxWidth: 800,
    overflowX: 'hidden',
    '& > .MuiGrid-item': {
      padding: '20px 0',
    },
    '& .content-title-one': {
      marginBottom: 32,
    },
    '& .content-title-two': {
      marginBottom: 18,
    },
    [theme.breakpoints.up('sm')]: {
      padding: '40px 30px 60px',
    },
  },
  storyContent: {
    display: 'block',
    whiteSpace: 'break-spaces',
    width: '100%',
    overflowX: 'hidden',
    '& *': {
      whiteSpace: 'break-spaces',
      // wordBreak: 'break-all',
    },
  },
  shareButton: {
    marginRight: 10,
    outline: 'none',
    transition: 'color .3s',
    '&:hover svg': {
      color: '#283C63',
    },
  },
}));
const validationSchema = yup.object().shape({
  bookId: yup.string().required('Book is required'),
  chapterId: yup.string().required('Chapter is required'),
});
export default () => {
  const classes = useStyles({ theme: useTheme() });
  const { storyId } = useParams();
  const [story, setStory] = useState(null);
  const [bookId, setBookId] = useState('');
  const [chapterId, setChapterId] = useState('');
  const [confirmDlg, setConfirmDlg] = useState(false);
  const [errors, setErrors] = useState({});
  const history = useHistory();
  const location = useLocation();

  const dispatch = useDispatch();
  const addStoryToChapter = () =>
    dispatch(storyActions.addStoryToChapter(storyId, { chapterId, bookId }));
  const doValidation = () => {
    const data = { bookId, chapterId, storyId };
    try {
      validationSchema.validateSync(data, {
        abortEarly: false,
        recursive: true,
        stripUnknown: true,
      });
      setErrors({});
      return true;
    } catch (e) {
      setErrors(e.inner.reduce((result, err) => ({ ...result, [err.path]: err }), {}));
      return false;
    }
  };

  useFirestoreConnect([
    {
      collection: 'books',
      where: [['created', '!=', null]],
      order: ['created', 'desc'],
    },
    {
      collection: 'chapters',
      where: [
        ['bookId', '==', bookId],
        ['created', '!=', null],
      ],
      orderBy: ['created', 'asc'],
    },
  ]);

  useEffect(() => {
    return () => {
      if (history.action === 'POP' && !!location.state && !!location.state.chapterId) {
        history.replace({
          pathname: `/books/${location.state.bookId}/chapters`,
          state: { chapterId: location.state.chapterId, storyId: location.state.storyId },
        });
      }
    };
  }, [history]);

  const books = useSelector((state) => state.firestore.data.books || {});
  const chapters = useSelector((state) => state.firestore.data.chapters || {});
  const authUser = useSelector((state) => state.userStore.authUser);

  useEffect(() => {
    if (!!storyId) {
      getStory(storyId).then((resStory) => {
        setStory(resStory);
      });
    }
  }, [storyId]);

  const handleCloseConfirmDlg = () => {
    setConfirmDlg(false);
  };

  const selectBook = (option) => {
    setBookId(option);
  };

  const selectChapter = (option) => {
    setChapterId(option);
  };

  const handleSubmit = () => {
    const valid = doValidation();
    if (valid) {
      addStoryToChapter().then(() => {
        setConfirmDlg(false);
      });
    }
  };

  return (
    <>
      <Grid className={classes.root} container alignItems="center" direction="column">
        <Grid item container className={classes.banner} justify="center">
          <Box
            style={{ backgroundImage: `url('${story ? story.coverImage.src : ''}')` }}
            className={classes.media}
          ></Box>
          <Box className={classes.overlay}></Box>
          <Grid item className={classes.bannerContent} container justify="flex-start">
            <Grid item>
              <Typography variant="h2" className={classes.title}>
                {story && story.title}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h5" className={classes.subTitle}>
                {story && story.subtitle}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container className={classes.content} direction="column">
          {story?.audio?.src && (
            <Grid item>
              <CardMedia component={'audio'} src={story && story.audio.src} controls></CardMedia>
            </Grid>
          )}
          <Grid item>
            {story && (
              <Box
                className={classes.storyContent}
                dangerouslySetInnerHTML={{
                  __html: story.description,
                }}
              />
            )}
          </Grid>
          <Grid item>
            <Typography variant="h5" color="primary" className="content-title-two">
              Writers
            </Typography>
            <Box className={classes.personContainer}>
              {story && story.writers && (
                <PersonList characters={story.writers} spacing={2}></PersonList>
              )}
            </Box>
          </Grid>
          <Grid item>
            <Typography variant="h5" color="primary" className="content-title-two">
              Characters
            </Typography>
            <Box className={classes.personContainer}>
              {story && story.characters && (
                <PersonList characters={story.characters} spacing={2}></PersonList>
              )}
            </Box>
          </Grid>
          <Grid item>
            <Typography variant="h5" color="primary" className="content-title-two">
              Experiences
            </Typography>
            {story && <ExperiencesList experiences={story.experiences} spacing={2} />}
          </Grid>
          <Grid item>
            <Typography variant="h5" color="primary" className="content-title-two">
              Location
            </Typography>
            {story && Object.keys(story.location.data).length > 0 && (
              <Map location={story.location} />
            )}
          </Grid>
          <Grid item container>
            <RelatedEventsSection events={!!story ? story.events : []} />
          </Grid>
          {story && (
            <Grid item>
              <Typography variant="h5" color="primary" style={{ marginBottom: 15 }}>
                Share
              </Typography>
              <Grid container>
                <Grid item>
                  <FacebookShareButton
                    id="facebook-share-story"
                    url={window.location.href}
                    quote={story.title}
                    className={classes.shareButton}
                  >
                    <Facebook fontSize="large" color="secondary"></Facebook>
                  </FacebookShareButton>
                </Grid>
                <Grid item>
                  <TwitterShareButton
                    id="twitter-share-story"
                    url={window.location.href}
                    title={story.title}
                    className={classes.shareButton}
                  >
                    <Twitter fontSize="large" color="secondary"></Twitter>
                  </TwitterShareButton>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
        <FloatingBtnContainer>
          <FloatingButton
            variant="contained"
            color="secondary"
            data-testid="btn-addToBook"
            startIcon={<AddIcon />}
            onClick={() => setConfirmDlg(true)}
          >
            ADD TO BOOK
          </FloatingButton>
          {story &&
            authUser &&
            story.writers.find((item) => item.id === authUser.lastSelectedCharacter) && (
              <FloatingButton
                variant="contained"
                color="secondary"
                data-testid="btn-editStory"
                startIcon={<EditIcon />}
                onClick={() => {
                  history.push(`/stories/Edit/${storyId}`);
                }}
              >
                EDIT STORY
              </FloatingButton>
            )}
        </FloatingBtnContainer>
      </Grid>
      <Modal
        open={confirmDlg}
        onClose={handleCloseConfirmDlg}
        title={'Add story to chapter'}
        data-testid="modal-confirm"
      >
        <Grid container justify={'center'}>
          <Grid item container justify="center" className={classes.form} spacing={3}>
            <Grid item xs={12}>
              {books && (
                <SelectField
                  data-testid="book-select"
                  fullWidth
                  value={bookId}
                  label="Book"
                  options={Object.values(books).map((item, index) => {
                    return { value: item.id, label: item.bookname };
                  })}
                  error={!!errors.bookId}
                  placeholder="Select Book"
                  onChange={selectBook}
                  required={true}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              {chapters && (
                <SelectField
                  data-testid="chapter-select"
                  fullWidth
                  value={chapterId}
                  label="Chapter"
                  options={Object.values(chapters).map((item, index) => {
                    return { value: item.id, label: item.name };
                  })}
                  error={!!errors.chapterId}
                  placeholder="Select Chapter"
                  onChange={selectChapter}
                  required={true}
                />
              )}
            </Grid>
            <Grid item container justify="center">
              <Button
                variant="contained"
                color="secondary"
                className={classes.formBtn}
                data-testid="btn-confirm"
                onClick={handleSubmit}
              >
                ADD STORY TO CHAPTER
              </Button>
            </Grid>
            <Grid item container justify="center">
              <MUILink component="button" onClick={() => setConfirmDlg(false)} color="error">
                CANCEL
              </MUILink>
            </Grid>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};
