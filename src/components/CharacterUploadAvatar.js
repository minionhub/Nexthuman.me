import React from 'react';
import PropTypes from 'prop-types';
import { useFirebase } from 'react-redux-firebase';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Box, Typography, CardMedia, Paper, Button } from '@material-ui/core';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import PublishOutlinedIcon from '@material-ui/icons/PublishOutlined';
import theme from '../theme';
import ReuploadSvg from '../svg/reupload.svg';

const useStyles = makeStyles({
  paperForAvatar: {
    backgroundColor: '#F2F2F2',
    color: theme.palette.primary.main,
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height: 513,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '@media (min-width:960px)': {
      maxHeight: '548px',
      height: '548px',
      backgroundColor: theme.palette.secondary.main,
      color: 'white',
      borderRadius: '8px',
    },
  },
  uploadImageArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  emptyAvatar: {
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: '100px',
  },
  characterImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  uploadDescription: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 1,
  },
  btn: {
    backgroundColor: theme.palette.additional,
    color: 'white',
    borderRadius: '4px',
    fontSize: '10px',
    lineHeight: '12px',
    '&:hover': {
      backgroundColor: '#af7155',
    },
  },
  btnUpload: {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    padding: '5px 15px',
    transform: 'translate(-50%, -50%)',
    '& .reupload-img': {
      margin: '2px 8px 2px 0',
    },
  },
});

const CharacterUploadAvatar = ({ characterImage, editMode, setCharacterImage }) => {
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
  tinyDriveConfig.filetypes = ['image'];

  const browseFile = async () => {
    try {
      const { files } = await window.tinydrive.pick(tinyDriveConfig);
      if (files && files[0]) {
        setCharacterImage(files[0].url);
      }
      // console.log(files);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Paper className={classes.paperForAvatar} elevation={0}>
      <Box className={classes.uploadImageArea}>
        {characterImage !== '' ? (
          <CardMedia
            image={characterImage}
            className={[classes.emptyAvatar, classes.characterImage].join(' ')}
          />
        ) : (
          <AccountCircleOutlinedIcon className={classes.emptyAvatar}></AccountCircleOutlinedIcon>
        )}

        {!characterImage && (
          <Box className={classes.uploadDescription}>
            <Typography variant="h5" style={{ margin: '10px 0px' }}>
              Character Image
            </Typography>
            <Typography variant="caption">Maximum File Size: 2MB</Typography>
          </Box>
        )}
      </Box>
      {editMode &&
        (characterImage ? (
          <Button
            variant="contained"
            size="small"
            data-testid="upload-image"
            className={[classes.btn, classes.btnUpload].join(' ')}
            onClick={browseFile}
          >
            <img className="reupload-img" src={ReuploadSvg} alt="" />
            REUPLOAD IMAGE
          </Button>
        ) : (
          <Button
            variant="contained"
            size="small"
            startIcon={<PublishOutlinedIcon />}
            data-testid="upload-image"
            className={[classes.btn, classes.btnUpload].join(' ')}
            onClick={browseFile}
          >
            UPLOAD IMAGE
          </Button>
        ))}
    </Paper>
  );
};

CharacterUploadAvatar.propTypes = {
  characterImage: PropTypes.string,
  editMode: PropTypes.bool,
  setCharacterImage: PropTypes.func,
};

export default CharacterUploadAvatar;
