import React from 'react';
import { TextField } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import ProducerCard from './ProducerCard';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    border: '1px solid rgba(0, 0, 0, 0.23);',
    borderRadius: '3px',
    padding: '17px',
    [theme.breakpoints.down('md')]: {
      padding: '17px 8px',
    },
  },
  title: {
    height: '16px',
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0 9px 0 5px',
    fontSize: '0.75em',
    background: 'white',
    position: 'absolute',
    left: '14px',
    top: '-8px',
    color: '#333',
    margin: 0,
  },
  textField: {
    backgroundColor: '#FAFAFA',
    '& .MuiAutocomplete-inputRoot': {
      paddingTop: 0,
      paddingBottom: 0,
    },
    '& .MuiInputBase-input': {
      padding: '11px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'transparent',
    },
  },
  characterWrapper: {
    width: '100%',
    flex: '1 1 100%',
    overflowY: 'auto',
    marginTop: '17px',
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'baseline',
  },
  producerCardStyle: {
    height: '47px',
    marginRight: '20px',
    marginBottom: '10px',
  },
}));

const filter = createFilterOptions();

const getOptionLabelDefault = (option) => {
  if (typeof option === 'string') {
    return option;
  }
  return option ? option.label : 'N/A';
};

const CharacterSelector = ({
  wrapperClass = {},
  value,
  onChange = () => {},
  error = false,
  helperText = null,
  options = [],
  getOptionLabel = getOptionLabelDefault,
  renderOption = getOptionLabelDefault,
  getOptionSelected = (o, v) => o === v,
  allowEmpty = true,
  ...props
}) => {
  const classes = useStyles({ theme: useTheme() });

  const handleChange = async (event, newValue, reason) => {
    onChange(newValue.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i));
  };

  return (
    <div className={[classes.root, wrapperClass].join(' ')}>
      <p className={classes.title}>Characters*</p>
      <Autocomplete
        {...props}
        id="character-autocomplete"
        value={value}
        multiple
        options={options}
        filterOptions={(options, params) => filter(options, params)}
        getOptionLabel={(option) => (option.inputValue ? option.label : getOptionLabel(option))}
        renderOption={(option) => (option.inputValue ? option.label : renderOption(option))}
        getOptionSelected={getOptionSelected}
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
              ),
            }}
            InputLabelProps={{
              ...InputLabelProps,
              shrink: true,
            }}
          />
        )}
      />
      <div className={classes.characterWrapper}>
        {value.map((option, index) => (
          <ProducerCard
            wrapperClass={classes.producerCardStyle}
            key={option.name + index}
            photo={option.avatar}
            name={option.name}
            designation={option.tagline}
            showCancelIcon={allowEmpty ? true : value.length === 1 && index === 0 ? false : true}
            onRemove={() => {
              onChange(value.filter((item) => item.id !== option.id));
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CharacterSelector;
