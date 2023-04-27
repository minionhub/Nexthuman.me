import React, { useState, useEffect } from 'react';
import TagManager from 'react-gtm-module';
import { useSelector } from 'react-redux';
import { useFirestoreConnect, useFirestore } from 'react-redux-firebase';
import { useHistory, useParams } from 'react-router-dom';
import {
  makeStyles,
  useTheme,
  Grid,
  Checkbox,
  Typography,
  FormControlLabel,
  FormHelperText,
  FormControl,
} from '@material-ui/core';
import MUILink from '@material-ui/core/Link';
import * as yup from 'yup';
import ProducerCard from '../../components/ProducerCard';
import TextField from '../../components/form/TextField';
import FileField from '../../components/form/FileField';
import Editor from '../../components/form/Editor';
import LocationField from '../../components/form/LocationField';
import { Button } from '../../components/form/Buttons';
import CharacterSelector from '../../components/CharacterSelector';
import ExperienceSelector from '../../components/ExperienceSelector';
import stories from '../../store/actions/stories';
import { createStory } from '../../services/story/story.firebase';
import eventUtils from '../../utils/event';
import { getAllMentions, getCharactersFromDes, getEventFromDes } from '../../utils/story';

const validationSchema = yup.object().shape({
  title: yup.string().required('Book name is required'),
  subtitle: yup.string().required('Subtitle is required'),
  description: yup.string().required('Background story is required'),
  coverImage: yup.object({
    src: yup.string().required('Story image is required'),
  }),
  // location: yup.object({
  //   type: yup.string(),
  //   data: yup.object().when('type', {
  //     is: eventUtils.LOCATION_TYPE.VENUE,
  //     then: yup.object({ geometry: yup.object().required('Location is required') }),
  //     otherwise: yup.object({
  //       url: yup.string().url('Location not valid link'),
  //     }),
  //   }),
  // }),
  experiences: yup.array().min(1, 'Select at least one experience'),
  writers: yup.array().min(1, 'Select at least one experience'),
});

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    overflow: 'hidden',
  },
  form: {
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
    backgroundColor: '#fff',
  },
  title: {},
  section: {},
  subTitle2: {
    fontFamily: 'Fira Sans',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px',
    lineHeight: '17px',
    letterSpacing: '0.15px',
    padding: '4px 0px',
  },
  sectionTitle: {
    margin: '12px 0 4px',
  },
  sectionDesc: {
    fontSize: 16,
    lineHeight: '19px',
    marginBottom: 19,
  },
  field: {
    padding: '11px 17px',
    [theme.breakpoints.down('xs')]: {
      padding: '11px 0',
    },
  },
  action: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  btnYes: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  contentTitle: {
    [theme.breakpoints.down('md')]: {
      fontFamily: 'Fira Sans',
      fontSize: '24px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '29px',
      letterSpacing: '0px',
      textAlign: 'center',
    },
  },
  characterSelectorWrapper: {
    height: '298px',
  },
  experienceSelectorWrapper: {
    height: '298px',
  },
}));

export default () => {
  const classes = useStyles({ theme: useTheme() });
  const { characterId } = useParams();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState({ src: '', format: '' });
  const [geoLocation, setGeoLocation] = useState({});
  const [audio, setAudio] = useState({ src: '', format: '' });
  const [experiences, setExperiences] = useState([]);
  const [writers, setWriters] = useState([]);
  const [errors, setErrors] = useState({});
  const history = useHistory();
  const firestore = useFirestore();

  useFirestoreConnect(['experiences', 'profiles']);

  const allExperiences = useSelector((state) =>
    Object.values(state.firestore.data.experiences || {})
  );

  const [allMentionLoading, setAllMentionLoading] = useState(true);
  const [allMentions, setAllMentions] = useState([]);

  useEffect(() => {
    getAllMentions()
      .then((res) => {
        setAllMentions(res);
        setAllMentionLoading(false);
      })
      .catch((err) => {
        setAllMentions([]);
        setAllMentionLoading(false);
      });
  }, []);

  useEffect(() => {
    const currentCharacter =
      allMentions.find((item) => {
        if (item.id === characterId && item.type === 'character') return true;
        else return false;
      }) || null;
    if (currentCharacter)
      setWriters([
        {
          id: characterId,
          name: currentCharacter.name || '',
          avatar: currentCharacter.avatar || '',
          tagline: currentCharacter.tagline || '',
        },
      ]);
  }, [allMentions]);

  const createExperienceTag = async (name) => {
    const data = { id: name.toLowerCase(), name };
    await firestore.collection('experiences').add(data);
    return data;
  };
  const [dirty, setDirty] = useState(false);

  const buildEventData = () => {
    return {
      characterId,
      title,
      subtitle,
      description,
      coverImage,
      audio,
      location: {
        type: 'venue',
        data: geoLocation,
      },
      writers: writers.map((item) => item.id),
      characters: getCharactersFromDes(allMentions, description),
      events: getEventFromDes(allMentions, description),
      experiences,
    };
  };

  const doValidation = () => {
    const data = buildEventData();
    try {
      validationSchema.validateSync(
        { ...data },
        { abortEarly: false, recursive: true, stripUnknown: true }
      );
      setErrors({});
      return true;
    } catch (e) {
      setErrors(e.inner.reduce((result, err) => ({ ...result, [err.path]: err }), {}));
      return false;
    }
  };

  const handleSubmit = () => {
    const valid = doValidation();
    setDirty(true);
    if (valid) {
      createStory(buildEventData())
        .then((id) => {
          TagManager.dataLayer({
            dataLayer: {
              event: 'newStoryCreated',
              eventProps: {
                title: title,
                subtitle: subtitle,
              },
            },
          });
          history.push(`/stories/details/${id}`);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      <Grid className={classes.root} container justify="center">
        <Grid
          data-testid="createStoryForm"
          className={classes.form}
          item
          container
          component="form"
          wrap="wrap"
          alignItems="flex-start"
          justify="flex-start"
          spacing={4}
        >
          <Grid item xs={12}>
            <Typography className={classes.title} color="primary" variant="h4">
              Create Story
            </Typography>
            <Typography className={classes.subTitle2}>
              <MUILink href="/" color="secondary">
                Home
              </MUILink>
              /Create Story
            </Typography>
          </Grid>
          <Grid item md={8} xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography className={classes.sectionTitle} color="primary" variant="h5">
                  General information
                </Typography>
                <Typography className={classes.sectionDesc} color="secondary">
                  Describe title, subtitle and description of the story
                </Typography>
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  data-testid="textfield-title"
                  variant="outlined"
                  fullWidth
                  name="title"
                  value={title}
                  error={!!errors.title}
                  helperText={!!errors.title && errors.title.message}
                  label="Title*"
                  placeholder="Title"
                  color="secondary"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  data-testid="textfield-subtitle"
                  variant="outlined"
                  fullWidth
                  name="subtitle"
                  value={subtitle}
                  error={!!errors.subtitle}
                  helperText={!!errors.subtitle && errors.subtitle.message}
                  label="Subtitle*"
                  placeholder="Subtitle"
                  color="secondary"
                  onChange={(e) => setSubtitle(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Editor
                  data-testid="textfield-desc"
                  value={description}
                  loading={allMentionLoading}
                  allMentions={allMentions}
                  placeholder="Background story"
                  color="secondary"
                  onChange={setDescription}
                  error={!!errors.description}
                  helperText={!!errors.description && errors.description.message}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={4} xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography className={classes.sectionTitle} color="primary" variant="h5">
                  Multimedia
                </Typography>
                <Typography className={classes.sectionDesc} color="secondary">
                  Upload image and sound
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FileField
                  data-testid="filefield-coverImage"
                  label="Story Image"
                  fullWidth
                  name="coverImage"
                  value={coverImage}
                  error={!!errors['coverImage.src']}
                  helperText={!!errors['coverImage.src'] && errors['coverImage.src'].message}
                  onChange={setCoverImage}
                  placeholder="Add story picture here"
                  variant="outlined"
                  color="secondary"
                  fileTypes={['image']}
                />
              </Grid>
              <Grid item xs={12}>
                <FileField
                  data-testid="filefield-audio"
                  name="audio"
                  label="Audio (Optional)"
                  fullWidth
                  value={audio}
                  error={!!errors['audio.src']}
                  helperText={!!errors['audio.src'] && errors['audio.src'].message}
                  onChange={setAudio}
                  placeholder="Add story audio here"
                  variant="outlined"
                  color="secondary"
                  fileTypes={['audio']}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography className={classes.sectionTitle} color="primary" variant="h5">
                  Location
                </Typography>
                <Typography className={classes.sectionDesc} color="secondary">
                  Google map location of the story
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <LocationField
                  data-testid="locationfield-location"
                  value={geoLocation}
                  error={!!errors['location.data.geometry']}
                  helperText={
                    !!errors['location.data.geometry'] && errors['location.data.geometry'].message
                  }
                  label="Location*"
                  color="secondary"
                  placeholder="Google map link"
                  onChange={setGeoLocation}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={8} xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography className={classes.sectionTitle} color="primary" variant="h5">
                  Writers
                </Typography>
                <Typography className={classes.sectionDesc} color="secondary">
                  Select Characters
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <CharacterSelector
                  data-testid="autocompletefield-characters"
                  value={writers}
                  wrapperClass={classes.characterSelectorWrapper}
                  allowEmpty={false}
                  onChange={setWriters}
                  options={allMentions
                    .filter((item) => item.type === 'character')
                    .map((character) => {
                      return {
                        id: character.id,
                        name: character.name ? character.name : '',
                        avatar: character.avatar ? character.avatar : '',
                        tagline: character.tagline ? character.tagline : '',
                      };
                    })}
                  getOptionLabel={(option) => option.name}
                  renderOption={(option) => (
                    <ProducerCard
                      key={option.name}
                      photo={option.avatar}
                      name={option.name}
                      designation={option.tagline}
                    />
                  )}
                  getOptionSelected={(o, v) => v && v.id === o.id}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={4} xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography className={classes.sectionTitle} color="primary" variant="h5">
                  Experience
                </Typography>
                <Typography className={classes.sectionDesc} color="secondary">
                  Tag story experiences
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <ExperienceSelector
                  data-testid="autocompletefield-experiences"
                  wrapperClass={classes.experienceSelectorWrapper}
                  value={experiences}
                  onChange={setExperiences}
                  multiple={true}
                  error={!!errors.experiences}
                  helperText={!!errors.experiences && errors.experiences.message}
                  options={allExperiences}
                  getOptionLabel={(o) => o.name}
                  renderOption={(o) => o.name}
                  getOptionSelected={(o, v) => v && v.id === o.id}
                  creatable
                  onCreate={createExperienceTag}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container wrap="wrap-reverse" justify="space-between" spacing={3}>
              <Grid item sm={'auto'} xs={12}>
                <Button
                  className={classes.action}
                  size="large"
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    history.goBack();
                  }}
                  data-testid="btn-discard"
                >
                  DISCARD
                </Button>
              </Grid>
              <Grid item sm={'auto'} xs={12}>
                <Button
                  className={classes.action}
                  variant="contained"
                  size="large"
                  color="secondary"
                  onClick={handleSubmit}
                  data-testid="btn-createStory"
                >
                  PUBLISH
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
