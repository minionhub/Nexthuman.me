import React from 'react';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';
import { ThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import Auth from './session/Auth';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import { configureStore } from './store';
import firebase from './store/config/firebase';
import theme from './theme';

import Root from './pages/Root';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';
import ManageAccount from './pages/ManageAccount';
import NewEvent from './pages/event/New';
import EditEvent from './pages/event/Edit';
import EventDetails from './pages/event/Details';
import BookSuccess from './pages/event/BookSuccess';
import BookEvent from './pages/event/Book';
import NewCharacter from './pages/character/New';
import Users from './pages/users';
import DetailCharacter from './pages/character/Detail';
import routes from './constants/routes.json';
import AllEvents from './pages/event/All';
import MyAccount from './pages/Account';
import Books from './pages/books/All';
import NewBook from './pages/books/New';
import DetailBook from './pages/books/Detail';
import EditBook from './pages/books/Edit';
import NewStory from './pages/stories/New';
import EditStory from './pages/stories/Edit';
import ViewStory from './pages/stories/Detail';
import Chapters from './pages/chapters/Index';
import Terms from './pages/Terms';
import Policy from './pages/Policy';
import About from './pages/About';
import CookieConsent from './components/CookieConsent';
import { CookiesProvider } from 'react-cookie';

const store = configureStore();

const reduxFirebaseConfig = {
  firebase,
  config: {
    userProfile: 'users',
    useFirestoreForProfile: true,
  },
  dispatch: store.dispatch,
  createFirestoreInstance,
};

function App() {
  return (
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...reduxFirebaseConfig}>
        <ThemeProvider theme={theme}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Auth>
              <Router>
                <Switch>
                  <Route exact path={routes.LOGIN} component={Login} />
                  <Route exact path={routes.SIGNUP} component={Signup} />
                  <Route exact path={routes.FORGOTPASSWORD} component={ForgotPassword} />
                  <Route exact path={routes.MANAGEACCOUNT} component={ManageAccount} />

                  <PrivateRoute exact path={routes.HOME} component={Home} />
                  <PrivateRoute exact path={routes.NEWCHARACTER} component={NewCharacter} />
                  <PublicRoute exact path={routes.CHARACTER} component={DetailCharacter} />
                  <PrivateRoute exact path={routes.USERS} component={Users} />
                  <PrivateRoute exact path={routes.ACCOUNT} component={MyAccount} />
                  <PublicRoute exact path={routes.ROOT} component={Landing} />
                  <PublicRoute exact path={routes.BOOKS} component={Books} />
                  <PublicRoute exact path={routes.NEWBOOK} component={NewBook} />
                  <PublicRoute exact path={routes.DETAILBOOK} component={DetailBook} />
                  <PublicRoute exact path={routes.EDITBOOK} component={EditBook} />
                  <PublicRoute exact path={routes.NEWSTORY} component={NewStory} />
                  <PublicRoute exact path={routes.EDITSTORY} component={EditStory} />
                  <PublicRoute exact path={routes.VIEWSTORY} component={ViewStory} />
                  <PrivateRoute exact path={routes.NEWEVENT} component={NewEvent} />
                  <PrivateRoute exact path={routes.EDITEVENT} component={EditEvent} />
                  <PrivateRoute exact path={routes.BOOKSUCCESS} component={BookSuccess} />
                  <PrivateRoute
                    exact
                    path={routes.BOOKEVENT}
                    component={BookEvent}
                    payment={true}
                  />
                  <PublicRoute exact path={routes.EVENTDETAIL} component={EventDetails} />
                  <PublicRoute exact path={routes.EVENTS} component={AllEvents} />
                  <PublicRoute exact path={routes.BOOKCHAPTERS} component={Chapters} />
                  <PublicRoute exact path={routes.TERMS} component={Terms} />
                  <PublicRoute exact path={routes.POLICY} component={Policy} />
                  <PublicRoute exact path={routes.About} component={About} />
                  <PublicRoute path="*" component={NotFound} />
                </Switch>
              </Router>
            </Auth>
            <CookiesProvider>
              <CookieConsent />
            </CookiesProvider>
          </MuiPickersUtilsProvider>
        </ThemeProvider>
      </ReactReduxFirebaseProvider>
    </Provider>
  );
}

export default App;
