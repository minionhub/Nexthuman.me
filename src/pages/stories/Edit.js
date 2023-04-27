import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useFirestoreConnect, useFirestore } from 'react-redux-firebase';
import { useHistory, useParams } from 'react-router-dom';
import { makeStyles, useTheme, Grid, Typography } from '@material-ui/core';
import MUILink from '@material-ui/core/Link';
import * as yup from 'yup';
import ProducerCard from '../../components/ProducerCard';
import TextField from '../../components/form/TextField';
import FileField from '../../components/form/FileField';
import Editor from '../../components/form/Editor';
import { ErrorButton } from '../../components/form/Buttons';
import LocationField from '../../components/form/LocationField';
import { Button } from '../../components/form/Buttons';
import Modal from '../../components/Modal';
import routes from '../../constants/routes.json';
import CharacterSelector from '../../components/CharacterSelector';
import ExperienceSelector from '../../components/ExperienceSelector';
import LoadingOverlay from '../../components/LoadingOverlay';
import { getAllMentions, getCharactersFromDes, getEventFromDes } from '../../utils/story';
import { getStory, updateStory, deleteStory } from '../../services/story/story.firebase';

const validationSchema = yup.object().shape({
  title: yup.string().required('Book name is required'),
  subtitle: yup.string().required('Subtitle is required'),
  description: yup.string().required('Background story is required'),
  coverImage: yup.object({
    src: yup.string().required('Story image is required'),
  }),
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
    padding: '10px 0px',
  },
  sectionTitle: {
    marginBottom: 12,
    marginTop: 19,
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
  submit: {
    marginLeft: 16,
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
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
  const { storyId } = useParams();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState({ src: '', format: '' });
  const [geoLocation, setGeoLocation] = useState({});
  const [audio, setAudio] = useState({ src: '', format: '' });
  const [experiences, setExperiences] = useState([]);
  const [writers, setWriters] = useState([]);
  const [errors, setErrors] = useState({});
  const [confirmDlg, setConfirmDlg] = useState(false);
  const [isActionLoading, setActionLoading] = useState(false);

  const history = useHistory();
  const firestore = useFirestore();
  useFirestoreConnect(['experiences']);
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
    if (!!storyId) {
      getStory(storyId).then((res) => {
        if (!!res) {
          setTitle(res.title);
          setCoverImage(res.coverImage);
          setSubtitle(res.subtitle);
          setDescription(res.description);
          setAudio(res.audio);
          setGeoLocation(res.location?.data);
          setWriters(res.writers);
          setExperiences(res.experiences);
        }
      });
    }
  }, [storyId]);

  const createExperienceTag = async (name) => {
    const data = { id: name.toLowerCase(), name };
    await firestore.collection('experiences').add(data);
    return data;
  };
  const [dirty, setDirty] = useState(false);
  const buildEventData = () => {
    return {
      id: storyId,
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
      console.log(
        'errors',
        e.inner.reduce((result, err) => ({ ...result, [err.path]: err }), {})
      );
      setErrors(e.inner.reduce((result, err) => ({ ...result, [err.path]: err }), {}));
      return false;
    }
  };

  const handleSubmit = () => {
    const valid = doValidation();
    setDirty(true);

    if (valid) {
      updateStory(buildEventData())
        .then(() => {
          history.push(`/stories/Details/${storyId}`);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const handleCloseConfirmDlg = () => {
    setConfirmDlg(false);
  };
  const clickDeleteStory = () => {
    setConfirmDlg(true);
  };
  const confirmDelete = () => {
    setActionLoading(true);
    deleteStory(storyId)
      .then(() => {
        setActionLoading(false);
        history.push(routes.BOOKS);
      })
      .catch((err) => {
        setActionLoading(false);
      });
  };
  return (
    <>
      <Grid className={classes.root} container justify="center">
        <Grid
          data-testid="updateStoryForm"
          className={classes.form}
          container
          component="form"
          wrap="wrap"
          alignItems="flex-start"
          justify="flex-start"
          spacing={2}
        >
          <Grid item xs={12}>
            <Typography className={classes.title} color="primary" variant="h4">
              Edit Story
            </Typography>
            <Typography className={classes.subTitle2}>
              <MUILink href="/" color="secondary">
                Home
              </MUILink>
              /Edit Story
            </Typography>
          </Grid>
          <Grid item md={8} xs={12} container direction="column">
            <Grid item xs={12} container spacing={2}>
              <Grid item container direction="column">
                <Typography className={classes.sectionTitle} color="primary" variant="h5">
                  General information
                </Typography>
                <Typography className={classes.sectionDesc} color="secondary">
                  Describe title, subtitle and description of the story
                </Typography>
              </Grid>
              <Grid item container alignItems="stretch" wrap="wrap" spacing={2}>
                <Grid item md={6} xs={12} style={{ marginBottom: useTheme().spacing(2) }}>
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
                <Grid item md={6} xs={12} style={{ marginBottom: useTheme().spacing(2) }}>
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
          <Grid item md={4} xs={12} container direction="column">
            <Grid xs={12} item container spacing={2}>
              <Grid item container direction="column" xs={12}>
                <Typography className={classes.sectionTitle} color="primary" variant="h5">
                  Multimedia
                </Typography>
                <Typography className={classes.sectionDesc} color="secondary">
                  Upload image and sound
                </Typography>
              </Grid>
              <Grid item xs={12} style={{ marginBottom: useTheme().spacing(2) }}>
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
              <Grid item container direction="column" xs={12}>
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
          <Grid item md={8} xs={12} container direction="column">
            <Grid item xs={12} container spacing={2}>
              <Grid item container direction="column">
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
          <Grid item md={4} xs={12} container direction="column">
            <Grid item xs={12} container spacing={2}>
              <Grid item container direction="column">
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

          <Grid item container xs={12} wrap="wrap-reverse" justify="space-between" spacing={2}>
            <Grid item sm={4} xs={12}>
              <ErrorButton
                data-testid="btn-delete"
                className={classes.action}
                size="large"
                variant="contained"
                onClick={clickDeleteStory}
              >
                DELETE
              </ErrorButton>
            </Grid>
            <Grid item container sm={8} xs={12} wrap="wrap-reverse" justify="flex-end">
              <Grid item sm={'auto'} xs={12}>
                <Button
                  data-testid="btn-discard"
                  className={classes.action}
                  size="large"
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    history.goBack();
                  }}
                >
                  CANCEL
                </Button>
              </Grid>
              <Grid item sm={'auto'} xs={12}>
                <Button
                  data-testid="btn-updateStory"
                  className={[classes.action, classes.submit].join(' ')}
                  size="large"
                  variant="contained"
                  color="secondary"
                  onClick={handleSubmit}
                >
                  UPDATE
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Modal open={confirmDlg} onClose={() => setConfirmDlg(false)} data-testid="modal-confirm">
        <Grid container direction="column" spacing={6}>
          <Grid item xs={12}>
            <Typography
              align="center"
              variant="h3"
              color="primary"
              className={classes.contentTitle}
            >
              Do you want to permanently delete the story?
            </Typography>
          </Grid>
          <Grid item xs={12} align="center">
            <Button
              variant="contained"
              color="secondary"
              size="large"
              className={classes.btnYes}
              onClick={() => setConfirmDlg(false)}
            >
              BACK
            </Button>
          </Grid>
          <Grid item xs={12} align="center">
            <MUILink
              component="button"
              onClick={() => confirmDelete()}
              data-testid="btn-confirm"
              color="error"
            >
              PERMANENT DELETE
            </MUILink>
          </Grid>
          {isActionLoading && <LoadingOverlay />}
        </Grid>
      </Modal>
    </>
  );
};
