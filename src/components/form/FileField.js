import React, { useState } from 'react';
import { Button } from './Buttons';
import InputAdornment from '@material-ui/core/InputAdornment';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import CancelIcon from '@material-ui/icons/Cancel';
import { v4 as uuidv4 } from 'uuid';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { useFirebase } from 'react-redux-firebase';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    '& .MuiOutlinedInput-input': {
      color: 'transparent',
    },
    '& .MuiOutlinedInput-input::placeholder': {
      color: '#4F4F4F',
      opacity: 1,
    },
  },
  fileName: {
    width: 'calc(100% - 145px)',
    display: 'flex',
    overflow: 'hidden',
    position: 'absolute',
    left: '14px',
    top: '18.5px',
    '& span': {
      color: theme.palette.secondary.main,
      flex: '1 1 auto',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    '& .cancelIcon': {
      color: '#EB5757',
      marginLeft: '6px',
      cursor: 'pointer',
      flex: '1 0 20px',
      width: '20px',
      height: '20px',
    },
  },
  icon: {
    fontSize: 18,
    marginRight: 12,
  },
}));

export default ({ value, onChange, fileTypes, ...props } = {}) => {
  const [id] = useState(uuidv4());
  const classes = useStyles({ theme: useTheme() });
  const firebase = useFirebase();

  const getStorageToken = async (success, failure) => {
    try {
      const getToken = firebase.functions().httpsCallable('getStorageToken');
      const result = await getToken();
      success(result.data);
    } catch (e) {
      failure('Failed to fetch storage token');
    }
  };

  const tinyDriveConfig = { token_provider: getStorageToken };
  if (fileTypes) {
    tinyDriveConfig.filetypes = fileTypes;
  }

  const browseFile = async () => {
    try {
      const { files } = await window.tinydrive.pick(tinyDriveConfig);
      if (files && files[0]) {
        onChange({ src: files[0].url, format: files[0].name.split('.')[1] });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onClickRemove = () => {
    onChange({ src: '', format: '' });
  };

  return (
    <div className={classes.root}>
      <TextField
        {...props}
        id={id}
        className={classes.root}
        value={value.src}
        onChange={onChange}
        type="text"
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <Button
                className="btn-browse"
                variant="contained"
                color="secondary"
                size="small"
                onClick={browseFile}
              >
                <AddIcon className={classes.icon} /> BROWSE
              </Button>
            </InputAdornment>
          ),
        }}
        InputLabelProps={{
          shrink: true,
        }}
      />

      {value.src && (
        <div className={classes.fileName}>
          <span>{value.src.substring(value.src.lastIndexOf('/') + 1)}</span>
          <CancelIcon onClick={onClickRemove} className="cancelIcon"></CancelIcon>
        </div>
      )}
    </div>
  );
};
