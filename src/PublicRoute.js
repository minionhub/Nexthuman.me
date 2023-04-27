import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Root from './pages/Root';

const PublicRoute = ({ component: Component, ...otherProps }) => {
  return (
    <Root>
      <Route {...otherProps} render={(props) => <Component {...props} />} />
    </Root>
  );
};

PublicRoute.propTypes = {
  component: PropTypes.func.isRequired,
};

export default PublicRoute;
