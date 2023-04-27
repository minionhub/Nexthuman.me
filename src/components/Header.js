import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import {
  Box,
  AppBar,
  Typography,
  Toolbar,
  Grid,
  Button,
  Popper,
  ClickAwayListener,
  Paper,
  MenuList,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MUILink from '@material-ui/core/Link';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CharacterAvatar from './CharacterAvatar';
import routes from '../constants/routes.json';
import theme from '../theme';
import users from '../store/actions/users';
import characterActions from '../store/actions/characters';
const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    justifyContent: 'center',
  },
  header: {
    maxWidth: '1440px',
    padding: '0px 20px',
    position: 'relative',
    [theme.breakpoints.up('sm')]: {
      padding: '0px  20px',
    },
    [theme.breakpoints.up('md')]: {
      padding: '0px  40px',
    },
    [theme.breakpoints.up('lg')]: {
      padding: '0px  160px',
    },
    height: '60px',
    '@media (min-width:780px)': {
      height: '90px',
    },
  },
  toolbar: {
    margin: 'auto',
    width: '100%',
    padding: '0px',
  },
  menuIcon: {
    display: 'none',
    color: 'white',
    '@media (max-width:780px)': {
      display: 'block',
    },
  },
  logoWrapper: {
    flex: '1 0 auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    display: 'inline-flex',
    fontFamily: 'Fira Sans',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 34,
    lineHeight: '41px',
    textAlign: 'center',
    letterSpacing: 0.25,
    color: 'white',
    cursor: 'pointer',
    textDecoration: 'none !important',
    '@media (max-width: 991px)': {
      fontSize: '24px',
    },
    '@media (max-width:780px)': {
      textAlign: 'center',
      fontSize: '18px',
      lineHeight: '22px',
    },
  },
  menuBox: {
    display: 'none',
    justifyContent: 'flex-start',
    paddingLeft: 60,
    '@media (min-width:780px)': {
      display: 'flex',
    },
    '&.loggedIn': {
      justifyContent: 'center',
      paddingLeft: 0,
    },
  },
  buttons: {
    display: 'none',
    color: 'white',
    padding: '8px 8px',
    fontSize: '18px',
    lineHeight: '24px',
    fontFamily: 'Fira Sans',
    fontWeight: 400,
    '&.active': {
      backgroundColor: '#6A2C70',
    },
    '@media (min-width:780px)': {
      display: 'block',
    },
    '@media (min-width:991px)': {
      fontSize: '20px',
      padding: '8px 12px',
    },
  },
  btnGetStarted: {
    marginLeft: '15px',
    borderRadius: '4px',
    paddingLeft: 20,
    paddingRight: 20,
  },
  link: {
    cursor: 'pointer',
    color: 'white',
    display: 'flex',
    '&:hover': {
      textDecoration: 'none',
    },
  },
  navUserInfoWrapper: {
    maxWidth: '200px',
    paddingRight: 0,
    '& .MuiButton-label': {
      display: 'flex',
      overflow: 'hidden',
      '& .MuiAvatar-root': {
        flex: '0 0 45px',
      },
    },
  },
  userInfo: {
    marginLeft: '12px',
    display: 'none',
    textAlign: 'left',
    flex: '1 1 100%',
    overflow: 'hidden',
    '@media (min-width:780px)': {
      display: 'block',
    },
  },
  userInfoMenuItem: {
    marginLeft: '12px',
    textAlign: 'left',
    flex: '1 1 100%',
    display: 'flex',
    flexDirection: 'column',
    height: '45px',
    overflow: 'hidden',
  },
  userInfoButton: {
    backgroundColor: 'transparent',
    padding: 0,
    '& .MuiButton-label': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  dropdownIcon: {
    marginLeft: '10px',
    color: 'white',
  },
  userNavMenu: {
    position: 'absolute!important',
    top: '90px!important',
    right: 0,
    transform: 'none!important',
    left: 'auto!important',
    width: '255px',
    zIndex: 999,
    [theme.breakpoints.up('sm')]: {
      right: 20,
    },
    [theme.breakpoints.up('md')]: {
      right: 40,
    },
    [theme.breakpoints.up('lg')]: {
      right: 160,
    },
    '@media (max-width:780px)': {
      width: '215px',
      top: '60px!important',
      right: '0px',
    },
  },
  menuPaper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxHeight: '450px',
    color: 'white',
    textAlign: 'center',
    padding: '5px 0px 20px',
    backgroundColor: theme.palette.secondary.main,
  },
  menuList: {
    width: '100%',
    overflowY: 'auto',
    flex: '1 1 100%',
  },
  menuBtns: {
    backgroundColor: theme.palette.additional,
    borderRadius: '4px',
    color: 'white',
    fontSize: '10px',
    lineHeight: '12px',
    width: '150px',
    margin: '6px',
    paddingTop: 6,
    paddingBottom: 6,
    '&:hover': {
      backgroundColor: '#af7155',
    },
  },
  menuItem: {
    display: 'flex',
    padding: '9px 25px',
  },
  characterName: {
    fontFamily: 'Lato',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '14px',
    lineHeight: '14px',
    letterSpacing: '0.25px',
    color: '#FFFFFF',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '100%',
  },
  characterTagLine: {
    fontFamily: 'Lato',
    fontSize: '12px',
    lineHeight: '14.4px',
    letterSpacing: '0.25px',
    fontWeight: 'normal',
    color: 'white',
    maxWidth: '100%',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  characterDetail: {
    color: '#F08A5D',
    fontSize: '10px',
    lineHeight: '12px',
    letterSpacing: '0.25px',
    display: 'flex',
    alignItems: 'center',
    '& .MuiSvgIcon-root': {
      fontSize: '15px',
      marginLeft: '4px',
    },
  },
});

export default (props) => {
  const theme = useTheme();
  const classes = useStyles({ theme });
  const [authUser, setAuthUser] = useState(null);
  const { isLoggedIn, setIsLoggedIn, setOpenSidebar, logOut } = props;
  const [name, setName] = useState('');
  const [open, setOpen] = React.useState(false);
  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [characters, setCharacters] = useState([]);
  const characterStore = useSelector((state) => state.characterStore);
  const userStore = useSelector((state) => state.userStore);
  const anchorRef = React.useRef(null);
  const handleUserNavToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const history = useHistory();
  const dispatch = useDispatch();
  // const getProfilesForCurrentUser = (uid) => dispatch(users.getProfilesForCurrentUser(uid));
  const getCharacters = (uid) => dispatch(characterActions.getCharacters(uid));
  // useFirestoreConnect([{
  // 	collection: 'profiles',
  // 	doc: authUser.profileRefs[0].id,
  // }])
  // const profile = useSelector(state => state.firestore.data.profiles && state.firestore.data.profiles[authUser.profileRefs[0].id]);
  // console.log(profile);
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const selectCharacter = (event, characterId) => {
    handleClose(event);
    dispatch(users.setLastSelectedCharacter(authUser.uid, characterId));
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (authUser != null) {
      getCharacters(authUser.uid).then((characters) => {
        // console.log(characters);
      });
      setName(authUser.name);
      setIsLoggedIn(authUser.emailVerified);
    } else {
      setIsLoggedIn(false);
    }
  }, [authUser]);

  useEffect(() => {
    characters.forEach((item) => {
      if (item.characterId === authUser.lastSelectedCharacter) {
        setCurrentCharacter(item);
      }
    });
    if (!currentCharacter) setCurrentCharacter(characters[0]);
  }, [characters]);

  useEffect(() => {
    setCharacters(characterStore.characters);
  }, [characterStore]);

  useEffect(() => {
    if (userStore.authUser != null) {
      setAuthUser(userStore.authUser);
    }
  }, [userStore]);

  const checkActivePage = (btnLink) => {
    const location = history.location;
    if (location.pathname.indexOf(btnLink) === 0) return true;
    return false;
  };

  return (
    <Box className={classes.root}>
      <AppBar className={classes.header} position="static" color="primary" elevation={0}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            className={classes.menuIcon}
            aria-label="menu"
            onClick={() => {
              setOpenSidebar(true);
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box className={classes.logoWrapper}>
            <MUILink
              className={classes.headerTitle}
              variant="h4"
              onClick={() => {
                history.push('/');
              }}
            >
              NextHuman
            </MUILink>
          </Box>

          <Grid
            className={[classes.menuBox, isLoggedIn ? 'loggedIn' : ''].join(' ')}
            container
            spacing={2}
          >
            <Grid item>
              <Button
                className={[classes.buttons, checkActivePage(routes.BOOKS) ? 'active' : ''].join(
                  ' '
                )}
                component={RouterLink}
                to={routes.BOOKS}
              >
                Books
              </Button>
            </Grid>
            <Grid item>
              <Button
                className={[classes.buttons, checkActivePage(routes.EVENTS) ? 'active' : ''].join(
                  ' '
                )}
                component={RouterLink}
                to={routes.EVENTS}
              >
                Events
              </Button>
            </Grid>

            {isLoggedIn && (
              <Grid item>
                <Button
                  className={[classes.buttons, checkActivePage('/account') ? 'active' : ''].join(
                    ' '
                  )}
                  component={RouterLink}
                  to={`/account/${authUser.uid}`}
                  data-testid="myaccount"
                >
                  My Account
                </Button>
              </Grid>
            )}
            {isLoggedIn && authUser && authUser.type == 'admin' && (
              <Grid item>
                <Button
                  className={[classes.buttons, checkActivePage(routes.USERS) ? 'active' : ''].join(
                    ' '
                  )}
                  component={RouterLink}
                  to={routes.USERS}
                  data-testid="link-account"
                >
                  Users
                </Button>
              </Grid>
            )}
          </Grid>

          {isLoggedIn && (
            <Button
              className={classes.navUserInfoWrapper}
              ref={anchorRef}
              aria-controls={open ? 'menu-list-grow' : undefined}
              aria-haspopup="true"
              data-testid="nav-btn"
              onClick={handleUserNavToggle}
              style={{ flexShrink: 0 }}
            >
              {currentCharacter != null && (
                <>
                  <CharacterAvatar
                    characterInfo={currentCharacter}
                    size={45}
                    backColor={theme.palette.secondary.main}
                    data-testid="selected-avatar"
                  />
                  <Box className={classes.userInfo} style={{ justifyContent: 'center' }}>
                    <Box style={{ display: 'flex', alignItems: 'center', height: '14px' }}>
                      <Typography
                        variant="subtitle2"
                        className={classes.characterName}
                        data-testid="selected-name"
                      >
                        {currentCharacter.name}{' '}
                      </Typography>
                      <ExpandMoreIcon className={classes.dropdownIcon}></ExpandMoreIcon>
                    </Box>
                    <Typography
                      variant="body2"
                      className={classes.characterTagLine}
                      data-testid="selected-tagline"
                    >
                      {currentCharacter.tagline.toLowerCase() === 'default'
                        ? ''
                        : currentCharacter.tagline}
                    </Typography>
                  </Box>
                </>
              )}
            </Button>
          )}

          {!isLoggedIn && (
            <>
              <Button
                className={[classes.buttons, checkActivePage(routes.LOGIN) ? 'active' : ''].join(
                  ' '
                )}
                component={RouterLink}
                to={routes.LOGIN}
                data-testid="signin"
                style={{ flexShrink: 0 }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                color="secondary"
                className={[classes.btnGetStarted, classes.buttons].join(' ')}
                component={RouterLink}
                data-testid="get-started"
                to={routes.SIGNUP}
                style={{ flexShrink: 0 }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Toolbar>

        {isLoggedIn && (
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            data-testid="character-menu"
            className={classes.userNavMenu}
            role={undefined}
            transition
            disablePortal
          >
            <Paper className={classes.menuPaper}>
              <ClickAwayListener onClickAway={handleClose}>
                <>
                  <MenuList
                    autoFocusItem={open}
                    id="menu-list-grow"
                    className={classes.menuList}
                    onKeyDown={handleListKeyDown}
                  >
                    {characters.map((character) => {
                      return (
                        <Box key={character.characterId} className={classes.menuItem}>
                          <CharacterAvatar
                            characterInfo={character}
                            size={45}
                            backColor={theme.palette.primary.main}
                            onClick={(event) => selectCharacter(event, character.characterId)}
                            data-testid="change-character-button"
                          />

                          <Box className={classes.userInfoMenuItem}>
                            <Button
                              className={classes.userInfoButton}
                              onClick={(event) => selectCharacter(event, character.characterId)}
                              data-testid="change-character-button"
                            >
                              <Typography
                                variant="subtitle2"
                                className={classes.characterName}
                                style={{
                                  lineHeight:
                                    character.tagline.toLowerCase() === 'default' ? '28px' : '14px',
                                }}
                              >
                                {character.name}
                              </Typography>
                              <Typography variant="body2" className={classes.characterTagLine}>
                                {character.tagline.toLowerCase() === 'default'
                                  ? ''
                                  : character.tagline}
                              </Typography>
                            </Button>
                            <MUILink
                              component="button"
                              onClick={(e) => {
                                handleClose(e);
                                e.preventDefault();
                                e.stopPropagation();
                                history.push(`/character/${character.characterId}`);
                              }}
                              className={classes.characterDetail}
                            >
                              Character details
                              <ChevronRightIcon />
                            </MUILink>
                          </Box>
                        </Box>
                      );
                    })}
                  </MenuList>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    className={classes.menuBtns}
                    component={RouterLink}
                    to={routes.NEWCHARACTER}
                    onClick={handleClose}
                    data-testid="add-character"
                  >
                    ADD CHARACTER
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<ExitToAppIcon />}
                    className={classes.menuBtns}
                    onClick={logOut}
                  >
                    SIGN OUT
                  </Button>
                </>
              </ClickAwayListener>
            </Paper>
          </Popper>
        )}
      </AppBar>
    </Box>
  );
};
