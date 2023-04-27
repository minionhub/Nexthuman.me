import React, { useState, useEffect } from 'react';
import moment from 'moment';
import momentTz from 'moment-timezone';
import { useDispatch, useSelector } from 'react-redux';
import { useFirestoreConnect, useFirestore } from 'react-redux-firebase';
import { useHistory, useParams } from 'react-router-dom';

import { makeStyles, useTheme } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import MUILink from '@material-ui/core/Link';
import { Popper } from '@material-ui/core';

import DateField from '../../components/form/DateField';
import TimeField from '../../components/form/TimeField';
import Editor from '../../components/form/Editor';
import LocationField from '../../components/form/LocationField';
import FileField from '../../components/form/FileField';
import PriceField from '../../components/form/PriceField';
import NumberField from '../../components/form/NumberField';
import AutocompleteField from '../../components/form/AutocompleteField';
import ProducerCard from '../../components/ProducerCard';
import { ErrorButton } from '../../components/form/Buttons';
import TextField from '../../components/form/TextField';
import Modal from '../../components/Modal';

import events from '../../store/actions/events';
import characterActions from '../../store/actions/characters';

import dateUtils from '../../utils/date';
import eventUtils from '../../utils/event';

import routes from '../../constants/routes.json';

import * as yup from 'yup';

const validationSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  subtitle: yup.string().required('Subtitle is required'),
  description: yup.string().required('Description is required'),
  coverImage: yup.object({
    src: yup.string().url('Cover image is not valid url').required('Cover image is required'),
  }),
  audio: yup.object({
    src: yup.string().url('Audio is not valid url'),
  }),
  location: yup.object({
    type: yup.string().required(),
    data: yup.object().when('type', {
      is: eventUtils.LOCATION_TYPE.VENUE,
      then: yup.object({
        geometry: yup.object().required('Location is required'),
      }),
      otherwise: yup.object({
        url: yup.string().url('Location not valid link'),
      }),
    }),
  }),
  capacity: yup
    .number()
    .integer('Capacity needs to be whole number')
    .positive('Capacity needs to be positive number'),
  experiences: yup.array().min(1, 'Select at least one experience'),
});

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    '& .Mui-error': {
      marginLeft: 0,
      marginRight: 0,
    },
  },
  header: {
    padding: '0 8px !important',
  },
  form: {
    padding: '40px 0',
    maxWidth: 1136,
    backgroundColor: '#fff',
    [theme.breakpoints.down('md')]: {
      padding: '30px 8px',
    },
  },
  action: {
    width: 160,
    height: 48,
    fontSize: 14,
    lineHeight: '16px',
    fontWeight: 500,
    letterSpacing: 1.25,
    textTransform: 'uppercase',
    marginTop: 48,
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      marginTop: 6,
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
  subTitle2: {
    fontFamily: 'Fira Sans',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px',
    lineHeight: '17px',
    letterSpacing: '0.15px',
    padding: '10px 0 0',
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
    padding: 8,
    [theme.breakpoints.down('xs')]: {
      padding: 8,
    },
  },
  submit: {
    marginLeft: 0,
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
    },
  },
  popper: {
    width: 'fit-content',
  },
  autocompleteEx: {
    '& .MuiAutocomplete-input': {
      position: 'absolute',
      width: 'calc(100% - 36px)',
      height: 40,
      boxSizing: 'border-box',
      top: 18,
      left: 18,
      backgroundColor: '#FAFAFA',
      paddingLeft: '40px !important',
      borderRadius: 4,
    },
    '& .MuiAutocomplete-inputRoot': {
      padding: '70px 18px 18px',
      minHeight: 280,
      alignItems: 'flex-start',
      alignContent: 'start',
    },
    '& .MuiAutocomplete-endAdornment': {
      display: 'none',
    },
    '& .MuiInputAdornment-root': {
      position: 'absolute',
      top: 40,
      left: 20,
      zIndex: 50,
    },
  },
  cancel: {
    [theme.breakpoints.up('xs')]: {
      marginRight: 16,
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: 22,
    },
  },
}));

export default () => {
  const { eventId } = useParams();
  const classes = useStyles({ theme: useTheme() });
  const history = useHistory();
  const firestore = useFirestore();
  const dispatch = useDispatch();
  useFirestoreConnect([
    {
      collection: 'events',
      doc: eventId,
    },
    'experiences',
    'profiles',
  ]);
  const event = useSelector(
    (state) => state.firestore.data.events && state.firestore.data.events[eventId]
  );

  const allExperiences = useSelector((state) =>
    Object.values(state.firestore.data.experiences || {})
  );
  const profiles = useSelector((state) => {
    let characters = [];
    for (const [id, p] of Object.entries(state.firestore.data.profiles || {})) {
      if (p)
        characters.push({
          id: id,
          name: p.name || 'Unnamed',
          avatar: p.avatar || '',
          tagline: p.tagline || 'Unknown',
        });
    }
    return characters;
  });
  const userStore = useSelector((state) => state.userStore);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [price, setPrice] = useState(0);
  const [capacity, setCapacity] = useState(0);
  const [locationType, setLocationType] = useState(eventUtils.LOCATION_TYPE.VENUE);
  const [geoLocation, setGeoLocation] = useState({});
  const [linkLocation, setLinkLocation] = useState('');
  const [from, setFrom] = useState(moment());
  const [to, setTo] = useState(moment());
  const [tz, setTz] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState({ src: '', format: '' });
  const [audio, setAudio] = useState({ src: '', format: '' });
  const [experiences, setExperiences] = useState([]);
  const [producers, setProducers] = useState([]);
  const [confirmDlg, setConfirmDlg] = useState(false);
  const [curCharacter, setCurCharacter] = useState({});
  const [isOwner, setIsOwner] = useState(false);

  const [errors, setErrors] = useState({});
  const [dirty, setDirty] = useState(false);

  const updateEventTimezone = (option) => {
    setTz(option.value);
    setFrom(momentTz(from.utc().format()).tz(option.value));
    setTo(momentTz(to.utc().format()).tz(option.value));
  };

  const buildEventData = () => {
    return {
      id: eventId,
      title,
      subtitle,
      price: {
        currency: 'SEK',
        value: price,
      },
      capacity,
      location: {
        type: locationType,
        data: locationType === eventUtils.LOCATION_TYPE.VENUE ? geoLocation : { url: linkLocation },
      },
      from: from.utc().format(),
      to: to.utc().format(),
      description,
      coverImage,
      audio,
      experiences: experiences.map((exp) => exp.id),
      producers: producers.map((prd) => prd.id),
    };
  };

  const removeProducer = (producer) => {
    if (producers.length <= 1) return;
    setProducers(
      producers.filter((p) => {
        return (
          p.name != producer.name || p.tagline != producer.tagline || p.avatar != producer.avatar
        );
      })
    );
  };

  const doValidation = () => {
    const data = buildEventData();
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

  const getCharacters = (uid) => dispatch(characterActions.getCharacters(uid));

  const updateEvent = () => {
    dispatch(events.updateEvent(buildEventData()));
  };

  const deleteEvent = () => dispatch(events.deleteEvent(eventId));
  const clickDeleteEvent = () => {
    setConfirmDlg(true);
  };
  const confirmDelete = () => {
    deleteEvent()
      .then(() => {
        history.push(routes.EVENTS);
      })
      .catch((err) => {});
  };

  const createExperienceTag = async (name) => {
    const data = { id: name.toLowerCase(), name };
    await firestore.collection('experiences').add(data);
    return data;
  };

  useEffect(() => {
    if (event) {
      if (title.length <= 0) {
        setDescription(event.description);
        setLocationType(event.location.type);
        if (event.location.type == 'venue') setGeoLocation(event.location.data);
        else setLinkLocation(event.location.data.url || '');
        setTitle(event.title);
        setSubtitle(event.subtitle);
        setPrice(event.price.value);
        setCapacity(event.capacity);

        setFrom(moment(event.from));
        setTo(moment(event.to));
        setCoverImage(event.coverImage);
        setAudio(event.audio);
      }

      if (profiles && producers.length <= 0 && event.producers) {
        let prds = [];
        profiles.forEach((prd) => {
          if (event.producers.includes(prd.id))
            prds.push({
              id: prd.id,
              name: prd.name || 'Unnamed',
              avatar: prd.avatar || '',
              tagline: prd.tagline || 'Unknown',
            });
        });
        setProducers(prds);
      }

      if (allExperiences && experiences.length <= 0) {
        setExperiences(
          allExperiences.filter((exp) => {
            return event.experiences.includes(exp.id);
          })
        );
      }
    }
  }, [event, profiles, allExperiences]);

  useEffect(() => {
    if (dirty) {
      doValidation();
    }
  }, [
    dirty,
    title,
    subtitle,
    price,
    capacity,
    geoLocation,
    linkLocation,
    coverImage,
    audio,
    experiences,
    producers,
  ]);

  useEffect(() => {
    if (userStore.authUser != null && !curCharacter) {
      getCharacters(userStore.authUser.uid).then((characters) => {
        characters.forEach((item) => {
          if (item.characterId == userStore.authUser.lastSelectedCharacter) {
            setCurCharacter(item);
          }
        });
      });
    }
  }, [userStore]);

  useEffect(() => {
    if (!isOwner && producers.length >= 0 && curCharacter.characterId) {
      const c = producers.filter((prd) => prd.id == curCharacter.characterId);
      if (c.length <= 0) {
        history.push('/notfound');
      } else {
        setIsOwner(true);
      }
    }
  }, [producers, curCharacter]);

  const handleSubmit = () => {
    const valid = doValidation();
    setDirty(true);
    if (valid) {
      updateEvent();
      history.push(`/events/${eventId}`);
    }
  };

  const PopperTz = function (props) {
    return <Popper {...props} style={{ width: 'fit-content' }} placement="bottom-start" />;
  };

  return (
    <Grid className={classes.root} container justify="center" alignItems="center">
      <Grid
        data-testid="updateEventForm"
        className={classes.form}
        container
        component="form"
        wrap="wrap"
        alignItems="flex-start"
        justify="flex-start"
      >
        <Grid className={[classes.field, classes.header].join(' ')} item xs={12}>
          <Typography className={classes.title} color="primary" variant="h4">
            Update Event
          </Typography>
          <Typography className={classes.subTitle2}>
            <MUILink href="/" color="secondary">
              Home
            </MUILink>{' '}
            / Update Event
          </Typography>
        </Grid>
        <Grid item md={8} xs={12} container direction="column">
          <Grid item xs={12} container className={classes.section}>
            <Grid className={classes.field} item container direction="column">
              <Typography className={classes.sectionTitle} color="primary" variant="h5">
                General information
              </Typography>
              <Typography className={classes.sectionDesc} color="secondary">
                Describe title, subtitle and description of the event
              </Typography>
            </Grid>
            <Grid item container alignItems="stretch" wrap="wrap">
              <Grid className={classes.field} item md={6} xs={12}>
                <TextField
                  data-testid="updateEventFieldTitle"
                  variant="outlined"
                  fullWidth
                  name="title"
                  value={title}
                  error={!!errors.title}
                  helperText={!!errors.title && errors.title.message}
                  label="Title*"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>
              <Grid className={classes.field} item md={6} xs={12}>
                <TextField
                  data-testid="updateEventFieldSubtitle"
                  variant="outlined"
                  fullWidth
                  name="subtitle"
                  value={subtitle}
                  error={!!errors.subtitle}
                  helperText={!!errors.subtitle && errors.subtitle.message}
                  label="Subtitle*"
                  onChange={(e) => setSubtitle(e.target.value)}
                />
              </Grid>
            </Grid>
            <Grid className={classes.field} item xs={12}>
              <Editor
                data-testid="updateEventFieldDescription"
                height={303}
                value={description}
                onChange={setDescription}
                error={!!errors.description}
                helperText={!!errors.description && errors.description.message}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} container className={classes.section}>
            <Grid className={classes.field} item container direction="column" xs={12}>
              <Typography className={classes.sectionTitle} color="primary" variant="h5">
                Date and Time
              </Typography>
              <Typography className={classes.sectionDesc} color="secondary">
                Choose the starting time and date
              </Typography>
            </Grid>
            <Grid item xs={12} container>
              <Grid item md={9} xs={12} container>
                <Grid item xs={12} container justify="flex-start">
                  <Grid className={classes.field} item md={8} xs={12}>
                    <DateField
                      data-testid="updateEventFieldFrom"
                      fullWidth
                      label="Start Date"
                      variant="inline"
                      value={from}
                      format="D MMM YYYY"
                      onChange={setFrom}
                    />
                  </Grid>
                  <Grid className={classes.field} item md={4} xs={12}>
                    <TimeField
                      data-testid="updateEventFieldFromTime"
                      fullWidth
                      label="Start Time"
                      value={from}
                      onChange={setFrom}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} container justify="flex-start">
                  <Grid className={classes.field} item md={8} xs={12}>
                    <DateField
                      data-testid="updateEventFieldTo"
                      fullWidth
                      label="End Date"
                      value={to}
                      format="D MMM YYYY"
                      minDate={from}
                      minDateMessage="Event To date should not be before From date"
                      onChange={setTo}
                    />
                  </Grid>
                  <Grid className={classes.field} item md={4} xs={12}>
                    <TimeField
                      data-testid="updateEventFieldToTime"
                      fullWidth
                      label="End Time"
                      value={to}
                      minDate={from}
                      minDateMessage="Event To date should not be before From date"
                      onChange={setTo}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={3} xs={12}>
                <Grid className={classes.field} item xs={12}>
                  <AutocompleteField
                    data-testid="updateEventFieldTimezone"
                    fullWidth
                    defaultValue={momentTz.tz.guess()}
                    PopperComponent={PopperTz}
                    label="Timezone"
                    options={dateUtils.UTC_OFFSET_OPTIONS}
                    getOptionSelected={(option) => option.value}
                    onChange={updateEventTimezone}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={4} xs={12} container direction="column">
          <Grid xs={12} item container className={classes.section}>
            <Grid className={classes.field} item container direction="column" xs={12}>
              <Typography className={classes.sectionTitle} color="primary" variant="h5">
                Multimedia
              </Typography>
              <Typography className={classes.sectionDesc} color="secondary">
                Inspire your participants with image and sound
              </Typography>
            </Grid>
            <Grid item container xs={12}>
              <Grid className={classes.field} item xs={12}>
                <FileField
                  data-testid="updateEventFieldCoverImage"
                  label="Image"
                  fullWidth
                  name="coverImage"
                  value={coverImage}
                  error={!!errors['coverImage.src']}
                  helperText={!!errors['coverImage.src'] && errors['coverImage.src'].message}
                  onChange={setCoverImage}
                  placeholder="Drag and drop event image here"
                  variant="outlined"
                  fileTypes={['image']}
                />
              </Grid>
              <Grid className={classes.field} item xs={12}>
                <FileField
                  data-testid="updateEventFieldAudio"
                  name="audio"
                  label="Audio"
                  fullWidth
                  value={audio}
                  error={!!errors['audio.src']}
                  helperText={!!errors['audio.src'] && errors['audio.src'].message}
                  onChange={setAudio}
                  placeholder="Drag and drop audio file here"
                  variant="outlined"
                  fileTypes={['audio']}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} container className={classes.section}>
            <Grid className={classes.field} item container direction="column" xs={12}>
              <Typography className={classes.sectionTitle} color="primary" variant="h5">
                Location
              </Typography>
              <Typography className={classes.sectionDesc} color="secondary">
                Describe venue details or provide online event link
              </Typography>
            </Grid>
            <Grid className={classes.field} style={{ marginTop: -17 }} item xs={12}>
              <RadioGroup
                row
                aria-label="Location type"
                value={locationType}
                onChange={(e) => setLocationType(e.target.value)}
              >
                <FormControlLabel
                  value={eventUtils.LOCATION_TYPE.VENUE}
                  control={<Radio color="secondary" />}
                  label="Venue"
                />
                <FormControlLabel
                  value={eventUtils.LOCATION_TYPE.ONLINE}
                  control={<Radio color="secondary" />}
                  label="Online"
                />
              </RadioGroup>
            </Grid>
            <Grid className={classes.field} item xs={12}>
              {locationType === eventUtils.LOCATION_TYPE.VENUE && (
                <LocationField
                  data-testid="updateEventFieldLocation"
                  value={geoLocation}
                  error={!!errors['location.data.geometry']}
                  helperText={
                    !!errors['location.data.geometry'] && errors['location.data.geometry'].message
                  }
                  label="Location*"
                  placeholder="Event Location"
                  onChange={setGeoLocation}
                />
              )}
              {locationType === eventUtils.LOCATION_TYPE.ONLINE && (
                <TextField
                  data-testid="updateEventFieldLocation"
                  fullWidth
                  value={linkLocation}
                  error={!!errors['location.data.url']}
                  helperText={!!errors['location.data.url'] && errors['location.data.url'].message}
                  onChange={(e) => setLinkLocation(e.target.value)}
                  label="Event Link*"
                  placeholder="e.g Zoom, Team, Hangout, Airmeet link"
                />
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} container className={classes.section}>
            <Grid className={classes.field} item container direction="column" xs={12}>
              <Typography className={classes.sectionTitle} color="primary" variant="h5">
                Capacity and Ticket Price
              </Typography>
              <Typography className={classes.sectionDesc} color="secondary">
                Number of ticket and price of each ticket.
              </Typography>
            </Grid>
            <Grid className={classes.field} item xs={12}>
              <NumberField
                data-testid="updateEventFieldCapacity"
                value={capacity}
                onChange={setCapacity}
                label="Capacity*"
                fullWidth
                error={!!errors.capacity}
                helperText={!!errors.capacity && errors.capacity.message}
              />
            </Grid>
            <Grid className={classes.field} item xs={12}>
              <PriceField
                data-testid="updateEventFieldPrice"
                value={price}
                onChange={setPrice}
                label="Ticket price"
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item container xs={12}>
          <Grid className={classes.section} item container xs={12}>
            <Grid className={classes.field} item xs={12} container direction="column">
              <Typography className={classes.sectionTitle} color="primary" variant="h5">
                Producers and Experiences
              </Typography>
              <Typography className={classes.sectionDesc} color="secondary">
                Define Producers and Experiences
              </Typography>
            </Grid>
            <Grid item xs={12} container>
              <Grid className={classes.field} item md={8} xs={12}>
                <AutocompleteField
                  data-testid="updateEventFieldProducers"
                  value={producers}
                  onChange={setProducers}
                  fullWidth
                  label="Producers*"
                  multiple
                  options={profiles}
                  className={classes.autocompleteEx}
                  showAdorn
                  getOptionLabel={(option) => option.name}
                  getOptionSelected={(option, value) => {
                    return (
                      option.name == value.name &&
                      option.avatar == value.avatar &&
                      option.tagline == value.tagline
                    );
                  }}
                  renderOption={(option, index) => (
                    <ProducerCard
                      key={'pr-' + index}
                      photo={option.avatar}
                      name={option.name}
                      designation={option.tagline}
                    />
                  )}
                  renderTags={(options) =>
                    options.map((option, index) => (
                      <ProducerCard
                        key={'pt' + index}
                        photo={option.avatar}
                        name={option.name}
                        designation={option.tagline}
                        showCancelIcon
                        onRemove={removeProducer}
                        style={{ marginLeft: 10, marginBottom: 10, width: 'auto' }}
                      />
                    ))
                  }
                  minimum={1}
                />
              </Grid>
              <Grid className={classes.field} item md={4} xs={12}>
                <AutocompleteField
                  data-testid="updateEventFieldExperiences"
                  value={experiences}
                  onChange={setExperiences}
                  fullWidth
                  multiple
                  error={!!errors.experiences}
                  helperText={!!errors.experiences && errors.experiences.message}
                  label="Experiences*"
                  className={classes.autocompleteEx}
                  showAdorn
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
        </Grid>
        <Grid item container xs={12} wrap="wrap-reverse" justify="space-between">
          <Grid className={classes.field} item sm={4} xs={12}>
            <ErrorButton
              data-testid="deleteEventBtn"
              className={classes.action}
              size="large"
              variant="contained"
              onClick={clickDeleteEvent}
            >
              DELETE
            </ErrorButton>
          </Grid>

          <Grid
            item
            container
            className={classes.field}
            sm={8}
            xs={12}
            wrap="wrap-reverse"
            justify="flex-end"
          >
            <Grid item sm={'auto'} xs={12}>
              <Button
                data-testid="btn-discard"
                className={[classes.action, classes.cancel].join(' ')}
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
                data-testid="updateEventFormSubmitBtn"
                className={[classes.action, classes.submit].join(' ')}
                variant="contained"
                color="secondary"
                size="large"
                onClick={handleSubmit}
              >
                UPDATE
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Modal
        data-testid="deleteEventConfirmDlg"
        open={confirmDlg}
        onClose={() => setConfirmDlg(false)}
      >
        <Grid container direction="column" spacing={6}>
          <Grid item xs={12}>
            <Typography
              align="center"
              variant="h3"
              color="primary"
              className={classes.contentTitle}
            >
              Do you want to permanently delete the event?
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
              data-testid="deleteEventConfirmBtn"
              color="error"
            >
              PERMANENT DELETE
            </MUILink>
          </Grid>
        </Grid>
      </Modal>
    </Grid>
  );
};
