import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  makeStyles,
  useTheme,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';

const useStyles = makeStyles({
  root: {
    padding: 0,
    width: 'auto',
    maxWidth: 250,
    '& .MuiListItemAvatar-root': {
      minWidth: 'auto',
    },
  },
  avatar: {
    width: '45px',
    height: '45px',
    marginRight: '20px',
    background: '#6A2C70',
  },

  listItemText: {
    color: '#333333',
    '& .MuiListItemText-primary': {
      fontFamily: 'Fira Sans',
      fontWeight: 500,
      fontSize: '14px',
      lineHeight: '17px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    '& .MuiListItemText-secondary': {
      fontFamily: 'Fira Sans',
      fontWeight: 'normal',
      fontSize: '12px',
      lineHeight: '14px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  cancelIcon: {
    color: '#EB5757',
    marginLeft: 10,
    cursor: 'pointer',
  },
});

export default ({
  id = '',
  photo,
  name,
  designation,
  showCancelIcon,
  onRemove,
  isClickable = false,
  style,
  wrapperClass = {},
}) => {
  const history = useHistory();
  const classes = useStyles();

  const gotoCharacter = () => {
    if (!isClickable) return;
    history.push(`/character/${id}`);
  };

  const onClickRemove = (e) => {
    e.stopPropagation();
    e.preventDefault();

    onRemove({
      name: name,
      avatar: photo,
      tagline: designation,
    });
  };

  const avatar = !!photo ? (
    <Avatar className={classes.avatar} src={photo} alt={name}></Avatar>
  ) : (
    <Avatar className={classes.avatar} alt={name}>
      {name && name.length > 0 ? name.charAt(0).toUpperCase() : ''}
    </Avatar>
  );

  return (
    <ListItem
      className={[classes.root, wrapperClass].join(' ')}
      component="div"
      data-testid="producerCard"
      dense
      button={isClickable}
      style={style}
      onClick={gotoCharacter}
    >
      <ListItemAvatar>{avatar}</ListItemAvatar>
      <ListItemText primary={name} secondary={designation} className={classes.listItemText} />
      {showCancelIcon && (
        <CancelIcon onClick={onClickRemove} className={classes.cancelIcon}></CancelIcon>
      )}
    </ListItem>
  );
};
