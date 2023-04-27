import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { Link as RouterLink } from 'react-router-dom';
import { Box, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import EventNoteIcon from '@material-ui/icons/EventNote';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountBoxOutlinedIcon from '@material-ui/icons/AccountBoxOutlined';
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import clsx from 'clsx';
import theme from '../theme';
import routes from '../constants/routes.json';

const useStyles = makeStyles({
  list: {
    minWidth: 256,
    height: '100%',
    padding: '60px 12px 20px 12px',
    color: 'white',
    backgroundColor: theme.palette.primary.main,
  },
  fullList: {
    width: 'auto',
  },
  menuContainer: {
    display: 'none',
    '@media (max-width:780px)': {
      // eslint-disable-line no-useless-computed-key
      display: 'block',
    },
  },
  listItem: {
    paddingLeft: 13,
    paddingRight: 13,
    '& .MuiListItemIcon-root': {
      minWidth: 24,
      display: 'flex',
      justifyContent: 'center',
      marginRight: 13,
    },
    // '& .MuiListItemText-primary': {
    //   fontFamily: 'Fira Sans',
    //   fontStyle: 'normal',
    //   fontWeight: 'normal',
    //   fontSize: 20,
    //   lineHeight: 24,
    //   letterSpacing: '0.15px'
    // }
  },
  menuActive: {
    backgroundColor: theme.palette.secondary.main,
    borderRadius: '4px',
  },
  btnGetStarted: {
    marginTop: '38px',
    borderRadius: '4px',
    fontSize: '14px',
    lineHeight: '16px',
    color: 'white',
    width: '100%',
    padding: '15px',
  },
});
export default (props) => {
  const classes = useStyles();
  const [authUser, setAuthUser] = useState(null);
  const { open, setOpen, isLoggedIn, logout } = props;
  const userStore = useSelector((state) => state.userStore);
  const history = useHistory();
  const toggleDrawer = (state) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(state);
    console.log('toggleDrawer');
  };
  const navigateMenu = (route) => {
    history.push(route);
  };
  const list = (anchor) => (
    <Box
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem
          className={[
            classes.listItem,
            history.location.pathname == routes.BOOKS ? classes.menuActive : '',
          ].join(' ')}
          button
          key={'Books'}
          onClick={() => navigateMenu(routes.BOOKS)}
        >
          <ListItemIcon>
            <MenuBookIcon style={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary={'Books'} />
        </ListItem>
        <ListItem
          className={[
            classes.listItem,
            history.location.pathname == routes.EVENTS ? classes.menuActive : '',
          ].join(' ')}
          button
          key={'Events'}
          onClick={() => navigateMenu(routes.EVENTS)}
        >
          <ListItemIcon>
            <EventNoteIcon style={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary={'Events'} />
        </ListItem>
        {isLoggedIn && (
          <ListItem
            className={[
              classes.listItem,
              history.location.pathname == routes.ACCOUNT ? classes.menuActive : '',
            ].join(' ')}
            button
            key={'My Account'}
            onClick={() => navigateMenu(`/account/${authUser.uid}`)}
          >
            <ListItemIcon>
              <AccountBoxOutlinedIcon style={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary={'My Account'} />
          </ListItem>
        )}
        {isLoggedIn && authUser && authUser.type == 'admin' && (
          <ListItem
            className={[
              classes.listItem,
              history.location.pathname == routes.USERS ? classes.menuActive : '',
            ].join(' ')}
            button
            key={'Users'}
            onClick={() => navigateMenu(routes.USERS)}
          >
            <ListItemIcon>
              <PeopleAltOutlinedIcon style={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary={'Users'} />
          </ListItem>
        )}
        {!isLoggedIn && (
          <ListItem
            className={[
              classes.listItem,
              history.location.pathname == routes.LOGIN ? classes.menuActive : '',
            ].join(' ')}
            button
            key={'Signin'}
            onClick={() => navigateMenu(routes.LOGIN)}
          >
            <ListItemIcon>
              <ExitToAppIcon style={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary={'Sign In'} />
          </ListItem>
        )}
        {/* {isLoggedIn &&
                    <ListItem 
                        className={history.location.pathname == routes.LOGIN? classes.menuActive: ''}
                        button key={"Signout"}
                        onClick={() => {logout();}}
                    >
                        <ListItemIcon><ExitToAppIcon style={{color: 'white'}}/></ListItemIcon>
                        <ListItemText primary={"Sign Out"} />
                    </ListItem>

                }
                 */}
      </List>
      {!isLoggedIn && (
        <Button
          variant="contained"
          color="secondary"
          className={classes.btnGetStarted}
          component={RouterLink}
          to="/signup"
        >
          Sign Up
        </Button>
      )}
    </Box>
  );
  useEffect(() => {
    if (userStore.authUser != null) {
      setAuthUser(userStore.authUser);
    }
  }, [userStore]);
  return (
    <React.Fragment key="left">
      <Drawer
        anchor="left"
        className={classes.menuContainer}
        open={open}
        onClose={toggleDrawer(false)}
      >
        {list('top')}
      </Drawer>
    </React.Fragment>
  );
};
