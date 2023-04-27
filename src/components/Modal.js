import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Divider from '@material-ui/core/Divider';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import { Typography } from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  root: {
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: theme.shadows[5],
    width: 1000,
    height: '80%',
    '&:focus': {
      outline: 'none',
    },
    '@media (max-width: 1000px)': {
      // eslint-disable-line no-useless-computed-key
      width: '100%',
      height: 'calc(100% - 100px)',
      marginTop: '100px',
      borderRadius: '24px 24px 0px 0px',
    },
  },
  modalHeader: {
    height: '80px',
    minHeight: '80px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    padding: '0px 100px',
    [theme.breakpoints.down('sm')]: {
      padding: '0px  20px',
    },
  },
  modalContent: {
    padding: '100px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      // eslint-disable-line no-useless-computed-key
      padding: '20px',
    },
  },
  closeIcon: {
    color: '#F1554C',
    position: 'absolute',
    top: '20px',
    right: '80px',
    [theme.breakpoints.down('sm')]: {
      // eslint-disable-line no-useless-computed-key
      right: '20px',
    },
  },
}));

export default (props) => {
  const classes = useStyles();
  const { open, onClose, title } = props;

  return (
    <Modal
      className={classes.modal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      {...props}
    >
      <Fade in={open}>
        <Paper className={classes.root}>
          <div className={classes.modalHeader}>
            {title && (
              <Typography variant="h5" color="primary">
                {title}
              </Typography>
            )}
            <IconButton aria-label="delete" className={classes.closeIcon} onClick={onClose}>
              <CancelIcon />
            </IconButton>
          </div>
          <Divider />
          <div className={classes.modalContent}>{props.children}</div>
        </Paper>
      </Fade>
    </Modal>
  );
};
