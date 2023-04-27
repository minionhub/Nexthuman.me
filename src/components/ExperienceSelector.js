import React from 'react';
import { TextField } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import StarIcon from '@material-ui/icons/Star';
import CancelIcon from '@material-ui/icons/Cancel';
import Typography from '@material-ui/core/Typography';
import theme from '../theme';

const useStyles = makeStyles({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    border: '1px solid rgba(0, 0, 0, 0.23);',
    borderRadius: '3px',
    padding: '17px 12px',
    [theme.breakpoints.down('md')]: {
      padding: '17px 8px'
    }
  },
  title: {
    height: '16px',
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0 9px 0 5px',
    fontSize: '0.75em',
    background: props => {
      if (props.nType === 0) return 'white';
      else return '#6A2C70';
    },
    position: 'absolute',
    left: '14px',
    top: '-8px',
    color: props => {
      if (props.nType === 0) return '#333';
      else return 'white';
    },
    margin: 0
  },
  textField: {
    '& .MuiAutocomplete-inputRoot': {
      paddingTop: 0,
      paddingBottom: 0,
      color: props => {
        if (props.nType === 0) return '#333';
        else return 'white';
      },
      backgroundColor: props => {
        if (props.nType === 0) return '#FAFAFA';
        else return '#F08A5D';
      }
    },
    '& .MuiInputBase-input': {
      padding: '11px'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'transparent'
    },
    '& .MuiAutocomplete-endAdornment': {
      '& .MuiAutocomplete-popupIndicator': {
        color: props => {
          if (props.nType === 0) return '#333';
          else return 'white';
        }
      }
    }
  },
  experienceWrapper: {
    width: '100%',
    flex: '1 1 100%',
    overflowY: 'auto',
    marginTop: '17px',
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'baseline'
  },
  tagWrapper: {
    display: 'flex',
    alignItems: 'center',
    height: '32px',
    margin: '0 10px 10px 0',
    padding: '9px 9px 7px 15px',
    backgroundColor: props => {
      if (props.nType === 0) return 'rgba(33, 33, 33, 0.08)';
      else return '#F2F2F2';
    },
    borderRadius: '16px',
    '& .MuiSvgIcon-root': {
      color: props => {
        if (props.nType === 0) return '#F08A5D';
        else return '#F08A5D';
      }
    },
    '& .MuiTypography-body2': {
      fontFamily: 'Lato',
      margin: '0 8px',
      color: props => {
        if (props.nType === 0) return '#333';
        else return '#333';
      }
    }
  },
  cancelIcon: {
    color: '#EB5757',
    cursor: 'pointer',
    fontSize: '20px'
  }
});

const filter = createFilterOptions();

const getOptionLabelDefault = option => {
  if (typeof option === 'string') {
    return option;
  }
  return option ? option.label : 'N/A';
};

const ExperienceSelector = ({
  wrapperClass = {},
  nType = 0, // 0: story page styles, 1: character page styles
  value = [],
  onChange = () => {},
  error = false,
  helperText = null,
  options = [],
  multiple,
  creatable = false,
  onCreate,
  getOptionLabel = getOptionLabelDefault,
  renderOption = getOptionLabelDefault,
  getOptionSelected = (o, v) => o === v,
  ...props
}) => {
  const classes = useStyles({ theme: useTheme(), nType: nType });

  const handleChange = async (event, newValue, reason) => {
    let addedOption = multiple ? newValue.pop() : newValue;
    // creating new value
    if (addedOption && addedOption.inputValue) {
      addedOption = await onCreate(addedOption.inputValue);
    }

    if (addedOption) {
      multiple ? onChange([...newValue, addedOption]) : onChange(addedOption);
    } else {
      onChange(newValue);
    }
  };

  return (
    <div className={[classes.root, wrapperClass].join(' ')}>
      <p className={classes.title}>Experiences*</p>
      <Autocomplete
        {...props}
        id="experiences-autocomplete"
        value={value}
        options={options}
        multiple={multiple}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          // Suggest the creation of a new value
          if (params.inputValue !== '' && creatable) {
            filtered.push({
              inputValue: params.inputValue,
              label: `Add "${params.inputValue}"`
            });
          }
          return filtered;
        }}
        getOptionLabel={option => (option.inputValue ? option.label : getOptionLabel(option))}
        renderOption={option => (option.inputValue ? option.label : renderOption(option))}
        onChange={handleChange}
        disableClearable
        renderInput={({ InputProps, InputLabelProps, ...params }) => (
          <TextField
            {...params}
            className={classes.textField}
            variant="outlined"
            error={error}
            color="secondary"
            helperText={helperText}
            InputProps={{
              ...InputProps,
              startAdornment: (
                <InputAdornment>
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            InputLabelProps={{
              ...InputLabelProps,
              shrink: true
            }}
          />
        )}
      />
      <div className={classes.experienceWrapper}>
        {value.map((option, index) => (
          <div className={classes.tagWrapper} key={index}>
            <StarIcon style={{ fontSize: '20px' }} />
            <Typography variant="body2">{option.name}</Typography>
            <CancelIcon
              onClick={() => {
                onChange(value.filter(item => item.id !== option.id));
              }}
              className={classes.cancelIcon}
            ></CancelIcon>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceSelector;
