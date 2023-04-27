import React, { useState, useEffect } from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { doSignOut } from '../services/auth/auth.firebase';
import userActions from '../store/actions/users';
import { useDispatch, useSelector } from 'react-redux';

export default ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const dispatch = useDispatch();
  const setAuthUserToStore = authUser => dispatch(userActions.setAuthUser(authUser));
  const userStore = useSelector(state => state.userStore);

  const logOut = () => {
    doSignOut().then(() => {
      localStorage.clear();
      setIsLoggedIn(false);
      setAuthUserToStore(null);
    });
  };

  useEffect(() => {
    if (userStore && (userStore.authUser === null || userStore.authUser.emailVerified === false)) {
      setIsLoggedIn(false);
    }
  }, [userStore]);

  return (
    <div>
      <CssBaseline />
      <Container disableGutters maxWidth={false}>
        <Header
          openSidebar={openSidebar}
          setOpenSidebar={setOpenSidebar}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          logOut={logOut}
        />

        <Sidebar
          open={openSidebar}
          setOpen={setOpenSidebar}
          isLoggedIn={isLoggedIn}
          logout={logOut}
        />
        {children}
        <Footer />
      </Container>
    </div>
  );
};
