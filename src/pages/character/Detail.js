import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useFirestoreConnect } from 'react-redux-firebase';
import AddIcon from '@material-ui/icons/Add';
import RoomOutlined from '@material-ui/icons/RoomOutlined';
import {
  CircularProgress,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  DialogContentText,
} from '@material-ui/core';
import characterActions from '../../store/actions/characters';
import eventActions from '../../store/actions/events';
import usersActions from '../../store/actions/users';
import FloatingBtnContainer from '../../components/FloatingBtnContainer';
import FloatingButton from '../../components/form/FloatingButton';
import CharacterUploadAvatar from '../../components/CharacterUploadAvatar';
import CharacterForm from '../../components/CharacterForm';
import CharacterAttendingSection from '../../components/CharacterAttendingSection';
import CharacterStorySection from '../../components/CharacterStorySection';
import { getStoriesIncludingCharacter } from '../../services/story/story.firebase';
import CharacterExScoreSection from '../../components/CharacterExScoreSection';
import theme from '../../theme';

const useStyles = makeStyles({
  root: {
    minHeight: 'calc(100vh - 160px)',
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
      minHeight: 'calc(100vh - 130px)',
    },
  },
  container: {
    maxWidth: 1440,
    padding: '20px 20px',
    [theme.breakpoints.up('sm')]: {
      padding: '60px  20px',
    },
    [theme.breakpoints.up('md')]: {
      padding: '60px  40px',
    },
    [theme.breakpoints.up('lg')]: {
      padding: '60px  160px',
    },
    '@media (max-width:960px)': {
      padding: 0,
    },
  },
  avatarContainer: {
    backgroundColor: '#F2F2F2',
    '@media (min-width:960px)': {
      backgroundColor: 'white',
    },
  },
  chracterInfoSection: {
    marginTop: theme.spacing(4),
    '@media (max-width: 959px)': {
      marginBottom: theme.spacing(4),
      paddingLeft: 24,
      paddingRight: 24,
    },
  },
  experienceScoreWrapper: {},
  attendingContainer: {},
  profileByContainer: {
    marginTop: theme.spacing(4),
    '& .MuiTypography-h6': {
      fontWeight: 400,
      margin: '0 0 13px 0',
    },
  },
  skeleton: {
    borderRadius: '4px',
    backgroundColor: '#F2F2F2',
  },
  storyGrid: {
    backgroundColor: '#FAFAFA',
  },
  storyContainer: {
    maxWidth: 1440,
    padding: '24px 24px 26px',
    [theme.breakpoints.up('sm')]: {
      padding: '46px 20px',
    },
    [theme.breakpoints.up('md')]: {
      padding: '46px 40px',
    },
    [theme.breakpoints.up('lg')]: {
      padding: '46px 160px 80px',
    },
  },
  location: {
    fontSize: 14,
    '& .MuiSvgIcon-root': {
      marginRight: 10,
    },
  },
});

export default () => {
  const classes = useStyles({ theme: useTheme() });
  const { characterId } = useParams();
  const [editMode, setEditMode] = useState(false);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [stories, setStories] = useState([]);

  const [authUser, setAuthUser] = useState(null);
  const [enableEdit, setEnableEdit] = useState(false);
  const [errors, setErrors] = useState({});
  useFirestoreConnect(['experiences']);
  const [characterImage, setCharacterImage] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [tagline, setTagline] = useState('');
  const [bio, setBio] = useState('');
  const [intentions, setIntentions] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [eventsAttending, setEventsAttending] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [owner, setOwner] = useState(null);

  const getEventsAttending = (limit, page, characterId) =>
    dispatch(eventActions.getEventsOwned(limit, page, characterId));
  const allExperiences = useSelector((state) =>
    Object.values(state.firestore.data.experiences || {})
  );
  const [experiences, setExperiences] = useState([]);
  const userStore = useSelector((state) => state.userStore);
  const characterStore = useSelector((state) => state.characterStore);
  const dispatch = useDispatch();
  const createCharacter = (uid, data) => dispatch(characterActions.createCharacter(uid, data));
  const updateCharacter = (characterId, data) =>
    dispatch(characterActions.updateCharacter(characterId, data));
  const deleteCharacter = (characterId) => dispatch(characterActions.deleteCharacter(characterId));
  const getUserByCharacter = (characterId) =>
    dispatch(usersActions.getUserByCharacter(characterId));

  useFirestoreConnect([
    {
      collection: 'profiles',
      doc: characterId,
    },
  ]);
  const character = useSelector(
    (state) => state.firestore.data.profiles && state.firestore.data.profiles[characterId]
  );
  const history = useHistory();

  const saveCharacter = () => {
    if (characterId) {
      updateCharacter(characterId, {
        name: characterName,
        tagline,
        bio,
        intentions,
        experiences,
        anonymous,
        avatar: characterImage,
      }).then(() => {
        setEditMode(false);
      });
      return;
    }
    createCharacter(authUser.uid, {
      name: characterName,
      tagline,
      bio,
      intentions,
      experiences,
      anonymous,
      avatar: characterImage,
    }).then((character) => {
      console.log(character);
    });
  };

  const handleCloseDialog = () => {
    setIsOpenDeleteDialog(false);
  };

  const doDeleteCharacter = () => {
    deleteCharacter(characterId).then(() => {
      const firstCharacter = characterStore.characters.filter((item) => {
        return item.characterId != characterId;
      })[0];
      console.log(firstCharacter.characterId);
      handleCloseDialog();
      history.push('/character/' + firstCharacter.characterId);
    });
  };

  // useEffect(() => {
  //   setAuthUser(userStore.authUser);
  // }, [userStore.authUser]);

  useEffect(() => {
    if (character) {
      setCharacterName(character.name);
      setExperiences(character.experiences);
      setIntentions(character.intentions);
      setBio(character.bio);
      setTagline(character.tagline);
      setCharacterImage(character.avatar);
      setAnonymous(character.anonymous);
    }
  }, [character]);

  useEffect(() => {
    if (characterId) {
      getStoriesIncludingCharacter(characterId)
        .then((res) => {
          setStories(res);
        })
        .catch((err) => {
          setStories([]);
        });

      setLoadingEvents(true);
      getEventsAttending(0, 0, characterId).then((res) => {
        setEventsAttending(res.events);
        setLoadingEvents(false);
      });

      getUserByCharacter(characterId).then((res) => {
        setOwner(res);
      });
    }
  }, [characterId]);

  useEffect(() => {
    if (userStore.authUser) setAuthUser(userStore.authUser);
    if (characterStore.characters && userStore.authUser) {
      const filteredCharacter = characterStore.characters.filter(
        (item) => item.characterId === characterId
      );
      if (filteredCharacter.length > 0) setEnableEdit(true);
    }
  }, [userStore.authUser, characterStore]);

  return (
    <Grid container className={classes.root} justify="center">
      {characterName === '' && <CircularProgress />}
      {characterName !== '' && (
        <>
          <Grid item container xs={12} justify="center" className={classes.container}>
            <Grid
              data-testid="viewCharacterForm"
              container
              component="form"
              noValidate
              autoComplete="off"
              wrap="wrap"
              spacing={3}
            >
              <Grid item xs={12} md={4} className={classes.avatarContainer}>
                <CharacterUploadAvatar
                  characterImage={characterImage}
                  editMode={editMode}
                  setCharacterImage={setCharacterImage}
                />
              </Grid>
              <Grid item xs={12} md={8} style={{ zIndex: 500 }}>
                <CharacterForm
                  isEnableEdit={enableEdit}
                  editMode={editMode}
                  setEditMode={setEditMode}
                  experiences={experiences}
                  allExperiences={allExperiences}
                  setExperiences={setExperiences}
                  characterName={characterName}
                  setCharacterName={setCharacterName}
                  tagline={tagline}
                  setTagline={setTagline}
                  bio={bio}
                  setBio={setBio}
                  intentions={intentions}
                  setIntentions={setIntentions}
                  anonymous={anonymous}
                  setAnonymous={setAnonymous}
                  setIsOpenDeleteDialog={setIsOpenDeleteDialog}
                  errors={errors}
                  characterStore={characterStore}
                  saveCharacter={saveCharacter}
                />
              </Grid>
            </Grid>

            <Grid item container className={classes.chracterInfoSection} spacing={3} wrap="wrap">
              <Grid
                className={classes.experienceScoreWrapper}
                item
                xs={12}
                md={8}
                data-testid="experiences-score-container"
              >
                <Grid container spacing={3} direction="column">
                  <CharacterExScoreSection experiences={experiences} />
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                <Grid
                  className={classes.attendingContainer}
                  container
                  spacing={3}
                  direction="column"
                  data-testid="attendings-container"
                >
                  <CharacterAttendingSection attendings={eventsAttending} loading={loadingEvents} />
                </Grid>
                <Grid
                  className={classes.profileByContainer}
                  container
                  spacing={3}
                  direction="column"
                  data-testid="profileby-container"
                >
                  <Grid item>
                    <Typography variant="h5" color="primary">
                      Character by
                    </Typography>
                  </Grid>
                  <Grid item>
                    {character && character.anonymous ? (
                      <Typography variant="h6">Anonymous User</Typography>
                    ) : owner && owner.name ? (
                      <>
                        <Typography variant="h6">{owner.name}</Typography>
                        {owner.address1 && (
                          <Grid item container alignItems="center" className={classes.location}>
                            <RoomOutlined
                              variant="outlined"
                              className={classes.locationIcon}
                              color="secondary"
                            />
                            {owner.address1}
                          </Grid>
                        )}
                      </>
                    ) : (
                      <Typography variant="h6">Deleted User</Typography>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            item
            container
            xs={12}
            className={classes.storyGrid}
            justify="center"
            data-testid="story-list"
          >
            <Grid container className={classes.storyContainer} spacing={2}>
              <CharacterStorySection stories={stories} />
            </Grid>
          </Grid>
        </>
      )}

      <FloatingBtnContainer>
        <FloatingButton
          variant="contained"
          color="secondary"
          data-testid="btn-createNewStory"
          startIcon={<AddIcon />}
          onClick={() => {
            history.push(`/stories/new/${characterId}`);
          }}
        >
          CREATE A STORY
        </FloatingButton>
      </FloatingBtnContainer>
      <Dialog open={isOpenDeleteDialog} onClose={handleCloseDialog} data-testid="confirm-dialog">
        <DialogTitle id="alert-dialog-title">
          {'Are you sure to delete this character?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This character will be permantantly deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Disagree
          </Button>
          <Button onClick={doDeleteCharacter} color="primary" autoFocus data-testid="btn-agree">
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};
