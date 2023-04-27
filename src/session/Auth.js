import React, { useState, useEffect } from 'react';
import TagManager from 'react-gtm-module';
import { useDispatch } from 'react-redux';
import { onAuthUserListener } from '../services/auth/auth.firebase';
import userActions from '../store/actions/users';
export const AuthContext = React.createContext({});

export default function Auth({ children }) {
  const [authUser, setAuthUser] = useState({
    authUser: JSON.parse(localStorage.getItem('authUser')),
  });
  const dispatch = useDispatch();
  const setAuthUserToStore = (authUser) => dispatch(userActions.setAuthUser(authUser));
  useEffect(() => {
    onAuthUserListener(
      (authUser) => {
        TagManager.dataLayer({
          dataLayer: {
            event: 'login',
            userId: authUser.uid,
          },
        });
        localStorage.setItem('authUser', JSON.stringify(authUser));
        setAuthUser({ authUser });
        setAuthUserToStore(authUser);
      },
      () => {
        localStorage.removeItem('authUser');
        setAuthUser({ authUser: null });
        setAuthUserToStore(null);
      }
    );
  }, []);

  return <AuthContext.Provider value={authUser}>{children}</AuthContext.Provider>;
}
