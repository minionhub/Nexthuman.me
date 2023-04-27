import React from 'react';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import {
  Grid,
  Typography,
  Paper,
  TextField,
  Switch,
  FormControlLabel,
  Chip,
  Button,
  IconButton
} from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import ExperienceSelector from './ExperienceSelector';
import theme from '../theme';

const CharacterTextField = withStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
        color: 'white'
      },
      '&:hover fieldset': {
        borderColor: 'white',
        color: 'white'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
        color: 'white'
      }
    },
    '& .MuiInputLabel-outlined': {
      transform: 'translate(14px, 16px) scale(1)'
    },
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
      transform: 'translate(14px, -6px) scale(0.85)'
    },
    '& .MuiInputBase-input': {
      color: 'white'
    },
    '& .MuiInputLabel-root': {
      color: 'white'
    },
    '& label.Mui-focused': {
      color: 'white'
    },
    '& .MuiOutlinedInput-input': {
      paddingTop: 14.5,
      paddingBottom: 14.5
    },
    // '& .MuiOutlinedInput-inputMarginDense': {
    //   paddingTop: 8.5,
    //   paddingBottom: 8.5
    // },
    '& .MuiOutlinedInput-multiline': {
      paddingTop: '10.5px',
      paddingBottom: '10.5px'
    },
    '& .MuiOutlinedInput-inputMultiline': {
      padding: '0 !important'
    }
  }
})(TextField);

const CharacterSwitch = withStyles({
  switchBase: {
    color: theme.palette.additional,
    '&$checked': {
      color: theme.palette.additional
    },
    '&$checked + $track': {
      backgroundColor: theme.palette.additional
    }
  },
  checked: {},
  track: {}
})(Switch);

const AddtionalButton = withStyles({
  root: {
    padding: '10px 25px',
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.additional,
      color: 'white',
      border: '1px solid',
      borderColor: theme.palette.additional
    },
    '&.MuiButton-outlined': {
      backgroundColor: 'transparent',
      color: theme.palette.additional,

      borderColor: theme.palette.additional
    },
    '& .MuiButton-label': {
      fontSize: '10px',
      lineHeight: '12px',
      letterSpacing: '1.25px',
      textTransform: 'uppercase'
    }
  }
})(Button);

const useStyles = makeStyles({
  paperForDescription: {
    backgroundColor: theme.palette.secondary.main,
    position: 'relative',
    color: 'white',
    height: 'auto',
    padding: '40px 20px',
    width: '100%',
    marginTop: '-48px',
    borderRadius: '24px 24px 0 0',
    '@media (min-width:960px)': {
      // eslint-disable-line no-useless-computed-key
      maxHeight: '548px',
      height: '548px',
      borderRadius: '8px',
      padding: '40px 40px',
      marginTop: '0px'
    },
    '@media (min-width:1280px)': {
      padding: props => {
        return props.isEdit ? '40px 95px 30px' : '58px 91px 40px';
      }
    }
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    '& .MuiTypography-h4': {
      flex: '1 1 100%',
      marginRight: theme.spacing(1),
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  },
  fields: {
    margin: '0 0 16px 0'
  },
  switch: {
    color: theme.palette.additional
  },
  formBottom: {
    marginTop: '10px',
    display: 'block',
    '@media (min-width:960px)': {
      // eslint-disable-line no-useless-computed-key
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  },
  experiences: {
    height: '130px',
    borderColor: 'white'
  },
  anonymous: {
    fontFamily: 'Lato',
    fontSize: '13px',
    lineHeight: '16px',
    letterSpacing: '0.4px'
  },
  saveBtn: {
    marginLeft: '15px',
    '@media (min-width:960px)': {
      // eslint-disable-line no-useless-computed-key
      marginLeft: '30px'
    }
  },
  deleteButton: {
    color: 'white',
    padding: 8,
    '& .MuiSvgIcon-root': {
      fontSize: '24px'
    }
  },
  editButton: {
    color: 'white',
    padding: 8,
    '& .MuiSvgIcon-root': {
      fontSize: '24px'
    }
  },
  storyClip: {
    height: '40px',
    backgroundColor: '#F08A5D',
    borderRadius: '20px',
    paddingLeft: '12.5px',
    paddingRight: '12.5px',
    color: 'white',
    '& .MuiChip-icon': {
      margin: 0,
      padding: 0
    },
    '& .MuiChip-label': {
      fontFamily: 'LATO',
      fontSize: '15px',
      padding: '0 0 0 5.5px'
    }
  }
});

const CharacterForm = ({
  isEnableEdit = false,
  isNew = false,
  editMode,
  setEditMode = () => {},
  experiences,
  allExperiences,
  setExperiences,
  characterName,
  setCharacterName,
  tagline,
  setTagline,
  bio,
  setBio,
  intentions,
  setIntentions,
  anonymous,
  setAnonymous,
  setIsOpenDeleteDialog = () => {},
  errors,
  characterStore = {},
  saveCharacter,
  goBack = () => {}
}) => {
  const classes = useStyles({ theme: useTheme(), isEdit: isNew || editMode });

  return (
    <Paper className={classes.paperForDescription} elevation={0}>
      {editMode ? (
        <>
          <CharacterTextField
            id="characterName"
            className={classes.fields}
            label="Character Name"
            variant="outlined"
            fullWidth
            value={characterName}
            onChange={e => setCharacterName(e.target.value)}
            data-testid="textField-character-name"
          />
          <CharacterTextField
            id="tagLine"
            className={classes.fields}
            label="Tagline"
            variant="outlined"
            size="small"
            fullWidth
            value={tagline}
            onChange={e => setTagline(e.target.value)}
            data-testid="textField-character-tagline"
          />
          <CharacterTextField
            id="bio"
            className={classes.fields}
            label="Bio"
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            value={bio}
            onChange={e => setBio(e.target.value)}
            data-testid="textArea-character-bio"
          />
          <CharacterTextField
            id="intensions"
            className={classes.fields}
            label="Intentions"
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            value={intentions}
            onChange={e => setIntentions(e.target.value)}
            data-testid="textArea-character-intentions"
          />
          <ExperienceSelector
            nType={1}
            wrapperClass={[classes.fields, classes.experiences].join(' ')}
            value={experiences}
            onChange={setExperiences}
            fullWidth
            multiple={true}
            error={!!errors.experiences}
            helperText={!!errors.experiences && errors.experiences.message}
            label="Experiences*"
            options={allExperiences}
            getOptionLabel={o => o.name}
            renderOption={o => o.name}
            getOptionSelected={(o, v) => v && v.id === o.id}
            data-testid="autocomplete-character-experiences"
          />
          <Grid
            container
            className={classes.formBottom}
            wrap="wrap"
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item sm={6} xs={12}>
              <FormControlLabel
                control={
                  <CharacterSwitch
                    checked={anonymous}
                    onChange={e => setAnonymous(e.target.checked)}
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                  />
                }
                className={classes.anonymous}
                label={<Typography variant="caption">Make my profile anonymous</Typography>}
                data-testid="switch-anonymous"
              />
            </Grid>
            <Grid item container sm={6} xs={12} spacing={2} justify="flex-end">
              <Grid item>
                <AddtionalButton
                  variant="outlined"
                  onClick={() => {
                    if (isNew) goBack();
                    else setEditMode(false);
                  }}
                >
                  Cancel
                </AddtionalButton>
              </Grid>
              <Grid item>
                <AddtionalButton
                  variant="contained"
                  onClick={saveCharacter}
                  data-testid="save-character"
                >
                  Save
                </AddtionalButton>
              </Grid>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12} className={classes.titleWrapper}>
              <Typography variant="h4" data-testid="label-character-name">
                {characterName}
              </Typography>
              {!isNew && isEnableEdit && (
                <>
                  <IconButton
                    aria-label="edit"
                    className={classes.editButton}
                    onClick={() => setEditMode(true)}
                    data-testid="edit-character"
                  >
                    <EditOutlinedIcon fontSize="large" />
                  </IconButton>
                  {characterStore.characters.length > 1 && (
                    <IconButton
                      aria-label="delete"
                      className={classes.deleteButton}
                      onClick={() => setIsOpenDeleteDialog(true)}
                      data-testid="delete-character"
                    >
                      <DeleteOutlineOutlinedIcon fontSize="large" />
                    </IconButton>
                  )}
                </>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" data-testid="label-character-tagline">
                {tagline}
              </Typography>
            </Grid>
            <Grid item xs={12} style={{ minHeight: '70px' }}>
              <Typography variant="body2" data-testid="label-character-bio">
                {bio}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5" data-testid="label-character-intentions">
                Intentions
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" data-testid="label-character-caption">
                {intentions}
              </Typography>
            </Grid>
            <Grid item xs={12} style={{ paddingTop: theme.spacing(3) }}>
              <Grid container spacing={1}>
                {experiences.map((item, index) => {
                  return (
                    <Grid item key={item.id}>
                      <Chip
                        className={classes.storyClip}
                        icon={<StarIcon style={{ fill: 'white', fontSize: '18px' }} />}
                        label={item.name}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
    </Paper>
  );
};

// CharacterForm.propTypes = {
//   editMode: PropTypes.boolean,
//   setCharacterName: PropTypes.func
// };

export default CharacterForm;
