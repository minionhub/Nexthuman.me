import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Fab, Box, Avatar } from '@material-ui/core';
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';

const useStyles = makeStyles({
  root: {
    padding: 0,
    backgroundColor: 'transparent !important',
    flexShrink: 0,
    position: 'relative',
    '& .MuiFab-label': {
      width: '100%',
      height: '100%',
    },
  },
  avatar: {
    backgroundColor: 'transparent',
    color: 'white',
    position: 'relative',
    overflow: 'visible',
    flexShrink: 0,
    '& .MuiAvatar-img': {
      borderRadius: '50%',
    },
  },
  anonymous: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 18,
    height: 18,
    backgroundColor: '#F1554C',
    border: '1px solid white',
    borderRadius: 9,
    bottom: 0,
    right: 0,
    color: 'white',
    '& .MuiSvgIcon-root': {
      fontSize: 13,
    },
  },
});
export default ({ characterInfo, size = 40, backColor, onClick, ...props }) => {
  const theme = useTheme();
  const classes = useStyles({ theme });

  const mainContent = !!characterInfo.avatar ? (
    <Box className={classes.root}>
      <Avatar
        className={classes.avatar}
        src={characterInfo.avatar}
        style={{ width: size, height: size }}
        alt={characterInfo.name}
        {...props}
      ></Avatar>
      {characterInfo.anonymous && (
        <Box className={classes.anonymous}>
          <VisibilityOffOutlinedIcon />
        </Box>
      )}
    </Box>
  ) : (
    <Avatar
      className={classes.avatar}
      alt={characterInfo.name}
      style={{ backgroundColor: backColor, width: size, height: size }}
      {...props}
    >
      {characterInfo.name.charAt(0).toUpperCase()}
      {characterInfo.anonymous && (
        <Box className={classes.anonymous}>
          <VisibilityOffOutlinedIcon />
        </Box>
      )}
    </Avatar>
  );

  if (!!onClick) {
    return (
      <Fab className={classes.root} style={{ width: size, height: size }} onClick={onClick}>
        {mainContent}
      </Fab>
    );
  } else return <>{mainContent}</>;
};
