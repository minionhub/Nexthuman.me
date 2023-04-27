import React, { useState, useEffect } from 'react';
import TagManager from 'react-gtm-module';
import { v4 as uuidv4 } from 'uuid';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useFirestoreConnect, useFirestore } from 'react-redux-firebase';
import { Grid } from '@material-ui/core';
import CharacterUploadAvatar from '../../components/CharacterUploadAvatar';
import CharacterForm from '../../components/CharacterForm';
import CharacterExScoreSection from '../../components/CharacterExScoreSection';
import CharacterAttendingSection from '../../components/CharacterAttendingSection';
import CharacterStorySection from '../../components/CharacterStorySection';
import characters from '../../store/actions/characters';
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
    '@media (max-width:960px)': {
      padding: 0,
    },
    backgroundColor: '#fff',
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
  attendingWrapper: {
    '& .wrapperBox': {
      position: 'relative',
      width: '100%',
      boxSizing: 'border-box',
      paddingTop: '73.75%',
      backgroundColor: '#F2F2F2',
      borderRadius: '4px',
      '& .content': {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        '& .event-icon': {
          color: '#E0E0E0',
          fontSize: '24px',
        },
      },
    },
  },
  profileByContainer: {
    marginTop: theme.spacing(4),
    '& .MuiTypography-h6': {
      fontWeight: 400,
      margin: '0 0 13px 0',
    },
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
});

export default () => {
  const classes = useStyles({ theme: useTheme() });
  const [authUser, setAuthUser] = useState(null);
  const [errors, setErrors] = useState({});
  useFirestoreConnect(['experiences']);
  const [characterImage, setCharacterImage] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [tagline, setTagline] = useState('');
  const [bio, setBio] = useState('');
  const [intentions, setIntentions] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const allExperiences = useSelector((state) =>
    Object.values(state.firestore.data.experiences || {})
  );
  const [experiences, setExperiences] = useState([]);
  const userStore = useSelector((state) => state.userStore);
  const dispatch = useDispatch();
  const createCharacter = (uid, data) => dispatch(characters.createCharacter(uid, data));

  const history = useHistory();
  const saveCharacter = () => {
    createCharacter(authUser.uid, {
      name: characterName,
      tagline,
      bio,
      intentions,
      experiences,
      anonymous,
      avatar: characterImage,
    }).then((character) => {
      TagManager.dataLayer({
        dataLayer: {
          event: 'newCharacterCreated',
          eventProps: {
            name: characterName,
            userId: authUser.uid,
          },
        },
      });
      history.push('/character/' + character.characterId);
    });
  };
  useEffect(() => {
    setAuthUser(userStore.authUser);
  }, [userStore]);

  return (
    <Grid container justify="center" className={classes.root}>
      <Grid item container xs={12} justify="center" className={classes.container}>
        <Grid
          data-testid="createCharacterForm"
          container
          noValidate
          autoComplete="off"
          component="form"
          wrap="wrap"
          spacing={3}
        >
          <Grid item xs={12} md={4} className={classes.avatarContainer}>
            <CharacterUploadAvatar
              characterImage={characterImage}
              editMode={true}
              setCharacterImage={setCharacterImage}
            />
          </Grid>
          <Grid item xs={12} md={8} style={{ zIndex: 500 }}>
            <CharacterForm
              isNew={true}
              editMode={true}
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
              errors={errors}
              saveCharacter={saveCharacter}
              goBack={() => {
                history.goBack();
              }}
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
              <CharacterExScoreSection isNew={true} />
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
              <CharacterAttendingSection attendings={[]} />
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
          <CharacterStorySection stories={[]} />
        </Grid>
      </Grid>
    </Grid>
  );
};
